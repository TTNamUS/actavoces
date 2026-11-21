pub(crate) mod audio;
pub(crate) mod summarize;
#[cfg(test)]
mod tests;
pub(crate) mod transcribe;

use std::time::Duration;

const REQUEST_TIMEOUT: Duration = Duration::from_secs(900);
const ERROR_BODY_LIMIT: usize = 300;

pub(crate) fn http_client() -> Result<reqwest::blocking::Client, String> {
    reqwest::blocking::Client::builder()
        .timeout(REQUEST_TIMEOUT)
        .build()
        .map_err(|error| error.to_string())
}

pub(crate) fn authorized(
    request: reqwest::blocking::RequestBuilder,
    api_key: &str,
) -> reqwest::blocking::RequestBuilder {
    match api_key.trim() {
        "" => request,
        key => request.bearer_auth(key),
    }
}

pub(crate) fn endpoint(base_url: &str, path: &str) -> String {
    format!("{}/{}", base_url.trim().trim_end_matches('/'), path)
}

pub(crate) fn read_json_response(
    response: reqwest::blocking::Response,
    label: &str,
) -> Result<serde_json::Value, String> {
    let status = response.status();
    let body = response.text().map_err(|error| error.to_string())?;

    if !status.is_success() {
        let detail: String = body.chars().take(ERROR_BODY_LIMIT).collect();

        return Err(format!("{label} failed ({status}): {detail}"));
    }

    serde_json::from_str(&body).map_err(|error| format!("{label} returned invalid JSON: {error}"))
}
