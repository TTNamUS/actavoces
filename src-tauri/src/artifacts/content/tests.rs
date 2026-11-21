use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};

use super::read_recording_content;
use crate::artifacts::{
    diarized_transcript_path, meta_directory, mixed_audio_path, raw_transcript_path,
    speaker_labeled_utterances_path, summary_path,
};

static COUNTER: AtomicU64 = AtomicU64::new(0);

fn temp_directory() -> PathBuf {
    let path = env::temp_dir().join(format!(
        "actavoces-content-{}-{}",
        std::process::id(),
        COUNTER.fetch_add(1, Ordering::SeqCst)
    ));
    let _ = fs::remove_dir_all(&path);
    fs::create_dir_all(meta_directory(&path)).unwrap();
    path
}

#[test]
fn missing_artifacts_yield_empty_content_without_error() {
    let directory = temp_directory();

    let content = read_recording_content(&directory).unwrap();

    assert_eq!(content.transcript_markdown, None);
    assert_eq!(content.raw_transcript_markdown, None);
    assert_eq!(content.summary_markdown, None);
    assert!(content.utterances.is_empty());
    assert_eq!(content.audio_path, None);
}

#[test]
fn present_artifacts_are_read() {
    let directory = temp_directory();
    fs::write(diarized_transcript_path(&directory), "# Diarized").unwrap();
    fs::write(raw_transcript_path(&directory), "# Raw").unwrap();
    fs::write(summary_path(&directory), "# Summary").unwrap();
    fs::write(mixed_audio_path(&directory), b"RIFF").unwrap();
    fs::write(
        speaker_labeled_utterances_path(&directory),
        r#"{"utterances":[{"speaker":"Alice","start":0.0,"end":2.5,"text":"Hello there"}]}"#,
    )
    .unwrap();

    let content = read_recording_content(&directory).unwrap();

    assert_eq!(content.transcript_markdown.as_deref(), Some("# Diarized"));
    assert_eq!(content.raw_transcript_markdown.as_deref(), Some("# Raw"));
    assert_eq!(content.summary_markdown.as_deref(), Some("# Summary"));
    assert_eq!(content.utterances.len(), 1);
    assert_eq!(content.utterances[0].speaker, "Alice");
    assert_eq!(content.utterances[0].end, 2.5);
    assert_eq!(
        content.audio_path,
        Some(mixed_audio_path(&directory).display().to_string())
    );
}

#[test]
fn malformed_utterances_are_ignored() {
    let directory = temp_directory();
    fs::write(speaker_labeled_utterances_path(&directory), "not json").unwrap();

    let content = read_recording_content(&directory).unwrap();

    assert!(content.utterances.is_empty());
}
