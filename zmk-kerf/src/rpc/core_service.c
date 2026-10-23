/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/sys/reboot.h>
#include <zephyr/logging/log.h>
#include <zmk/battery.h>
#include <kerf/service.h>
#include <kerf/settings.h>

LOG_MODULE_REGISTER(kerf_core_rpc, CONFIG_ZMK_LOG_LEVEL);

static bool device_is_locked = true;

bool kerf_is_locked(void) {
	return device_is_locked;
}

void kerf_set_locked(bool locked) {
	device_is_locked = locked;
}

int kerf_handle_core_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* GetDeviceInfo */
		uint8_t soc = zmk_battery_state_of_charge();
		out[0] = KERF_PROTOCOL_VERSION;
		out[1] = soc;
		out[2] = device_is_locked ? 1 : 0;
		*out_len = 3;
		return KERF_ERROR_OK;
	}
	case 2: { /* RebootBootloader */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		sys_reboot(SYS_REBOOT_COLD);
		return KERF_ERROR_OK;
	}
	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}
