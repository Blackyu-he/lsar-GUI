use serde_json::Value;

use crate::error::LsarResult;
use crate::parsers::douyu::encryption_fetcher::EncryptionFetcher;
use crate::parsers::{ParsedResult, Parser};

mod constants;
mod encryption_fetcher;
mod models;
mod room_info_fetcher;
mod room_page_fetcher;
mod stream_info_parser;

use models::RoomInfo;
use room_info_fetcher::RoomInfoFetcher;
use room_page_fetcher::RoomPageFetcher;
use stream_info_parser::StreamInfoParser;

use crate::network::http::Client;

pub struct DouyuParser {
    room_id: u64,
    final_room_id: u64,
    http_client: Client,
    room_page_fetcher: RoomPageFetcher,
    room_info_fetcher: RoomInfoFetcher,
    stream_info_parser: StreamInfoParser,
    encryption_fetcher: EncryptionFetcher,
}

impl DouyuParser {
    pub fn new(room_id: u64) -> Self {
        let http_client = Client::new();

        DouyuParser {
            room_id,
            final_room_id: 0,
            http_client: http_client.clone(),
            room_page_fetcher: RoomPageFetcher::new(http_client.clone()),
            room_info_fetcher: RoomInfoFetcher::new(http_client.clone()),
            stream_info_parser: StreamInfoParser::new(),
            encryption_fetcher: EncryptionFetcher::new(http_client.clone()),
        }
    }

    async fn update_final_room_id(&mut self, html: &str) -> LsarResult<()> {
        self.final_room_id = self.stream_info_parser.extract_final_room_id(html)?;
        info!("Final room ID updated: {}", self.final_room_id);
        Ok(())
    }

    async fn is_replay(&self) -> LsarResult<bool> {
        let url = format!("https://www.douyu.com/betard/{}", self.final_room_id);
        let body: Value = self.http_client.get_json(&url, None).await?;
        let is_replay = body["room"]["videoLoop"].as_i64().unwrap_or(0);
        info!("Room replay status: {}", is_replay);
        Ok(is_replay == 1)
    }
}

impl Parser for DouyuParser {
    async fn parse(&mut self) -> LsarResult<ParsedResult> {
        trace!("Starting parsing process for Douyu stream");

        let html = self.room_page_fetcher.fetch(self.room_id).await?;
        self.update_final_room_id(&html).await?;

        if self.is_replay().await? {
            warn!("Stream is a replay, not a live stream");
            return Err(crate::error::RoomStateError::IsReplay.into());
        }

        let encryption = self
            .encryption_fetcher
            .fetch_encryption(self.final_room_id)
            .await?;
        debug!("Got encryption: {:?}", encryption);

        let room_info: RoomInfo = self
            .room_info_fetcher
            .fetch(self.final_room_id, &encryption)
            .await?;
        let parsed_result = self.stream_info_parser.parse(room_info, &html).await?;

        info!("Parsing process completed successfully");
        Ok(parsed_result)
    }
}

#[tauri::command]
pub async fn parse_douyu(room_id: u64) -> LsarResult<ParsedResult> {
    let mut douyu = DouyuParser::new(room_id);
    douyu.parse().await
}
