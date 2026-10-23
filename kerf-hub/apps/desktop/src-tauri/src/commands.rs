use crate::transport::hid::{HidManager, NativeHidDeviceInfo};
use crate::transport::serial::{NativeSerialPortInfo, SerialManager};
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
  pub hid: Mutex<HidManager>,
  pub serial: Mutex<SerialManager>,
}

#[tauri::command]
pub fn kerf_list_hid_devices(state: State<'_, AppState>) -> Result<Vec<NativeHidDeviceInfo>, String> {
  let hid = state.hid.lock().map_err(|e| e.to_string())?;
  hid.list_devices()
}

#[tauri::command]
pub fn kerf_open_hid_device(state: State<'_, AppState>, path: String) -> Result<(), String> {
  let hid = state.hid.lock().map_err(|e| e.to_string())?;
  hid.open_device(&path)
}

#[tauri::command]
pub fn kerf_write_hid_report(state: State<'_, AppState>, data: Vec<u8>) -> Result<usize, String> {
  let hid = state.hid.lock().map_err(|e| e.to_string())?;
  hid.write_report(&data)
}

#[tauri::command]
pub fn kerf_read_hid_report(state: State<'_, AppState>, timeout_ms: i32) -> Result<Vec<u8>, String> {
  let hid = state.hid.lock().map_err(|e| e.to_string())?;
  hid.read_report(timeout_ms)
}

#[tauri::command]
pub fn kerf_close_hid_device(state: State<'_, AppState>) -> Result<(), String> {
  let hid = state.hid.lock().map_err(|e| e.to_string())?;
  hid.close_device()
}

#[tauri::command]
pub fn kerf_list_serial_ports(state: State<'_, AppState>) -> Result<Vec<NativeSerialPortInfo>, String> {
  let serial = state.serial.lock().map_err(|e| e.to_string())?;
  serial.list_ports()
}

#[tauri::command]
pub fn kerf_open_serial_port(state: State<'_, AppState>, port_name: String) -> Result<(), String> {
  let serial = state.serial.lock().map_err(|e| e.to_string())?;
  serial.open_port(&port_name)
}

#[tauri::command]
pub fn kerf_write_serial_bytes(state: State<'_, AppState>, data: Vec<u8>) -> Result<usize, String> {
  let serial = state.serial.lock().map_err(|e| e.to_string())?;
  serial.write_bytes(&data)
}

#[tauri::command]
pub fn kerf_read_serial_bytes(state: State<'_, AppState>) -> Result<Vec<u8>, String> {
  let serial = state.serial.lock().map_err(|e| e.to_string())?;
  serial.read_bytes()
}

#[tauri::command]
pub fn kerf_close_serial_port(state: State<'_, AppState>) -> Result<(), String> {
  let serial = state.serial.lock().map_err(|e| e.to_string())?;
  serial.close_port()
}
