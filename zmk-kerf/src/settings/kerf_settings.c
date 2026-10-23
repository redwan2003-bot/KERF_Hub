/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/settings/settings.h>
#include <zephyr/logging/log.h>
#include <kerf/settings.h>

LOG_MODULE_REGISTER(kerf_settings, CONFIG_ZMK_LOG_LEVEL);

static struct kerf_underglow_config current_light = {
	.on = true,
	.hue = 160,
	.saturation = 100,
	.brightness = 50,
	.effect = 0,
	.speed = 1,
	.auto_off_idle = true,
	.auto_off_usb = false,
};

static struct kerf_batled_config current_batled = {
	.brightness = 100,
	.low_brightness = 20,
	.tap_ms = 1000,
	.max_hold_ms = 10000,
	.low_percent = 10,
	.repeat_min = 5,
};

static struct kerf_power_config current_power = {
	.debounce_press_ms = 5,
	.debounce_release_ms = 5,
	.idle_timeout_ms = 30000,
	.deep_sleep_timeout_ms = 900000,
};

const struct kerf_underglow_config *kerf_settings_get_lighting(void) {
	return &current_light;
}

const struct kerf_batled_config *kerf_settings_get_batled(void) {
	return &current_batled;
}

const struct kerf_power_config *kerf_settings_get_power(void) {
	return &current_power;
}

static int kerf_settings_set(const char *name, size_t len, settings_read_cb read_cb, void *cb_arg) {
	const char *next;
	if (settings_name_steq(name, "light", &next)) {
		if (len != sizeof(current_light)) return -EINVAL;
		read_cb(cb_arg, &current_light, sizeof(current_light));
		return 0;
	} else if (settings_name_steq(name, "batled", &next)) {
		if (len != sizeof(current_batled)) return -EINVAL;
		read_cb(cb_arg, &current_batled, sizeof(current_batled));
		return 0;
	} else if (settings_name_steq(name, "power", &next)) {
		if (len != sizeof(current_power)) return -EINVAL;
		read_cb(cb_arg, &current_power, sizeof(current_power));
		return 0;
	}
	return -ENOENT;
}

SETTINGS_STATIC_HANDLER_DEFINE(kerf, "kerf", NULL, kerf_settings_set, NULL, NULL);

int kerf_settings_save_lighting(const struct kerf_underglow_config *cfg) {
	current_light = *cfg;
	return settings_save_one(KERF_SETTINGS_KEY_LIGHT, &current_light, sizeof(current_light));
}

int kerf_settings_save_batled(const struct kerf_batled_config *cfg) {
	current_batled = *cfg;
	return settings_save_one(KERF_SETTINGS_KEY_BATLED, &current_batled, sizeof(current_batled));
}

int kerf_settings_save_power(const struct kerf_power_config *cfg) {
	current_power = *cfg;
	return settings_save_one(KERF_SETTINGS_KEY_POWER, &current_power, sizeof(current_power));
}

int kerf_settings_init(void) {
	return settings_subsys_init();
}

SYS_INIT(kerf_settings_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
