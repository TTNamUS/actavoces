use std::fs;
use std::path::PathBuf;

use super::*;
use crate::worker::runtime::worker_runtime_paths_from_local_data_directory;

fn scratch(name: &str) -> PathBuf {
    let root =
        std::env::temp_dir().join(format!("actavoces-uninstall-{name}-{}", std::process::id()));

    let _ = fs::remove_dir_all(&root);
    fs::create_dir_all(&root).unwrap();
    root
}

#[test]
fn remove_local_runtime_files_keeps_unrelated_model_files() {
    let root = scratch("runtime");
    let data = root.join("data");
    let models = root.join("models");
    let paths = worker_runtime_paths_from_local_data_directory(data.clone(), None);

    for directory in [
        &paths.worker_directory,
        &paths.uv_state_directory,
        paths.uv_executable.parent().unwrap(),
        &models.join("models--Systran--faster-whisper-small"),
    ] {
        fs::create_dir_all(directory).unwrap();
    }
    fs::write(models.join(SORTFORMER_MODEL_FILE), b"onnx").unwrap();

    remove_local_runtime_files(&paths, &models).unwrap();

    assert!(!paths.worker_directory.exists());
    assert!(!paths.uv_state_directory.exists());
    assert!(!paths.uv_executable.parent().unwrap().exists());
    assert!(!models
        .join("models--Systran--faster-whisper-small")
        .exists());
    assert!(models.join(SORTFORMER_MODEL_FILE).exists());
    let _ = fs::remove_dir_all(root);
}

#[test]
fn remove_speaker_label_files_keeps_whisper_models() {
    let root = scratch("speakers");

    fs::write(root.join(SORTFORMER_MODEL_FILE), b"onnx").unwrap();
    fs::create_dir_all(root.join("onnxruntime-win-x64-1.24.2")).unwrap();
    fs::write(root.join("onnxruntime-win-x64-1.24.2.zip"), b"zip").unwrap();
    fs::create_dir_all(root.join("models--Systran--faster-whisper-small")).unwrap();

    remove_speaker_label_files(&root).unwrap();

    assert!(!root.join(SORTFORMER_MODEL_FILE).exists());
    assert!(!root.join("onnxruntime-win-x64-1.24.2").exists());
    assert!(!root.join("onnxruntime-win-x64-1.24.2.zip").exists());
    assert!(root.join("models--Systran--faster-whisper-small").exists());
    let _ = fs::remove_dir_all(root);
}

#[test]
fn removal_is_a_no_op_when_nothing_is_installed() {
    let root = scratch("missing");
    let paths = worker_runtime_paths_from_local_data_directory(root.join("data"), None);

    remove_local_runtime_files(&paths, &root.join("no-models")).unwrap();
    remove_speaker_label_files(&root.join("no-models")).unwrap();
    let _ = fs::remove_dir_all(root);
}
