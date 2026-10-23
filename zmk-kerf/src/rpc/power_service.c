/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zmk/battery.h>
#include <kerf/service.h>
#include <kerf/settings.h>

LOG_MODULE_REGISTER(kerf_power_rpc, CONFIG_ZMK_LOG_LEVEL);

int kerf_handle_power_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* GetPowerConfig */
		const struct kerf_power_config *power = kerf_settings_get_power();
		memcpy(out, power, sizeof(*power));
		*out_len = sizeof(*power);
		return KERF_ERROR_OK;
	}
	case 2: { /* SetPowerConfig */
		if (kerf_is_locked()) {
			return KERF_ERROR_LOCKED;
		}
		if (in_len < sizeof(struct kerf_power_config)) {
			return KERF_ERROR_INVALID;
		}
		const struct kerf_power_config *cfg = (const struct kerf_power_config *)in;
		kerf_settings_save_power(cfg);
		*out_len = 0;
		return KERF_ERROR_OK;
	}
	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}
