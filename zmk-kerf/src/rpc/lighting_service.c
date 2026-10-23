/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zmk/rgb_underglow.h>
#include <kerf/service.h>
#include <kerf/settings.h>

LOG_MODULE_REGISTER(kerf_lighting_rpc, CONFIG_ZMK_LOG_LEVEL);

int kerf_handle_lighting_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* GetLightingState */
		const struct kerf_underglow_config *light = kerf_settings_get_lighting();
		memcpy(out, light, sizeof(*light));
		*out_len = sizeof(*light);
		return KERF_ERROR_OK;
	}
	case 2: { /* SetUnderglowConfig */
		if (kerf_is_locked()) {
			return KERF_ERROR_LOCKED;
		}
		if (in_len < sizeof(struct kerf_underglow_config)) {
			return KERF_ERROR_INVALID;
		}
		const struct kerf_underglow_config *cfg = (const struct kerf_underglow_config *)in;
#if IS_ENABLED(CONFIG_ZMK_RGB_UNDERGLOW)
		if (cfg->on) {
			zmk_rgb_underglow_on();
			struct zmk_led_hsb hsb = {
				.h = cfg->hue,
				.s = cfg->saturation,
				.b = cfg->brightness,
			};
			zmk_rgb_underglow_set_hsb(hsb);
		} else {
			zmk_rgb_underglow_off();
		}
#endif
		kerf_settings_save_lighting(cfg);
		*out_len = 0;
		return KERF_ERROR_OK;
	}
	case 3: { /* SetBatledConfig */
		if (kerf_is_locked()) {
			return KERF_ERROR_LOCKED;
		}
		if (in_len < sizeof(struct kerf_batled_config)) {
			return KERF_ERROR_INVALID;
		}
		const struct kerf_batled_config *cfg = (const struct kerf_batled_config *)in;
		kerf_settings_save_batled(cfg);
		*out_len = 0;
		return KERF_ERROR_OK;
	}
	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}
