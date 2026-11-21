#[cfg(test)]
mod tests;

use std::fs;
use std::io::ErrorKind;
use std::path::Path;

use super::{
    diarized_transcript_path, mixed_audio_path, raw_transcript_path,
    speaker_labeled_utterances_path, summary_path,
};
use crate::diarization::{SpeakerLabeledUtterance, SpeakerLabeledUtterancesArtifact};
use crate::domain::types::RecordingContent;

pub(crate) fn read_recording_content(
    artifact_directory: &Path,
) -> Result<RecordingContent, String> {
    let audio_path = mixed_audio_path(artifact_directory);

    Ok(RecordingContent {
        transcript_markdown: read_optional(&diarized_transcript_path(artifact_directory))?,
        raw_transcript_markdown: read_optional(&raw_transcript_path(artifact_directory))?,
        summary_markdown: read_optional(&summary_path(artifact_directory))?,
        utterances: read_utterances(artifact_directory)?,
        audio_path: audio_path
            .is_file()
            .then(|| audio_path.display().to_string()),
    })
}

fn read_optional(path: &Path) -> Result<Option<String>, String> {
    match fs::read_to_string(path) {
        Ok(content) => Ok(Some(content)),
        Err(error) if error.kind() == ErrorKind::NotFound => Ok(None),
        Err(error) => Err(error.to_string()),
    }
}

fn read_utterances(artifact_directory: &Path) -> Result<Vec<SpeakerLabeledUtterance>, String> {
    let content = read_optional(&speaker_labeled_utterances_path(artifact_directory))?;

    Ok(content
        .and_then(|json| serde_json::from_str::<SpeakerLabeledUtterancesArtifact>(&json).ok())
        .map(|artifact| artifact.utterances)
        .unwrap_or_default())
}
