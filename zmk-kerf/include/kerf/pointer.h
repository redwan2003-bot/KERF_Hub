/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>
#include <kerf/protocol.h>

#define KERF_MAX_DPI_STAGES 8

enum kerf_polling_rate {
	KERF_POLLING_125HZ = 0,
	KERF_POLLING_250HZ = 1,
	KERF_POLLING_500HZ = 2,
	KERF_POLLING_1000HZ = 3,
};

enum kerf_lod {
	KERF_LOD_1MM = 0,
	KERF_LOD_2MM = 1,
};

struct kerf_dpi_stage {
	uint8_t stage_id;
	uint16_t dpi_x;
	uint16_t dpi_y;
	uint32_t color_hex;
};

struct kerf_pointer_config {
	uint8_t active_stage;
	uint8_t stage_count;
	struct kerf_dpi_stage stages[KERF_MAX_DPI_STAGES];
	enum kerf_polling_rate polling_rate;
	enum kerf_lod lod;
	bool motion_sync;
	bool ripple_control;
	bool angle_snapping;
};

int kerf_pointer_init(void);
const struct kerf_pointer_config *kerf_pointer_get_config(void);
int kerf_pointer_set_config(const struct kerf_pointer_config *cfg);
