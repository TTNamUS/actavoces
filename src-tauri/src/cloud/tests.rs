use serde_json::json;

use crate::cloud::audio::{chunk_samples, AudioChunk};
use crate::cloud::endpoint;
use crate::cloud::summarize::parse_summary_reply;
use crate::cloud::transcribe::{
    append_response, prompt_from_context, render_raw_transcript, supports_timestamps,
    CloudTranscript,
};

fn chunk(offset_seconds: f64) -> AudioChunk {
    AudioChunk {
        offset_seconds,
        duration_seconds: 4.0,
        wav: Vec::new(),
    }
}

#[test]
fn endpoint_joins_base_url_without_double_slash() {
    assert_eq!(
        endpoint("https://api.openai.com/v1/", "audio/transcriptions"),
        "https://api.openai.com/v1/audio/transcriptions"
    );
}

#[test]
fn chunk_samples_splits_long_audio_with_offsets() {
    let samples = vec![0.0_f32; 16_000 * 650];
    let chunks = chunk_samples(&samples).expect("chunks");

    assert_eq!(chunks.len(), 2);
    assert_eq!(chunks[1].offset_seconds, 600.0);
    assert_eq!(chunks[1].duration_seconds, 50.0);
}

#[test]
fn append_response_offsets_segments_and_assigns_words() {
    let mut transcript = CloudTranscript::default();
    let response = json!({
        "segments": [
            { "start": 0.0, "end": 1.5, "text": " Hello there" },
            { "start": 1.5, "end": 3.0, "text": " General" },
        ],
        "words": [
            { "word": "Hello", "start": 0.0, "end": 0.5 },
            { "word": "General", "start": 1.6, "end": 2.2 },
        ],
    });

    append_response(&mut transcript, &response, &chunk(600.0));

    assert_eq!(transcript.segments.len(), 2);
    assert_eq!(transcript.segments[1].start, 601.5);
    assert_eq!(transcript.words[0].segment_id, 0);
    assert_eq!(transcript.words[1].segment_id, 1);
    assert_eq!(transcript.words[1].start, 601.6);
}

#[test]
fn append_response_falls_back_to_single_segment_for_text_only() {
    let mut transcript = CloudTranscript::default();

    append_response(
        &mut transcript,
        &json!({ "text": "Just text" }),
        &chunk(0.0),
    );

    assert_eq!(transcript.segments.len(), 1);
    assert_eq!(transcript.segments[0].end, 4.0);
    assert!(transcript.words.is_empty());
}

#[test]
fn gpt_4o_models_do_not_request_timestamps() {
    assert!(supports_timestamps("whisper-1"));
    assert!(!supports_timestamps("gpt-4o-transcribe"));
}

#[test]
fn prompt_from_context_joins_glossary_lines() {
    assert_eq!(prompt_from_context("Acme\nKubernetes"), "Acme, Kubernetes");
}

#[test]
fn render_raw_transcript_formats_timestamps() {
    let mut transcript = CloudTranscript::default();

    append_response(&mut transcript, &json!({ "text": "Hi" }), &chunk(65.0));

    let rendered = render_raw_transcript(&transcript.segments, "Standup");

    assert!(rendered.starts_with("# Raw transcript - Standup"));
    assert!(rendered.contains("[01:05 - 01:09] Hi"));
}

#[test]
fn parse_summary_reply_reads_json_even_inside_code_fence() {
    let output =
        parse_summary_reply("```json\n{\"title\": \" Plan \", \"summary\": \"- one\"}\n```");

    assert_eq!(output.title, "Plan");
    assert_eq!(output.summary, "- one");
}

#[test]
fn parse_summary_reply_falls_back_to_plain_text() {
    let output = parse_summary_reply("Just a paragraph.");

    assert_eq!(output.title, "");
    assert_eq!(output.summary, "Just a paragraph.");
}
