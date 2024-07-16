use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use crate::json_handler::{IncomeData, IncomeEntry};

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
    HttpServer::new(|| {
        App::new()
            .route("/income", web::get().to(get_income_data))
            .route("/income", web::post().to(add_income_entry))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
