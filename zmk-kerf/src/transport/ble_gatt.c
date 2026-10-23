/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/logging/log.h>
#include <kerf/service.h>

LOG_MODULE_REGISTER(kerf_ble_gatt, CONFIG_ZMK_LOG_LEVEL);

#define BT_UUID_KERF_SERVICE_VAL \
	BT_UUID_128_ENCODE(0x00000001, 0xe28a, 0x4c22, 0xb9e4, 0x67258ab01c01)

#define BT_UUID_KERF_CHAR_VAL \
	BT_UUID_128_ENCODE(0x00000002, 0xe28a, 0x4c22, 0xb9e4, 0x67258ab01c01)

static struct bt_uuid_128 kerf_svc_uuid = BT_UUID_INIT_128(BT_UUID_KERF_SERVICE_VAL);
static struct bt_uuid_128 kerf_char_uuid = BT_UUID_INIT_128(BT_UUID_KERF_CHAR_VAL);

static ssize_t write_kerf_char(struct bt_conn *conn, const struct bt_gatt_attr *attr,
			       const void *buf, uint16_t len, uint16_t offset, uint8_t flags) {
	if (len < 2) return BT_GATT_ERR(BT_ATT_ERR_INVALID_ATTRIBUTE_LEN);
	const uint8_t *bytes = (const uint8_t *)buf;
	uint8_t subsystem = bytes[0];
	uint8_t cmd = bytes[1];
	uint8_t out[64] = {0};
	size_t out_len = 0;
	int err = KERF_ERROR_UNSUPPORTED;

	switch (subsystem) {
	case KERF_SUBSYSTEM_CORE:
		err = kerf_handle_core_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_LIGHTING:
		err = kerf_handle_lighting_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_MACROS:
		err = kerf_handle_macros_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_PROFILES:
		err = kerf_handle_profiles_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_DISPLAY:
		err = kerf_handle_display_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_POWER:
		err = kerf_handle_power_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	case KERF_SUBSYSTEM_POINTER:
		err = kerf_handle_pointer_request(cmd, &bytes[2], len - 2, out, &out_len);
		break;
	}

	return len;
}

BT_GATT_SERVICE_DEFINE(kerf_svc,
	BT_GATT_PRIMARY_SERVICE(&kerf_svc_uuid),
	BT_GATT_CHARACTERISTIC(&kerf_char_uuid.uuid,
			       BT_GATT_CHRC_WRITE | BT_GATT_CHRC_INDICATE,
			       BT_GATT_PERM_WRITE_ENCRYPT,
			       NULL, write_kerf_char, NULL),
	BT_GATT_CCC(NULL, BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),
);
