/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/settings/settings.h>
#include <kerf/display.h>
#include <kerf/service.h>

LOG_MODULE_REGISTER(kerf_display_rpc, CONFIG_ZMK_LOG_LEVEL);

static struct kerf_widget_config current_layout = {
	.show_battery = true,
	.show_layer = true,
	.show_bt_profile = true,
	.show_caps_lock = true,
	.show_wpm = false,
	.show_clock = false,
	.invert_colors = false,
	.rotate_180 = false,
	.screen_off_on_idle = true,
};

static uint8_t active_frame_buffer[KERF_DISPLAY_BYTES_PER_FRAME] = {0};

const struct kerf_widget_config *kerf_display_get_layout(void) {
	return &current_layout;
}

const uint8_t *kerf_display_get_frame(uint8_t frame_idx) {
	return active_frame_buffer;
}

int kerf_display_set_layout(const struct kerf_widget_config *layout) {
	if (!layout) return -EINVAL;
	memcpy(&current_layout, layout, sizeof(struct kerf_widget_config));
	return settings_save_one("kerf/disp/layout", layout, sizeof(struct kerf_widget_config));
}

int kerf_display_write_chunk(uint8_t frame_idx, uint16_t offset, const uint8_t *data, size_t len, bool is_last) {
	if (frame_idx >= KERF_MAX_DISPLAY_FRAMES || !data) {
		return -EINVAL;
	}
	if (offset + len > KERF_DISPLAY_BYTES_PER_FRAME) {
		return -EINVAL;
	}

	memcpy(&active_frame_buffer[offset], data, len);

	if (is_last) {
		char key[32];
		snprintf(key, sizeof(key), "kerf/disp/img/%d", frame_idx);
		return settings_save_one(key, active_frame_buffer, KERF_DISPLAY_BYTES_PER_FRAME);
	}
	return 0;
}

int kerf_handle_display_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* SetLayout */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < sizeof(struct kerf_widget_config)) return KERF_ERROR_INVALID;

		const struct kerf_widget_config *cfg = (const struct kerf_widget_config *)in;
		kerf_display_set_layout(cfg);
		out[0] = 1;
		*out_len = 1;
		return KERF_ERROR_OK;
	}

	case 2: { /* UploadChunk */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < 5) return KERF_ERROR_INVALID;

		uint8_t frame_idx = in[0];
		uint16_t offset = in[1] | (in[2] << 8);
		bool is_last = in[3] != 0;
		uint8_t data_len = in[4];

		if (in_len < 5 + data_len) return KERF_ERROR_INVALID;

		int ret = kerf_display_write_chunk(frame_idx, offset, &in[5], data_len, is_last);
		if (ret < 0) return KERF_ERROR_INVALID;

		out[0] = frame_idx;
		uint16_t next_offset = offset + data_len;
		out[1] = next_offset & 0xff;
		out[2] = (next_offset >> 8) & 0xff;
		out[3] = is_last ? 1 : 0;
		*out_len = 4;
		return KERF_ERROR_OK;
	}

	case 3: { /* SetAnimation */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < sizeof(struct kerf_animation_config)) return KERF_ERROR_INVALID;

		settings_save_one("kerf/disp/anim", in, sizeof(struct kerf_animation_config));
		out[0] = 1;
		*out_len = 1;
		return KERF_ERROR_OK;
	}

	case 4: { /* PushLiveData */
		/* Live PC data (transient; no flash save) */
		out[0] = 1;
		*out_len = 1;
		return KERF_ERROR_OK;
	}

	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}

static int kerf_display_settings_set(const char *name, size_t len, settings_read_cb read_cb, void *cb_arg) {
	const char *next;
	if (settings_name_steq(name, "layout", &next)) {
		if (len != sizeof(current_layout)) return -EINVAL;
		read_cb(cb_arg, &current_layout, sizeof(current_layout));
		return 0;
	}

	if (settings_name_steq(name, "img/0", &next)) {
		if (len != KERF_DISPLAY_BYTES_PER_FRAME) return -EINVAL;
		read_cb(cb_arg, active_frame_buffer, KERF_DISPLAY_BYTES_PER_FRAME);
		return 0;
	}

	return -ENOENT;
}

struct settings_handler kerf_display_conf = {
	.name = "kerf/disp",
	.h_set = kerf_display_settings_set,
};

int kerf_display_init(void) {
	settings_register(&kerf_display_conf);
	settings_load_subtree("kerf/disp");
	return 0;
}

SYS_INIT(kerf_display_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
