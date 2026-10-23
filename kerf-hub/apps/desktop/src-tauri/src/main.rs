// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod transport;

use commands::*;
use std::sync::Mutex;
use transport::hid::HidManager;
use transport::serial::SerialManager;

fn main() {
  let hid_manager = HidManager::new().expect("Failed to initialize HID API");
  let serial_manager = SerialManager::new();

  let app_state = AppState {
    hid: Mutex::new(hid_manager),
    serial: Mutex::new(serial_manager),
  };

  tauri::Builder::default()
    .manage(app_state)
    .invoke_handler(tauri::generate_handler![
      kerf_list_hid_devices,
      kerf_open_hid_device,
      kerf_write_hid_report,
      kerf_read_hid_report,
      kerf_close_hid_device,
      kerf_list_serial_ports,
      kerf_open_serial_port,
      kerf_write_serial_bytes,
      kerf_read_serial_bytes,
      kerf_close_serial_port,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
