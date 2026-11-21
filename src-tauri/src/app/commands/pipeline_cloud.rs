use std::path::PathBuf;

use crate::artifacts::{artifact, mixed_audio_path};
use crate::cloud::summarize::{summarize_recording, CloudSummaryConfig};
use crate::cloud::transcribe::{
    transcribe_audio, write_transcript_artifacts, CloudTranscriptionConfig,
};
use crate::domain::types::*;
use crate::storage::repository::AppRepository;

use super::pipeline::{
    mark_stage_complete, mark_stage_failed, normalized_transcription_context, start_stage,
};
use super::recordings::rename_recording_outputs;

pub(super) fn run_cloud_transcription_stage(
    repository: &mut AppRepository,
    recording: &Recording,
    settings: &AppSettings,
    on_update: &mut impl FnMut(&mut AppRepository) -> Result<(), String>,
) -> Result<(), String> {
    let stage = PipelineStageId::Transcription;

    start_stage(
        repository,
        &recording.id,
        stage,
        "Cloud transcription started",
    )?;
    on_update(repository)?;

    let api_key = repository
        .read_transcription_cloud_api_key()
        .map_err(|error| error.to_string())?
        .unwrap_or_default();
    let config = CloudTranscriptionConfig {
        base_url: settings.transcription_cloud_base_url.clone(),
        model: settings.transcription_cloud_model.clone(),
        api_key,
        language: settings.transcription_language.clone(),
        context: normalized_transcription_context(&settings.transcription_context),
    };
    let artifact_directory = PathBuf::from(&recording.artifact_directory);
    let written =
        transcribe_audio(&config, &mixed_audio_path(&artifact_directory)).and_then(|transcript| {
            write_transcript_artifacts(&artifact_directory, &recording.title, &transcript)
        });
    let paths = match written {
        Ok(paths) => paths,
        Err(error) => {
            mark_stage_failed(repository, &recording.id, stage, &error)?;

            return on_update(repository);
        }
    };

    for (kind, label, path) in [
        (ArtifactKind::Segments, "Raw segments", paths.segments),
        (
            ArtifactKind::RawTranscript,
            "Raw transcript",
            paths.transcript,
        ),
        (ArtifactKind::RawWords, "Raw words", paths.words),
    ] {
        repository
            .upsert_artifact(&recording.id, &artifact(kind, label, path, true))
            .map_err(|error| error.to_string())?;
    }

    mark_stage_complete(
        repository,
        &recording.id,
        stage,
        "Cloud transcription complete",
    )?;
    on_update(repository)
}

pub(super) fn run_cloud_summary_stage(
    repository: &mut AppRepository,
    recording: &Recording,
    settings: &AppSettings,
    on_update: &mut impl FnMut(&mut AppRepository) -> Result<(), String>,
) -> Result<(), String> {
    let stage = PipelineStageId::Summary;

    start_stage(repository, &recording.id, stage, "Summary started")?;
    on_update(repository)?;

    let api_key = repository
        .read_summary_provider_api_key()
        .map_err(|error| error.to_string())?
        .unwrap_or_default();
    let config = CloudSummaryConfig {
        base_url: settings.provider_base_url.clone(),
        model: settings.provider_model.clone(),
        api_key,
        prompt: settings.summary_prompt.clone(),
    };
    let artifact_directory = PathBuf::from(&recording.artifact_directory);
    let output = match summarize_recording(&config, &artifact_directory) {
        Ok(output) => output,
        Err(error) => {
            mark_stage_failed(repository, &recording.id, stage, &error)?;

            return on_update(repository);
        }
    };

    repository
        .upsert_artifact(
            &recording.id,
            &artifact(
                ArtifactKind::Summary,
                "Summary",
                crate::artifacts::summary_path(&artifact_directory),
                true,
            ),
        )
        .map_err(|error| error.to_string())?;

    if !output.title.is_empty() {
        rename_recording_outputs(repository, recording, &output.title)?;
    }

    mark_stage_complete(repository, &recording.id, stage, "Summary complete")?;
    on_update(repository)
}
