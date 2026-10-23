/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>
#include <kerf/protocol.h>

#define KERF_DISPLAY_WIDTH 160
#define KERF_DISPLAY_HEIGHT 68
#define KERF_DISPLAY_BYTES_PER_FRAME ((KERF_DISPLAY_WIDTH * KERF_DISPLAY_HEIGHT) / 8) // 1360 bytes
#define KERF_MAX_DISPLAY_FRAMES 30
#define KERF_DISPLAY_CHUNK_SIZE 56

struct kerf_widget_config {
	bool show_battery;
	bool show_layer;
	bool show_bt_profile;
	bool show_caps_lock;
	bool show_wpm;
	bool show_clock;
	bool invert_colors;
	bool rotate_180;
	bool screen_off_on_idle;
};

struct kerf_animation_config {
	uint8_t total_frames;
	uint16_t frame_delay_ms;
	bool loop;
};

int kerf_display_init(void);
const struct kerf_widget_config *kerf_display_get_layout(void);
const uint8_t *kerf_display_get_frame(uint8_t frame_idx);
int kerf_display_set_layout(const struct kerf_widget_config *layout);
int kerf_display_write_chunk(uint8_t frame_idx, uint16_t offset, const uint8_t *data, size_t len, bool is_last);
