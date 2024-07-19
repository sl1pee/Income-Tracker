use actix_cors::Cors;
use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use crate::json_handler::{IncomeData, IncomeEntry};
use std::fs::File;
use std::io::Write;

async fn get_income_data() -> impl Responder {
    let data = IncomeData::load_from_file("data.json").unwrap_or_default();
    web::Json(data)
}

async fn add_income_entry(entry: web::Json<IncomeEntry>) -> impl Responder {
    let mut data = IncomeData::load_from_file("data.json").unwrap_or_default();
    data.add_entry(entry.into_inner());
    data.save_to_file("data.json").unwrap();
    HttpResponse::Ok().json(data)
}

pub async fn start_server() -> std::io::Result<()> {
    // Ensure the data.json file exists
    if !std::path::Path::new("data.json").exists() {
        let mut file = File::create("data.json")?;
        file.write_all(b"{\"entries\":[]}")?;
    }

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .supports_credentials();

        App::new()
            .wrap(cors)
            .route("/income", web::get().to(get_income_data))
            .route("/income", web::post().to(add_income_entry))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
