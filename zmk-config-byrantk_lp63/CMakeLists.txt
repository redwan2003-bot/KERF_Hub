# Copyright (c) 2026 Redwan / Kerf Keeb
# SPDX-License-Identifier: MIT

if(CONFIG_KERF_LED_SPLIT)
  target_sources(app PRIVATE src/kerf_led_split.c)
endif()

if(CONFIG_KERF_BATLED)
  target_sources(app PRIVATE src/kerf_batled.c src/behaviors/behavior_batled.c)
endif()

if(CONFIG_KERF_DONGLE_STATUS_LED)
  target_sources(app PRIVATE src/dongle_status_led.c)
endif()
