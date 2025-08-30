use rand::{distr::Uniform, rng, Rng};

const MS_TOKEN_LENGTH: usize = 172;
const CHARSET: &[u8] = b"ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789=";

pub(super) fn generate_ms_token() -> String {
    let mut rng = rng();
    let uniform = Uniform::new(0, CHARSET.len()).unwrap();

    (0..MS_TOKEN_LENGTH)
        .map(|_| CHARSET[rng.sample(uniform)] as char)
        .collect()
}
