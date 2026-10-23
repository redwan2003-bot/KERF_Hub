/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>
#include <kerf/protocol.h>
#include <kerf/macros.h>

#define KERF_MAX_PROFILES 3
#define KERF_PROFILE_NAME_MAX_LEN 24

struct kerf_profile_data {
	uint8_t profile_id;
	char name[KERF_PROFILE_NAME_MAX_LEN];
	struct kerf_underglow_config underglow;
	struct kerf_batled_config batled;
	struct kerf_power_config power;
	struct kerf_macro_slot macros[KERF_MAX_MACRO_SLOTS];
};

int kerf_profiles_init(void);
int kerf_profiles_get_active_id(void);
int kerf_profiles_activate(uint8_t profile_id);
int kerf_profiles_get(uint8_t profile_id, struct kerf_profile_data *data);
int kerf_profiles_save(const struct kerf_profile_data *data);
