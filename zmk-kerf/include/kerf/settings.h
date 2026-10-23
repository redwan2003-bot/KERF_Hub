/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <kerf/protocol.h>

#define KERF_SETTINGS_SCHEMA_VERSION 1

#define KERF_SETTINGS_KEY_LIGHT  "kerf/light"
#define KERF_SETTINGS_KEY_BATLED "kerf/batled"
#define KERF_SETTINGS_KEY_POWER  "kerf/power"
#define KERF_SETTINGS_KEY_VER    "kerf/ver"

int kerf_settings_init(void);
int kerf_settings_save_lighting(const struct kerf_underglow_config *cfg);
int kerf_settings_save_batled(const struct kerf_batled_config *cfg);
int kerf_settings_save_power(const struct kerf_power_config *cfg);

const struct kerf_underglow_config *kerf_settings_get_lighting(void);
const struct kerf_batled_config *kerf_settings_get_batled(void);
const struct kerf_power_config *kerf_settings_get_power(void);
