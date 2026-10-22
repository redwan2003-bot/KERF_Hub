/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#define DT_DRV_COMPAT kerf_led_strip_split

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/led_strip.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(kerf_led_split, CONFIG_LED_STRIP_LOG_LEVEL);

struct kerf_led_split_config {
	const struct device *raw_strip;
	uint8_t chain_length;
	uint8_t underglow_pixels;
};

struct kerf_led_split_data {
	struct led_rgb pixels[9];
};

static struct kerf_led_split_data split_data;

int kerf_batled_set_pixel(const struct led_rgb *color) {
	if (!split_data.pixels) {
		return -EINVAL;
	}
	split_data.pixels[8] = *color;
	return 0;
}

static int kerf_led_split_update_rgb(const struct device *dev,
				      struct led_rgb *pixels,
				      size_t num_pixels) {
	const struct kerf_led_split_config *config = dev->config;
	struct kerf_led_split_data *data = dev->data;

	if (!device_is_ready(config->raw_strip)) {
		LOG_ERR("Raw LED strip device not ready");
		return -ENODEV;
	}

	size_t count = num_pixels;
	if (count > config->underglow_pixels) {
		count = config->underglow_pixels;
	}

	for (size_t i = 0; i < count; i++) {
		data->pixels[i] = pixels[i];
	}

	return led_strip_update_rgb(config->raw_strip, data->pixels, config->chain_length);
}

static int kerf_led_split_update_channels(const struct device *dev,
					  uint8_t *channels,
					  size_t num_channels) {
	const struct kerf_led_split_config *config = dev->config;
	if (!device_is_ready(config->raw_strip)) {
		return -ENODEV;
	}
	return led_strip_update_channels(config->raw_strip, channels, num_channels);
}

static const struct led_strip_driver_api kerf_led_split_api = {
	.update_rgb = kerf_led_split_update_rgb,
	.update_channels = kerf_led_split_update_channels,
};

static int kerf_led_split_init(const struct device *dev) {
	const struct kerf_led_split_config *config = dev->config;

	if (!device_is_ready(config->raw_strip)) {
		LOG_WRN("Raw strip %s not ready at init", config->raw_strip->name);
		return 0;
	}

	return 0;
}

#define KERF_LED_SPLIT_INIT(inst)                                              \
	static const struct kerf_led_split_config kerf_led_split_config_##inst = { \
		.raw_strip = DEVICE_DT_GET(DT_INST_PHANDLE(inst, raw_led_strip)),     \
		.chain_length = DT_INST_PROP(inst, chain_length),                     \
		.underglow_pixels = DT_INST_PROP(inst, underglow_pixels),             \
	};                                                                         \
	DEVICE_DT_INST_DEFINE(inst, kerf_led_split_init, NULL,                      \
			      &split_data,                                         \
			      &kerf_led_split_config_##inst, POST_KERNEL,          \
			      CONFIG_LED_STRIP_INIT_PRIORITY,                          \
			      &kerf_led_split_api);

DT_INST_FOREACH_STATUS_OKAY(KERF_LED_SPLIT_INIT)
