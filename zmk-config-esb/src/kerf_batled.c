/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/led_strip.h>
#include <zephyr/logging/log.h>
#include <zmk/battery.h>

LOG_MODULE_REGISTER(kerf_batled, CONFIG_ZMK_LOG_LEVEL);

extern int kerf_batled_set_pixel(const struct led_rgb *color);

static struct k_work_delayable batled_timer;
static bool is_active;
static int64_t press_start_time;

static void turn_off_batled(struct k_work *work) {
	struct led_rgb off = { .r = 0, .g = 0, .b = 0 };
	kerf_batled_set_pixel(&off);
	is_active = false;
}

static struct led_rgb get_battery_color(uint8_t percent) {
	struct led_rgb c;
	if (percent > 50) {
		/* Green */
		c.r = 0; c.g = 255; c.b = 0;
	} else if (percent >= 20) {
		/* Yellow */
		c.r = 255; c.g = 200; c.b = 0;
	} else {
		/* Red */
		c.r = 255; c.g = 0; c.b = 0;
	}
	return c;
}

int kerf_batled_trigger_press(void) {
	press_start_time = k_uptime_get();
	uint8_t soc = zmk_battery_state_of_charge();
	struct led_rgb color = get_battery_color(soc);
	kerf_batled_set_pixel(&color);
	is_active = true;

	/* Cap maximum hold at configured duration (default 10s) */
	k_work_reschedule(&batled_timer, K_MSEC(CONFIG_KERF_BATLED_MAX_HOLD_MS));
	return 0;
}

int kerf_batled_trigger_release(void) {
	if (!is_active) {
		return 0;
	}
	int64_t duration = k_uptime_get() - press_start_time;
	if (duration < 500) {
		/* Short tap: remain on for remaining time to reach 1000ms */
		int64_t remaining = CONFIG_KERF_BATLED_TAP_MS - duration;
		if (remaining > 0) {
			k_work_reschedule(&batled_timer, K_MSEC(remaining));
			return 0;
		}
	}
	/* Held long: immediately turn off on release */
	k_work_reschedule(&batled_timer, K_NO_WAIT);
	return 0;
}

static int kerf_batled_init(void) {
	k_work_init_delayable(&batled_timer, turn_off_batled);
	return 0;
}

SYS_INIT(kerf_batled_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
