/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#define DT_DRV_COMPAT zmk_behavior_batled

#include <zephyr/device.h>
#include <drivers/behavior.h>
#include <zephyr/logging/log.h>
#include <zmk/behavior.h>

LOG_MODULE_DECLARE(zmk, CONFIG_ZMK_LOG_LEVEL);

extern int kerf_batled_trigger_press(void);
extern int kerf_batled_trigger_release(void);

static int on_batled_binding_pressed(struct zmk_behavior_binding *binding,
				     struct zmk_behavior_binding_event event) {
	return kerf_batled_trigger_press();
}

static int on_batled_binding_released(struct zmk_behavior_binding *binding,
				      struct zmk_behavior_binding_event event) {
	return kerf_batled_trigger_release();
}

static const struct behavior_driver_api behavior_batled_driver_api = {
	.binding_pressed = on_batled_binding_pressed,
	.binding_released = on_batled_binding_released,
};

static int behavior_batled_init(const struct device *dev) {
	return 0;
}

#define BEHAVIOR_BATLED_INST(n)                                                \
	BEHAVIOR_DT_INST_DEFINE(n, behavior_batled_init, NULL, NULL, NULL,     \
				POST_KERNEL, CONFIG_KERNEL_INIT_PRIORITY_DEFAULT, \
				&behavior_batled_driver_api);

DT_INST_FOREACH_STATUS_OKAY(BEHAVIOR_BATLED_INST)
