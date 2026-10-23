/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/usb/usb_device.h>
#include <zephyr/usb/class/usb_hid.h>
#include <zephyr/logging/log.h>
#include <kerf/service.h>

LOG_MODULE_REGISTER(kerf_usb_hid, CONFIG_ZMK_LOG_LEVEL);

#define RAW_HID_REPORT_SIZE 64

static const uint8_t raw_hid_report_desc[] = {
	0x06, 0x60, 0xFF,  /* USAGE_PAGE (Vendor Defined 0xFF60) */
	0x09, 0x61,        /* USAGE (Vendor Usage 0x61) */
	0xA1, 0x01,        /* COLLECTION (Application) */
	0x09, 0x62,        /*   USAGE (Vendor Usage 0x62) */
	0x15, 0x00,        /*   LOGICAL_MINIMUM (0) */
	0x26, 0xFF, 0x00,  /*   LOGICAL_MAXIMUM (255) */
	0x75, 0x08,        /*   REPORT_SIZE (8) */
	0x95, RAW_HID_REPORT_SIZE, /* REPORT_COUNT (64) */
	0x81, 0x02,        /*   INPUT (Data,Var,Abs) */
	0x09, 0x63,        /*   USAGE (Vendor Usage 0x63) */
	0x15, 0x00,        /*   LOGICAL_MINIMUM (0) */
	0x26, 0xFF, 0x00,  /*   LOGICAL_MAXIMUM (255) */
	0x75, 0x08,        /*   REPORT_SIZE (8) */
	0x95, RAW_HID_REPORT_SIZE, /* REPORT_COUNT (64) */
	0x91, 0x02,        /*   OUTPUT (Data,Var,Abs) */
	0xC0               /* END_COLLECTION */
};

static const struct device *hid_dev;

static void on_hid_int_in_ready(const struct device *dev) {
	/* Transmit buffer ready */
}

static void on_hid_int_out_ready(const struct device *dev) {
	uint8_t rx_buf[RAW_HID_REPORT_SIZE];
	uint8_t tx_buf[RAW_HID_REPORT_SIZE] = {0};
	uint32_t bytes_read = 0;

	if (hid_int_ep_read(dev, rx_buf, sizeof(rx_buf), &bytes_read) != 0 || bytes_read < 2) {
		return;
	}

	uint8_t subsystem = rx_buf[0];
	uint8_t cmd = rx_buf[1];
	size_t out_len = 0;
	int err = KERF_ERROR_UNSUPPORTED;

	switch (subsystem) {
	case KERF_SUBSYSTEM_CORE:
		err = kerf_handle_core_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	case KERF_SUBSYSTEM_LIGHTING:
		err = kerf_handle_lighting_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	case KERF_SUBSYSTEM_MACROS:
		err = kerf_handle_macros_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	case KERF_SUBSYSTEM_PROFILES:
		err = kerf_handle_profiles_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	case KERF_SUBSYSTEM_DISPLAY:
		err = kerf_handle_display_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	case KERF_SUBSYSTEM_POWER:
		err = kerf_handle_power_request(cmd, &rx_buf[2], bytes_read - 2, &tx_buf[2], &out_len);
		break;
	}

	tx_buf[0] = subsystem;
	tx_buf[1] = (uint8_t)err;
	hid_int_ep_write(dev, tx_buf, sizeof(tx_buf), NULL);
}

static const struct hid_ops ops = {
	.int_in_ready = on_hid_int_in_ready,
	.int_out_ready = on_hid_int_out_ready,
};

static int kerf_usb_hid_init(void) {
	hid_dev = device_get_binding("HID_0");
	if (!hid_dev) {
		LOG_WRN("Raw HID device binding not found");
		return 0;
	}
	usb_hid_register_device(hid_dev, raw_hid_report_desc, sizeof(raw_hid_report_desc), &ops);
	usb_hid_init(hid_dev);
	return 0;
}

SYS_INIT(kerf_usb_hid_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
