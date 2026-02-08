use reqwest::header::{HeaderMap, HeaderValue, REFERER};
use serde::Deserialize;

use crate::error::{LsarError, Result};
use crate::network::http::Client;
use crate::parsers::douyu::constants::DEVICE_ID;
use crate::utils::{md5, now};

#[derive(Debug, Deserialize)]
struct EncryptionData {
    rand_str: String,
    key: String,
    enc_time: u8,
    is_special: u8,
    enc_data: String,
}

#[derive(Debug, Deserialize)]
struct EncryptionResponse {
    error: i8,
    msg: String,
    data: EncryptionData,
}

#[derive(Debug)]
pub struct Encryption {
    pub enc_data: String,
    pub ts: u64,
    pub auth: String,
}

pub struct EncryptionFetcher {
    client: Client,
}

impl EncryptionFetcher {
    pub fn new(client: Client) -> Self {
        Self { client }
    }

    pub async fn fetch_encryption(&self, room_id: u64) -> Result<Encryption> {
        let url = format!(
            "https://www.douyu.com/wgapi/livenc/liveweb/websec/getEncryption?did={}",
            DEVICE_ID
        );
        let headers = HeaderMap::from_iter([(
            REFERER,
            HeaderValue::from_str(&format!("https://www.douyu.com/{}", room_id)).unwrap(),
        )]);
        let data: EncryptionResponse = self.client.get_json(&url, headers).await?;
        if data.error != 0 {
            return Err(LsarError::Other(format!(
                "Douyu encryption fetch failed: {}",
                data.msg
            )));
        }

        let ts = now()?.as_secs();
        let sign_str = if data.data.is_special == 1 {
            "".to_string()
        } else {
            format!("{}{}", room_id, ts)
        };

        let mut auth = data.data.rand_str;
        for _ in 0..data.data.enc_time {
            auth = md5(format!("{}{}", auth, data.data.key));
        }
        auth = md5(format!("{}{}{}", auth, data.data.key, sign_str));

        Ok(Encryption {
            enc_data: data.data.enc_data,
            ts,
            auth,
        })
    }
}
