use hidapi::{DeviceInfo, HidApi, HidDevice};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

pub const KERF_USB_VID: u16 = 0x1d50;
pub const KERF_USB_PID: u16 = 0x615e;
pub const KERF_RAW_HID_USAGE_PAGE: u16 = 0xff60;
pub const RAW_REPORT_SIZE: usize = 64;

#[derive(Debug, Serialize, Deserialize)]
pub struct NativeHidDeviceInfo {
  pub path: String,
  pub vendor_id: u16,
  pub product_id: u16,
  pub release_number: u16,
  pub manufacturer_string: Option<String>,
  pub product_string: Option<String>,
  pub usage_page: u16,
  pub usage: u16,
}

pub struct HidManager {
  api: Arc<Mutex<HidApi>>,
  active_device: Arc<Mutex<Option<HidDevice>>>,
}

impl HidManager {
  pub fn new() -> Result<Self, String> {
    let api = HidApi::new().map_err(|e| e.to_string())?;
    Ok(Self {
      api: Arc::new(Mutex::new(api)),
      active_device: Arc::new(Mutex::new(None)),
    })
  }

  pub fn list_devices(&self) -> Result<Vec<NativeHidDeviceInfo>, String> {
    let mut api = self.api.lock().map_err(|e| e.to_string())?;
    api.refresh_devices().map_err(|e| e.to_string())?;

    let mut result = Vec::new();
    for dev in api.device_list() {
      if dev.vendor_id() == KERF_USB_VID && dev.product_id() == KERF_USB_PID {
        result.push(NativeHidDeviceInfo {
          path: dev.path().to_string_lossy().to_string(),
          vendor_id: dev.vendor_id(),
          product_id: dev.product_id(),
          release_number: dev.release_number(),
          manufacturer_string: dev.manufacturer_string().map(|s| s.to_string()),
          product_string: dev.product_string().map(|s| s.to_string()),
          usage_page: dev.usage_page(),
          usage: dev.usage(),
        });
      }
    }
    Ok(result)
  }

  pub fn open_device(&self, path: &str) -> Result<(), String> {
    let api = self.api.lock().map_err(|e| e.to_string())?;
    let c_path = std::ffi::CString::new(path).map_err(|e| e.to_string())?;
    let dev = api.open_path(&c_path).map_err(|e| e.to_string())?;

    let mut active = self.active_device.lock().map_err(|e| e.to_string())?;
    *active = Some(dev);
    Ok(())
  }

  pub fn write_report(&self, data: &[u8]) -> Result<usize, String> {
    let active = self.active_device.lock().map_err(|e| e.to_string())?;
    if let Some(dev) = active.as_ref() {
      dev.write(data).map_err(|e| e.to_string())
    } else {
      Err("No active HID device connected".to_string())
    }
  }

  pub fn read_report(&self, timeout_ms: i32) -> Result<Vec<u8>, String> {
    let active = self.active_device.lock().map_err(|e| e.to_string())?;
    if let Some(dev) = active.as_ref() {
      let mut buf = vec![0u8; RAW_REPORT_SIZE];
      let bytes_read = dev.read_timeout(&mut buf, timeout_ms).map_err(|e| e.to_string())?;
      buf.truncate(bytes_read);
      Ok(buf)
    } else {
      Err("No active HID device connected".to_string())
    }
  }

  pub fn close_device(&self) -> Result<(), String> {
    let mut active = self.active_device.lock().map_err(|e| e.to_string())?;
    *active = None;
    Ok(())
  }
}
