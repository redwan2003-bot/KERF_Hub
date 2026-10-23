/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>

#define KERF_PROTOCOL_VERSION 1

#define KERF_SUBSYSTEM_CORE     10
#define KERF_SUBSYSTEM_LIGHTING 11
#define KERF_SUBSYSTEM_MACROS   12
#define KERF_SUBSYSTEM_PROFILES 13
#define KERF_SUBSYSTEM_DISPLAY  14
#define KERF_SUBSYSTEM_POWER    15
#define KERF_SUBSYSTEM_POINTER  16

enum kerf_error_code {
	KERF_ERROR_OK = 0,
	KERF_ERROR_LOCKED = 1,
	KERF_ERROR_UNSUPPORTED = 2,
	KERF_ERROR_INVALID = 3,
	KERF_ERROR_NO_SPACE = 4,
	KERF_ERROR_BUSY = 5,
};

enum kerf_capability {
	KERF_CAP_KEYMAP              = 1 << 0,
	KERF_CAP_LIGHTING_UNDERGLOW  = 1 << 1,
	KERF_CAP_BATLED              = 1 << 2,
	KERF_CAP_MACROS              = 1 << 3,
	KERF_CAP_PROFILES            = 1 << 4,
	KERF_CAP_DISPLAY_NICEVIEW    = 1 << 5,
	KERF_CAP_POINTER             = 1 << 6,
	KERF_CAP_ENCODER             = 1 << 7,
};

struct kerf_underglow_config {
	bool on;
	uint16_t hue;
	uint8_t saturation;
	uint8_t brightness;
	uint8_t effect;
	uint8_t speed;
	bool auto_off_idle;
	bool auto_off_usb;
};

struct kerf_batled_config {
	uint8_t brightness;
	uint8_t low_brightness;
	uint16_t tap_ms;
	uint16_t max_hold_ms;
	uint8_t low_percent;
	uint8_t repeat_min;
};

struct kerf_power_config {
	uint8_t debounce_press_ms;
	uint8_t debounce_release_ms;
	uint32_t idle_timeout_ms;
	uint32_t deep_sleep_timeout_ms;
};
