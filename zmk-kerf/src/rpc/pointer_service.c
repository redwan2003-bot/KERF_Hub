/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/settings/settings.h>
#include <kerf/pointer.h>
#include <kerf/service.h>

LOG_MODULE_REGISTER(kerf_pointer_rpc, CONFIG_ZMK_LOG_LEVEL);

static struct kerf_pointer_config pointer_cfg = {
	.active_stage = 1,
	.stage_count = 4,
	.stages = {
		{ .stage_id = 0, .dpi_x = 400, .dpi_y = 400, .color_hex = 0xFF0000 },
		{ .stage_id = 1, .dpi_x = 800, .dpi_y = 800, .color_hex = 0x00FF00 },
		{ .stage_id = 2, .dpi_x = 1600, .dpi_y = 1600, .color_hex = 0x0000FF },
		{ .stage_id = 3, .dpi_x = 3200, .dpi_y = 3200, .color_hex = 0xFFFF00 },
	},
	.polling_rate = KERF_POLLING_1000HZ,
	.lod = KERF_LOD_1MM,
	.motion_sync = true,
	.ripple_control = false,
	.angle_snapping = false,
};

const struct kerf_pointer_config *kerf_pointer_get_config(void) {
	return &pointer_cfg;
}

int kerf_pointer_set_config(const struct kerf_pointer_config *cfg) {
	if (!cfg) return -EINVAL;
	memcpy(&pointer_cfg, cfg, sizeof(struct kerf_pointer_config));
	return settings_save_one("kerf/mouse/cfg", cfg, sizeof(struct kerf_pointer_config));
}

int kerf_handle_pointer_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* GetPointerConfig */
		memcpy(out, &pointer_cfg, sizeof(struct kerf_pointer_config));
		*out_len = sizeof(struct kerf_pointer_config);
		return KERF_ERROR_OK;
	}

	case 2: { /* SetPointerConfig */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < sizeof(struct kerf_pointer_config)) return KERF_ERROR_INVALID;

		const struct kerf_pointer_config *cfg = (const struct kerf_pointer_config *)in;
		kerf_pointer_set_config(cfg);

		out[0] = 1;
		*out_len = 1;
		return KERF_ERROR_OK;
	}

	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}

static int kerf_pointer_settings_set(const char *name, size_t len, settings_read_cb read_cb, void *cb_arg) {
	const char *next;
	if (settings_name_steq(name, "cfg", &next)) {
		if (len != sizeof(pointer_cfg)) return -EINVAL;
		read_cb(cb_arg, &pointer_cfg, sizeof(pointer_cfg));
		return 0;
	}
	return -ENOENT;
}

struct settings_handler kerf_pointer_conf = {
	.name = "kerf/mouse",
	.h_set = kerf_pointer_settings_set,
};

int kerf_pointer_init(void) {
	settings_register(&kerf_pointer_conf);
	settings_load_subtree("kerf/mouse");
	return 0;
}

SYS_INIT(kerf_pointer_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
