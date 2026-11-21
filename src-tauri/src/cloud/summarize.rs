use std::fs;
use std::path::Path;

use serde_json::Value;

use crate::artifacts::{diarized_transcript_path, raw_transcript_path, summary_path};
use crate::cloud::{authorized, endpoint, http_client, read_json_response};

const SYSTEM_PROMPT: &str = "You are a transcript summary and title creator. Respond with only a JSON object of the form {\"title\": string, \"summary\": string}. The summary is Markdown.";
const TITLE_INSTRUCTION: &str = "Create a concise meeting title from the transcript.";

#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) struct CloudSummaryConfig {
    pub(crate) base_url: String,
    pub(crate) model: String,
    pub(crate) api_key: String,
    pub(crate) prompt: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) struct SummaryOutput {
    pub(crate) title: String,
    pub(crate) summary: String,
}

pub(crate) fn summarize_recording(
    config: &CloudSummaryConfig,
    artifact_directory: &Path,
) -> Result<SummaryOutput, String> {
    let transcript = read_transcript(artifact_directory)?;
    let reply = request_completion(config, &transcript)?;
    let output = parse_summary_reply(&reply);

    fs::write(
        summary_path(artifact_directory),
        format!("# Summary\n\n{}\n", output.summary),
    )
    .map_err(|error| error.to_string())?;

    Ok(output)
}

fn read_transcript(artifact_directory: &Path) -> Result<String, String> {
    for path in [
        diarized_transcript_path(artifact_directory),
        raw_transcript_path(artifact_directory),
    ] {
        let content = fs::read_to_string(path).unwrap_or_default();

        if !content.trim().is_empty() {
            return Ok(content.trim().to_owned());
        }
    }

    Err("No transcript is available to summarize".to_owned())
}

fn request_completion(config: &CloudSummaryConfig, transcript: &str) -> Result<String, String> {
    let prompt = match config.prompt.trim() {
        "" => crate::settings::DEFAULT_SUMMARY_PROMPT,
        prompt => prompt,
    };
    let body = serde_json::json!({
        "model": config.model,
        "temperature": 0.2,
        "messages": [
            { "role": "system", "content": SYSTEM_PROMPT },
            {
                "role": "user",
                "content": format!("{prompt}\n\n{TITLE_INSTRUCTION}\n\nTranscript:\n```\n{transcript}\n```"),
            },
        ],
    });
    let response = authorized(
        http_client()?.post(endpoint(&config.base_url, "chat/completions")),
        &config.api_key,
    )
    .json(&body)
    .send()
    .map_err(|error| format!("Summary request failed: {error}"))?;
    let value = read_json_response(response, "Summary request")?;

    value
        .pointer("/choices/0/message/content")
        .and_then(Value::as_str)
        .map(str::to_owned)
        .ok_or_else(|| "Summary provider returned no content".to_owned())
}

pub(crate) fn parse_summary_reply(reply: &str) -> SummaryOutput {
    let trimmed = reply.trim();
    let candidate = match (trimmed.find('{'), trimmed.rfind('}')) {
        (Some(start), Some(end)) if end > start => &trimmed[start..=end],
        _ => trimmed,
    };

    match serde_json::from_str::<Value>(candidate) {
        Ok(value) => {
            let summary = value.get("summary").and_then(Value::as_str);

            match summary {
                Some(summary) => SummaryOutput {
                    title: field(&value, "title"),
                    summary: summary.trim().to_owned(),
                },
                None => plain_summary(trimmed),
            }
        }
        Err(_) => plain_summary(trimmed),
    }
}

fn field(value: &Value, key: &str) -> String {
    value
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or_default()
        .trim()
        .to_owned()
}

fn plain_summary(reply: &str) -> SummaryOutput {
    SummaryOutput {
        title: String::new(),
        summary: reply.to_owned(),
    }
}
