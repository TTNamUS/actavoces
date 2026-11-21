use std::path::Path;

use tauri::Manager;

use crate::artifacts::read_recording_content;
use crate::domain::types::*;

#[tauri::command]
pub fn get_recording_content(
    input: RecordingContentInput,
    app: tauri::AppHandle,
    state: tauri::State<'_, ActavocesState>,
) -> Result<RecordingContent, String> {
    let recording = state
        .repository()?
        .recording_by_id(&input.recording_id)
        .map_err(|error| error.to_string())?
        .ok_or_else(|| format!("Recording {} was not found", input.recording_id))?;
    let content = read_recording_content(Path::new(&recording.artifact_directory))?;

    if let Some(audio_path) = &content.audio_path {
        app.asset_protocol_scope()
            .allow_file(audio_path)
            .map_err(|error| error.to_string())?;
    }

    Ok(content)
}
