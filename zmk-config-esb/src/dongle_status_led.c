/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(dongle_status_led, CONFIG_ZMK_LOG_LEVEL);

#if DT_NODE_EXISTS(DT_NODELABEL(status_led_r)) && DT_NODE_EXISTS(DT_NODELABEL(status_led_g)) && DT_NODE_EXISTS(DT_NODELABEL(status_led_b))

static const struct gpio_dt_spec led_r = GPIO_DT_SPEC_GET(DT_NODELABEL(status_led_r), gpios);
static const struct gpio_dt_spec led_g = GPIO_DT_SPEC_GET(DT_NODELABEL(status_led_g), gpios);
static const struct gpio_dt_spec led_b = GPIO_DT_SPEC_GET(DT_NODELABEL(status_led_b), gpios);

void kerf_dongle_set_led(bool r, bool g, bool b) {
	if (gpio_is_ready_dt(&led_r)) {
		gpio_pin_set_dt(&led_r, r ? 1 : 0);
	}
	if (gpio_is_ready_dt(&led_g)) {
		gpio_pin_set_dt(&led_g, g ? 1 : 0);
	}
	if (gpio_is_ready_dt(&led_b)) {
		gpio_pin_set_dt(&led_b, b ? 1 : 0);
	}
}

static int dongle_status_led_init(void) {
	if (gpio_is_ready_dt(&led_r)) {
		gpio_pin_configure_dt(&led_r, GPIO_OUTPUT_INACTIVE);
	}
	if (gpio_is_ready_dt(&led_g)) {
		gpio_pin_configure_dt(&led_g, GPIO_OUTPUT_INACTIVE);
	}
	if (gpio_is_ready_dt(&led_b)) {
		gpio_pin_configure_dt(&led_b, GPIO_OUTPUT_ACTIVE); /* Blue on start */
	}
	return 0;
}

SYS_INIT(dongle_status_led_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);

#endif
