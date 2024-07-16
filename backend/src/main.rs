mod json_handler;
mod server;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    server::start_server().await
}
