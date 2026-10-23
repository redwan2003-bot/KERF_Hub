use serde::{Deserialize, Serialize};
use serialport::{SerialPort, SerialPortType};
use std::sync::{Arc, Mutex};
use std::time::Duration;

pub const KERF_SERIAL_BAUD: u32 = 115_200;

#[derive(Debug, Serialize, Deserialize)]
pub struct NativeSerialPortInfo {
  pub port_name: String,
  pub vid: Option<u16>,
  pub pid: Option<u16>,
  pub product: Option<String>,
}

pub struct SerialManager {
  active_port: Arc<Mutex<Option<Box<dyn SerialPort>>>>,
}

impl SerialManager {
  pub fn new() -> Self {
    Self {
      active_port: Arc::new(Mutex::new(None)),
    }
  }

  pub fn list_ports(&self) -> Result<Vec<NativeSerialPortInfo>, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;
    let mut result = Vec::new();

    for p in ports {
      let mut vid = None;
      let mut pid = None;
      let mut product = None;

      if let SerialPortType::UsbPort(usb_info) = p.port_type {
        vid = Some(usb_info.vid);
        pid = Some(usb_info.pid);
        product = usb_info.product;
      }

      result.push(NativeSerialPortInfo {
        port_name: p.port_name,
        vid,
        pid,
        product,
      });
    }

    Ok(result)
  }

  pub fn open_port(&self, port_name: &str) -> Result<(), String> {
    let port = serialport::new(port_name, KERF_SERIAL_BAUD)
      .timeout(Duration::from_millis(500))
      .open()
      .map_err(|e| e.to_string())?;

    let mut active = self.active_port.lock().map_err(|e| e.to_string())?;
    *active = Some(port);
    Ok(())
  }

  pub fn write_bytes(&self, data: &[u8]) -> Result<usize, String> {
    let mut active = self.active_port.lock().map_err(|e| e.to_string())?;
    if let Some(port) = active.as_mut() {
      port.write_all(data).map_err(|e| e.to_string())?;
      port.flush().map_err(|e| e.to_string())?;
      Ok(data.len())
    } else {
      Err("No active serial port connected".to_string())
    }
  }

  pub fn read_bytes(&self) -> Result<Vec<u8>, String> {
    let mut active = self.active_port.lock().map_err(|e| e.to_string())?;
    if let Some(port) = active.as_mut() {
      let mut buf = vec![0u8; 1024];
      match port.read(&mut buf) {
        Ok(n) => {
          buf.truncate(n);
          Ok(buf)
        }
        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => Ok(Vec::new()),
        Err(e) => Err(e.to_string()),
      }
    } else {
      Err("No active serial port connected".to_string())
    }
  }

  pub fn close_port(&self) -> Result<(), String> {
    let mut active = self.active_port.lock().map_err(|e| e.to_string())?;
    *active = None;
    Ok(())
  }
}
