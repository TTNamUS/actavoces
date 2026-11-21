use std::io::Cursor;
use std::path::Path;

use crate::diarization::load_mono_16k_samples;

const UPLOAD_SAMPLE_RATE: u32 = 16_000;
const CHUNK_SECONDS: usize = 600;

#[derive(Clone, Debug, PartialEq)]
pub(crate) struct AudioChunk {
    pub(crate) offset_seconds: f64,
    pub(crate) duration_seconds: f64,
    pub(crate) wav: Vec<u8>,
}

pub(crate) fn audio_chunks(audio_path: &Path) -> Result<Vec<AudioChunk>, String> {
    let samples = load_mono_16k_samples(audio_path)?;

    chunk_samples(&samples)
}

pub(crate) fn chunk_samples(samples: &[f32]) -> Result<Vec<AudioChunk>, String> {
    let chunk_length = CHUNK_SECONDS * UPLOAD_SAMPLE_RATE as usize;
    let mut chunks = Vec::new();

    for (index, window) in samples.chunks(chunk_length).enumerate() {
        chunks.push(AudioChunk {
            offset_seconds: (index * CHUNK_SECONDS) as f64,
            duration_seconds: window.len() as f64 / UPLOAD_SAMPLE_RATE as f64,
            wav: encode_wav(window)?,
        });
    }

    Ok(chunks)
}

fn encode_wav(samples: &[f32]) -> Result<Vec<u8>, String> {
    let spec = hound::WavSpec {
        channels: 1,
        sample_rate: UPLOAD_SAMPLE_RATE,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };
    let mut buffer = Cursor::new(Vec::new());
    let mut writer = hound::WavWriter::new(&mut buffer, spec).map_err(|error| error.to_string())?;

    for sample in samples {
        let value = (sample.clamp(-1.0, 1.0) * i16::MAX as f32) as i16;

        writer
            .write_sample(value)
            .map_err(|error| error.to_string())?;
    }
    writer.finalize().map_err(|error| error.to_string())?;

    Ok(buffer.into_inner())
}
