/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/sys/reboot.h>
#include <zephyr/logging/log.h>
#include <zephyr/settings/settings.h>
#if defined(CONFIG_SOC_FAMILY_NRF)
#include <hal/nrf_power.h>
#endif
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
#if defined(NRF_POWER)
		/* 0x57 = 'W' triggers the Adafruit/Nordic UF2 bootloader into DFU mass storage mode */
		NRF_POWER->GPREGRET = 0x57;
#endif
		sys_reboot(SYS_REBOOT_WARM);
		return KERF_ERROR_OK;
	}
	case 3: { /* FactoryReset */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		LOG_WRN("Kerf Factory Reset requested: wiping settings");
		settings_delete("kerf/light");
		settings_delete("kerf/batled");
		settings_delete("kerf/power");
		settings_delete("kerf/prof/active");
		settings_delete("kerf/prof/0");
		settings_delete("kerf/prof/1");
		settings_delete("kerf/prof/2");
		for (int i = 0; i < 16; i++) {
			char key[24];
			snprintf(key, sizeof(key), "kerf/macro/%d", i);
			settings_delete(key);
		}
		sys_reboot(SYS_REBOOT_COLD);
		return KERF_ERROR_OK;
	}
	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}
