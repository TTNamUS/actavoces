use std::fs;
use std::io::ErrorKind;
use std::path::{Path, PathBuf};

use tauri::{Emitter, Manager};

use crate::diarization::SORTFORMER_MODEL_FILE;
use crate::domain::types::*;
use crate::worker::runtime::{
    persist_worker_setup_progress, worker_runtime_paths, WorkerRuntimePaths,
};

use super::pipeline::emit_snapshot_update;

const WHISPER_CACHE_PREFIX: &str = "models--";
const ONNXRUNTIME_PREFIX: &str = "onnxruntime-";

#[cfg(test)]
#[path = "uninstall_tests.rs"]
mod tests;

#[tauri::command]
pub async fn uninstall_local_runtime(app: tauri::AppHandle) -> Result<AppSnapshot, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let state = app.state::<ActavocesState>();
        let (installing, model_directory) = {
            let repository = state.repository()?;
            let installing = repository
                .desktop_runtime_status()
                .map_err(|error| error.to_string())?
                .worker_setup_status
                == WorkerSetupStatus::Installing;
            let settings = repository.settings().map_err(|error| error.to_string())?;

            (installing, PathBuf::from(settings.model_storage_directory))
        };

        if installing {
            return Err("Wait for the runtime install to finish before removing it".to_owned());
        }

        let paths = worker_runtime_paths(&app)?;

        remove_local_runtime_files(&paths, &model_directory)?;

        {
            let mut repository = state.repository()?;

            repository
                .clear_model_inventory()
                .map_err(|error| error.to_string())?;
            repository
                .update_diarization_runtime_ready(false)
                .map_err(|error| error.to_string())?;
        }

        let progress = WorkerSetupProgress {
            status: WorkerSetupStatus::Missing,
            step: "Local runtime removed".to_owned(),
            error: None,
        };

        persist_worker_setup_progress(&state, &progress)?;
        let _ = app.emit("worker-setup-progress", progress);
        publish_snapshot(&app, &state)
    })
    .await
    .map_err(|error| format!("Runtime removal task failed: {error}"))?
}

#[tauri::command]
pub async fn uninstall_speaker_labels(app: tauri::AppHandle) -> Result<AppSnapshot, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let state = app.state::<ActavocesState>();
        let model_directory = {
            let repository = state.repository()?;

            PathBuf::from(
                repository
                    .settings()
                    .map_err(|error| error.to_string())?
                    .model_storage_directory,
            )
        };

        remove_speaker_label_files(&model_directory)?;
        state
            .repository()?
            .update_diarization_runtime_ready(false)
            .map_err(|error| error.to_string())?;
        publish_snapshot(&app, &state)
    })
    .await
    .map_err(|error| format!("Speaker label removal task failed: {error}"))?
}

fn publish_snapshot(
    app: &tauri::AppHandle,
    state: &tauri::State<'_, ActavocesState>,
) -> Result<AppSnapshot, String> {
    let snapshot = state
        .repository()?
        .snapshot()
        .map_err(|error| error.to_string())?;

    emit_snapshot_update(app, &snapshot);

    Ok(snapshot)
}

/// Removes the Python environment, the copied uv binary, the uv cache and the
/// downloaded Whisper models. Recordings, transcripts and settings stay intact.
pub(crate) fn remove_local_runtime_files(
    paths: &WorkerRuntimePaths,
    model_directory: &Path,
) -> Result<(), String> {
    remove_path(&paths.worker_directory)?;
    remove_path(&paths.uv_state_directory)?;

    if let Some(uv_directory) = paths.uv_executable.parent() {
        remove_path(uv_directory)?;
    }

    remove_matching_entries(model_directory, |name| {
        name.starts_with(WHISPER_CACHE_PREFIX)
    })
}

/// Removes the Sortformer model and the ONNX Runtime it downloaded.
pub(crate) fn remove_speaker_label_files(model_directory: &Path) -> Result<(), String> {
    remove_matching_entries(model_directory, |name| {
        name == SORTFORMER_MODEL_FILE || name.starts_with(ONNXRUNTIME_PREFIX)
    })
}

fn remove_matching_entries(directory: &Path, matches: impl Fn(&str) -> bool) -> Result<(), String> {
    let entries = match fs::read_dir(directory) {
        Ok(entries) => entries,
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(format!("Unable to read {}: {error}", directory.display())),
    };

    for entry in entries {
        let entry = entry.map_err(|error| error.to_string())?;

        if entry.file_name().to_str().is_some_and(&matches) {
            remove_path(&entry.path())?;
        }
    }

    Ok(())
}

fn remove_path(path: &Path) -> Result<(), String> {
    let result = match path.is_dir() {
        true => fs::remove_dir_all(path),
        false => fs::remove_file(path),
    };

    match result {
        Ok(()) => Ok(()),
        Err(error) if error.kind() == ErrorKind::NotFound => Ok(()),
        Err(error) => Err(format!("Unable to remove {}: {error}", path.display())),
    }
}
