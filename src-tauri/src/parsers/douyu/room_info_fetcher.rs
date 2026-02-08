use reqwest::header::{HeaderMap, HeaderValue, REFERER};
use serde_json::Value;

use crate::error::{LsarResult, RequestError, RoomStateError};
use crate::network::http::Client;
use crate::parsers::douyu::constants::DEVICE_ID;
use crate::parsers::douyu::encryption_fetcher::Encryption;

use super::constants::{INVALID_REQUEST, ROOM_OFFLINE_STATE};
use super::models::RoomInfo;

pub struct RoomInfoFetcher {
    http_client: Client,
}

impl RoomInfoFetcher {
    pub fn new(http_client: Client) -> Self {
        RoomInfoFetcher { http_client }
    }

    pub async fn fetch(&self, room_id: u64, encryption: &Encryption) -> LsarResult<RoomInfo> {
        let form = [
            ("enc_data", encryption.enc_data.clone()),
            ("tt", encryption.ts.to_string()),
            ("did", DEVICE_ID.to_string()),
            ("auth", encryption.auth.clone()),
            ("cdn", "".to_string()),
            ("rate", "-1".to_string()), // 0蓝光、3超清、2高清、-1默认
            ("hevc", "0".to_string()),
            ("fa", "0".to_string()),
            ("ive", "0".to_string()),
        ];

        let url = format!("https://www.douyu.com/lapi/live/getH5PlayV1/{}", room_id);
        let headers = HeaderMap::from_iter([(
            REFERER,
            HeaderValue::from_str(&format!("https://www.douyu.com/{}", room_id)).unwrap(),
        )]);
        let room_info_value: Value = self.http_client.post_form(&url, &form, headers).await?;
        debug!("Fetched room info: {}", room_info_value);

        let error_code = room_info_value["error"].as_i64().unwrap_or(0);
        if error_code == -15 {
            return Err(RequestError::BadRequest.into());
        }
        if error_code == -5 {
            return Err(RoomStateError::Offline.into());
        }

        let room_info: RoomInfo = serde_json::from_value(room_info_value)?;

        info!("Successfully fetched room info for room_id: {}", room_id);

        self.validate_room_info(&room_info)?;

        Ok(room_info)
    }

    fn validate_room_info(&self, room_info: &RoomInfo) -> LsarResult<()> {
        trace!("Validating room info");
        if room_info.error != 0 {
            warn!(
                "Room info error: {} (error code: {})",
                room_info.msg, room_info.error
            );
            if room_info.msg == ROOM_OFFLINE_STATE {
                error!("Room is offline");
                return Err(RoomStateError::Offline.into());
            }
            if room_info.msg == INVALID_REQUEST {
                error!("Invalid request error");
                return Err(RequestError::BadRequest.into());
            }
        }

        debug!("Room info validation successful");
        Ok(())
    }
}
