/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>

#define KMACRO_MAX_SLOTS 16
#define KMACRO_MAX_STEPS 64

enum kmacro_action {
	KMACRO_ACTION_TAP     = 0,
	KMACRO_ACTION_PRESS   = 1,
	KMACRO_ACTION_RELEASE = 2,
	KMACRO_ACTION_DELAY   = 3,
};

struct kmacro_step {
	uint8_t action;
	uint16_t param;
};

struct kmacro_slot {
	uint8_t step_count;
	struct kmacro_step steps[KMACRO_MAX_STEPS];
};

int kmacro_execute(uint8_t slot_id);
const struct kmacro_slot *kmacro_get_slot(uint8_t slot_id);
int kmacro_set_slot(uint8_t slot_id, const struct kmacro_slot *slot);
int kmacro_clear_slot(uint8_t slot_id);
