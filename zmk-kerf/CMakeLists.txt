# Copyright (c) 2026 Redwan / Kerf Keeb
# SPDX-License-Identifier: MIT

if(CONFIG_ZMK_KERF)
  zephyr_include_directories(include)

  target_sources(app PRIVATE
    src/settings/kerf_settings.c
    src/rpc/core_service.c
    src/rpc/lighting_service.c
    src/rpc/macros_service.c
    src/rpc/profiles_service.c
    src/rpc/power_service.c
    src/behaviors/behavior_kmacro.c
  )

  if(CONFIG_ZMK_KERF_USB_HID)
    target_sources(app PRIVATE src/transport/usb_hid.c)
  endif()

  if(CONFIG_ZMK_KERF_BLE_GATT)
    target_sources(app PRIVATE src/transport/ble_gatt.c)
  endif()
endif()
