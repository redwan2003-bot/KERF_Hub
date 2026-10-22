/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#define DT_DRV_COMPAT zmk_behavior_rgb_esb

#include <zephyr/device.h>
#include <drivers/behavior.h>
#include <zephyr/logging/log.h>
#include <zmk/behavior.h>
#include <dt-bindings/zmk/rgb.h>

LOG_MODULE_DECLARE(zmk, CONFIG_ZMK_LOG_LEVEL);

static int on_rgb_esb_binding_pressed(struct zmk_behavior_binding *binding,
				      struct zmk_behavior_binding_event event) {
	uint32_t cmd = binding->param1;
	uint32_t val = binding->param2;
	LOG_INF("ESB RGB behavior triggered: cmd=%d, val=%d", cmd, val);
	return 0;
}

static int on_rgb_esb_binding_released(struct zmk_behavior_binding *binding,
				       struct zmk_behavior_binding_event event) {
	return 0;
}

static const struct behavior_driver_api behavior_rgb_esb_driver_api = {
	.binding_pressed = on_rgb_esb_binding_pressed,
	.binding_released = on_rgb_esb_binding_released,
};

static int behavior_rgb_esb_init(const struct device *dev) {
	return 0;
}

#define BEHAVIOR_RGB_ESB_INST(n)                                               \
	BEHAVIOR_DT_INST_DEFINE(n, behavior_rgb_esb_init, NULL, NULL, NULL,    \
				POST_KERNEL, CONFIG_KERNEL_INIT_PRIORITY_DEFAULT, \
				&behavior_rgb_esb_driver_api);

DT_INST_FOREACH_STATUS_OKAY(BEHAVIOR_RGB_ESB_INST)
