use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemTelemetry {
  pub cpu_temp_c: u32,
  pub gpu_temp_c: u32,
  pub memory_used_pct: u32,
  pub active_window_title: String,
}

pub struct TelemetryManager {}

impl TelemetryManager {
  pub fn new() -> Self {
    Self {}
  }

  pub fn sample_telemetry(&self) -> SystemTelemetry {
    // In production builds, this queries OS performance counters & active window handle
    SystemTelemetry {
      cpu_temp_c: 48,
      gpu_temp_c: 54,
      memory_used_pct: 42,
      active_window_title: "VS Code — KERF_Hub".to_string(),
    }
  }
}
