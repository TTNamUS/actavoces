use std::fs;
use std::path::{Path, PathBuf};

use reqwest::blocking::multipart::{Form, Part};
use serde_json::Value;

use crate::artifacts::{meta_directory, raw_segments_path, raw_transcript_path, raw_words_path};
use crate::cloud::audio::{audio_chunks, AudioChunk};
use crate::cloud::{authorized, endpoint, http_client, read_json_response};
use crate::diarization::{TranscriptSegment, TranscriptWord};

const PROMPT_CHAR_LIMIT: usize = 800;

#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) struct CloudTranscriptionConfig {
    pub(crate) base_url: String,
    pub(crate) model: String,
    pub(crate) api_key: String,
    pub(crate) language: String,
    pub(crate) context: Option<String>,
}

#[derive(Clone, Debug, Default, PartialEq)]
pub(crate) struct CloudTranscript {
    pub(crate) segments: Vec<TranscriptSegment>,
    pub(crate) words: Vec<TranscriptWord>,
}

#[derive(Clone, Debug, PartialEq)]
pub(crate) struct CloudTranscriptPaths {
    pub(crate) segments: PathBuf,
    pub(crate) words: PathBuf,
    pub(crate) transcript: PathBuf,
}

pub(crate) fn transcribe_audio(
    config: &CloudTranscriptionConfig,
    audio_path: &Path,
) -> Result<CloudTranscript, String> {
    if !audio_path.exists() {
        return Err(format!(
            "Audio file does not exist: {}",
            audio_path.display()
        ));
    }

    let client = http_client()?;
    let mut transcript = CloudTranscript::default();

    for chunk in audio_chunks(audio_path)? {
        let response = request_chunk(&client, config, &chunk)?;

        append_response(&mut transcript, &response, &chunk);
    }

    Ok(transcript)
}

fn request_chunk(
    client: &reqwest::blocking::Client,
    config: &CloudTranscriptionConfig,
    chunk: &AudioChunk,
) -> Result<Value, String> {
    let file = Part::bytes(chunk.wav.clone())
        .file_name("recording.wav")
        .mime_str("audio/wav")
        .map_err(|error| error.to_string())?;
    let mut form = Form::new()
        .part("file", file)
        .text("model", config.model.clone());

    form = match supports_timestamps(&config.model) {
        true => form
            .text("response_format", "verbose_json")
            .text("timestamp_granularities[]", "word")
            .text("timestamp_granularities[]", "segment"),
        false => form.text("response_format", "json"),
    };

    if config.language != "auto" && !config.language.trim().is_empty() {
        form = form.text("language", config.language.clone());
    }

    if let Some(context) = &config.context {
        form = form.text("prompt", prompt_from_context(context));
    }

    let response = authorized(
        client.post(endpoint(&config.base_url, "audio/transcriptions")),
        &config.api_key,
    )
    .multipart(form)
    .send()
    .map_err(|error| format!("Cloud transcription request failed: {error}"))?;

    read_json_response(response, "Cloud transcription")
}

pub(crate) fn supports_timestamps(model: &str) -> bool {
    !model.trim().to_lowercase().starts_with("gpt-4o")
}

pub(crate) fn prompt_from_context(context: &str) -> String {
    let joined = context.lines().collect::<Vec<_>>().join(", ");

    joined.chars().take(PROMPT_CHAR_LIMIT).collect()
}

pub(crate) fn append_response(
    transcript: &mut CloudTranscript,
    response: &Value,
    chunk: &AudioChunk,
) {
    let first_segment_id = transcript.segments.len();
    let segments = response_segments(response, chunk);

    for segment in &segments {
        transcript.segments.push(TranscriptSegment {
            start: segment.start + chunk.offset_seconds,
            end: segment.end + chunk.offset_seconds,
            text: segment.text.clone(),
        });
    }

    for word in response_words(response) {
        let segment_id = segment_index_for(&segments, word.start + word.end);

        transcript.words.push(TranscriptWord {
            segment_id: first_segment_id + segment_id,
            text: word.text,
            start: word.start + chunk.offset_seconds,
            end: word.end + chunk.offset_seconds,
            probability: None,
        });
    }
}

fn response_segments(response: &Value, chunk: &AudioChunk) -> Vec<TranscriptSegment> {
    let parsed: Vec<TranscriptSegment> = response
        .get("segments")
        .and_then(Value::as_array)
        .map(|items| items.iter().filter_map(segment_from_value).collect())
        .unwrap_or_default();

    if !parsed.is_empty() {
        return parsed;
    }

    let text = response
        .get("text")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .trim();

    match text.is_empty() {
        true => Vec::new(),
        false => vec![TranscriptSegment {
            start: 0.0,
            end: chunk.duration_seconds,
            text: text.to_owned(),
        }],
    }
}

fn segment_from_value(value: &Value) -> Option<TranscriptSegment> {
    let text = value.get("text")?.as_str()?.trim();

    if text.is_empty() {
        return None;
    }

    Some(TranscriptSegment {
        start: value.get("start")?.as_f64()?,
        end: value.get("end")?.as_f64()?,
        text: text.to_owned(),
    })
}

fn response_words(response: &Value) -> Vec<TranscriptWord> {
    response
        .get("words")
        .and_then(Value::as_array)
        .map(|items| items.iter().filter_map(word_from_value).collect())
        .unwrap_or_default()
}

fn word_from_value(value: &Value) -> Option<TranscriptWord> {
    Some(TranscriptWord {
        segment_id: 0,
        text: value.get("word")?.as_str()?.trim().to_owned(),
        start: value.get("start")?.as_f64()?,
        end: value.get("end")?.as_f64()?,
        probability: None,
    })
}

fn segment_index_for(segments: &[TranscriptSegment], start_plus_end: f64) -> usize {
    let midpoint = start_plus_end / 2.0;

    segments
        .iter()
        .rposition(|segment| segment.start <= midpoint)
        .unwrap_or(0)
}

pub(crate) fn write_transcript_artifacts(
    artifact_directory: &Path,
    title: &str,
    transcript: &CloudTranscript,
) -> Result<CloudTranscriptPaths, String> {
    fs::create_dir_all(meta_directory(artifact_directory)).map_err(|error| error.to_string())?;

    let paths = CloudTranscriptPaths {
        segments: raw_segments_path(artifact_directory),
        words: raw_words_path(artifact_directory),
        transcript: raw_transcript_path(artifact_directory),
    };
    let segments: Vec<Value> = transcript
        .segments
        .iter()
        .enumerate()
        .map(|(id, segment)| {
            serde_json::json!({
                "id": id,
                "start": segment.start,
                "end": segment.end,
                "text": segment.text,
            })
        })
        .collect();

    write_json(
        &paths.segments,
        &serde_json::json!({ "segments": segments }),
    )?;
    write_json(
        &paths.words,
        &serde_json::json!({ "words": transcript.words }),
    )?;
    fs::write(
        &paths.transcript,
        render_raw_transcript(&transcript.segments, title),
    )
    .map_err(|error| error.to_string())?;

    Ok(paths)
}

pub(crate) fn render_raw_transcript(segments: &[TranscriptSegment], title: &str) -> String {
    let heading = match title.trim() {
        "" => "Raw transcript".to_owned(),
        title => format!("Raw transcript - {title}"),
    };
    let mut lines = vec![format!("# {heading}"), String::new()];

    for segment in segments {
        lines.push(format!(
            "[{} - {}] {}",
            format_timestamp(segment.start),
            format_timestamp(segment.end),
            segment.text.trim()
        ));
    }
    lines.push(String::new());

    lines.join("\n")
}

fn format_timestamp(value: f64) -> String {
    let total_seconds = value.max(0.0) as u64;

    format!("{:02}:{:02}", total_seconds / 60, total_seconds % 60)
}

fn write_json(path: &Path, value: &Value) -> Result<(), String> {
    let content = serde_json::to_string_pretty(value).map_err(|error| error.to_string())?;

    fs::write(path, format!("{content}\n")).map_err(|error| error.to_string())
}
