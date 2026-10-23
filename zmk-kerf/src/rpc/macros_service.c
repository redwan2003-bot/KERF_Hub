/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/settings/settings.h>
#include <kerf/service.h>
#include <kerf/macros.h>

LOG_MODULE_REGISTER(kerf_macros_rpc, CONFIG_ZMK_LOG_LEVEL);

int kerf_handle_macros_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	if (in_len < 1) {
		return KERF_ERROR_INVALID;
	}

	uint8_t slot_id = in[0];
	if (slot_id >= KMACRO_MAX_SLOTS) {
		return KERF_ERROR_INVALID;
	}

	switch (cmd) {
	case 1: { /* GetMacroSlot */
		const struct kmacro_slot *slot = kmacro_get_slot(slot_id);
		if (!slot) return KERF_ERROR_INVALID;
		out[0] = slot_id;
		out[1] = slot->step_count;
		size_t payload_len = slot->step_count * sizeof(struct kmacro_step);
		memcpy(&out[2], slot->steps, payload_len);
		*out_len = 2 + payload_len;
		return KERF_ERROR_OK;
	}
	case 2: { /* SetMacroSlot */
		if (kerf_is_locked()) {
			return KERF_ERROR_LOCKED;
		}
		if (in_len < 2) return KERF_ERROR_INVALID;
		uint8_t step_count = in[1];
		if (step_count > KMACRO_MAX_STEPS) return KERF_ERROR_INVALID;

		struct kmacro_slot new_slot;
		new_slot.step_count = step_count;
		memcpy(new_slot.steps, &in[2], step_count * sizeof(struct kmacro_step));
		kmacro_set_slot(slot_id, &new_slot);

		/* Save slot to Zephyr settings: kerf/macro/<slot_id> */
		char key[20];
		snprintf(key, sizeof(key), "kerf/macro/%u", slot_id);
		settings_save_one(key, &new_slot, sizeof(new_slot));

		*out_len = 0;
		return KERF_ERROR_OK;
	}
	case 3: { /* ClearMacroSlot */
		if (kerf_is_locked()) {
			return KERF_ERROR_LOCKED;
		}
		kmacro_clear_slot(slot_id);
		char key[20];
		snprintf(key, sizeof(key), "kerf/macro/%u", slot_id);
		settings_delete(key);
		*out_len = 0;
		return KERF_ERROR_OK;
	}
	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}
