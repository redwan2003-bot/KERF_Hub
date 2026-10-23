/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#define DT_DRV_COMPAT zmk_behavior_kmacro

#include <zephyr/device.h>
#include <drivers/behavior.h>
#include <zephyr/logging/log.h>
#include <zmk/behavior.h>
#include <zmk/hid.h>
#include <zmk/endpoints.h>
#include <kerf/macros.h>

LOG_MODULE_DECLARE(zmk, CONFIG_ZMK_LOG_LEVEL);

static struct kmacro_slot slots[KMACRO_MAX_SLOTS];
static struct k_work_delayable macro_work;
static uint8_t active_slot = 0;
static uint8_t current_step = 0;
static bool tap_pending_release = false;
static uint16_t pending_release_key = 0;

static void macro_work_handler(struct k_work *work) {
	if (tap_pending_release) {
		zmk_hid_keyboard_release(pending_release_key);
		zmk_endpoints_send_report(HID_USAGE_KEYBOARD);
		tap_pending_release = false;
		current_step++;
	}

	if (active_slot >= KMACRO_MAX_SLOTS || current_step >= slots[active_slot].step_count) {
		return;
	}

	const struct kmacro_step *step = &slots[active_slot].steps[current_step];

	switch (step->action) {
	case KMACRO_ACTION_TAP:
		zmk_hid_keyboard_press(step->param);
		zmk_endpoints_send_report(HID_USAGE_KEYBOARD);
		tap_pending_release = true;
		pending_release_key = step->param;
		k_work_reschedule(&macro_work, K_MSEC(10));
		return;

	case KMACRO_ACTION_PRESS:
		zmk_hid_keyboard_press(step->param);
		zmk_endpoints_send_report(HID_USAGE_KEYBOARD);
		current_step++;
		k_work_reschedule(&macro_work, K_NO_WAIT);
		return;

	case KMACRO_ACTION_RELEASE:
		zmk_hid_keyboard_release(step->param);
		zmk_endpoints_send_report(HID_USAGE_KEYBOARD);
		current_step++;
		k_work_reschedule(&macro_work, K_NO_WAIT);
		return;

	case KMACRO_ACTION_DELAY:
		current_step++;
		k_work_reschedule(&macro_work, K_MSEC(step->param));
		return;
	}
}

int kmacro_execute(uint8_t slot_id) {
	if (slot_id >= KMACRO_MAX_SLOTS || slots[slot_id].step_count == 0) {
		return -EINVAL;
	}
	active_slot = slot_id;
	current_step = 0;
	tap_pending_release = false;
	k_work_reschedule(&macro_work, K_NO_WAIT);
	return 0;
}

const struct kmacro_slot *kmacro_get_slot(uint8_t slot_id) {
	if (slot_id >= KMACRO_MAX_SLOTS) return NULL;
	return &slots[slot_id];
}

int kmacro_set_slot(uint8_t slot_id, const struct kmacro_slot *slot) {
	if (slot_id >= KMACRO_MAX_SLOTS || !slot) return -EINVAL;
	slots[slot_id] = *slot;
	return 0;
}

int kmacro_clear_slot(uint8_t slot_id) {
	if (slot_id >= KMACRO_MAX_SLOTS) return -EINVAL;
	slots[slot_id].step_count = 0;
	return 0;
}

static int on_kmacro_binding_pressed(struct zmk_behavior_binding *binding,
				     struct zmk_behavior_binding_event event) {
	return kmacro_execute((uint8_t)binding->param1);
}

static int on_kmacro_binding_released(struct zmk_behavior_binding *binding,
				      struct zmk_behavior_binding_event event) {
	return 0;
}

static const struct behavior_driver_api behavior_kmacro_driver_api = {
	.binding_pressed = on_kmacro_binding_pressed,
	.binding_released = on_kmacro_binding_released,
};

static int behavior_kmacro_init(const struct device *dev) {
	k_work_init_delayable(&macro_work, macro_work_handler);
	return 0;
}

#define BEHAVIOR_KMACRO_INST(n)                                                \
	BEHAVIOR_DT_INST_DEFINE(n, behavior_kmacro_init, NULL, NULL, NULL,     \
				POST_KERNEL, CONFIG_KERNEL_INIT_PRIORITY_DEFAULT, \
				&behavior_kmacro_driver_api);

DT_INST_FOREACH_STATUS_OKAY(BEHAVIOR_KMACRO_INST)
