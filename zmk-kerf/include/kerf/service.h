/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#pragma once

#include <kerf/protocol.h>

bool kerf_is_locked(void);

int kerf_handle_core_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len);
int kerf_handle_lighting_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len);
int kerf_handle_macros_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len);
int kerf_handle_power_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len);
