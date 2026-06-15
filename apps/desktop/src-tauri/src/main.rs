#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn create_return() -> String {
    "return-created".to_string()
}

#[tauri::command]
fn save_return(_id: String) -> bool {
    true
}

#[tauri::command]
fn load_return(id: String) -> String {
    format!("loaded: {}", id)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_return,
            save_return,
            load_return
        ])
        .run(tauri::generate_context!())
        .expect("failed to run application");
}