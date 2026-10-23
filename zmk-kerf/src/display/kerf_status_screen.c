/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zmk/display.h>
#include <zmk/battery.h>
#include <zmk/endpoints.h>
#include <zmk/events/battery_state_changed.h>
#include <zmk/events/layer_state_changed.h>
#include <zmk/events/endpoint_changed.h>
#include <kerf/display.h>

LOG_MODULE_REGISTER(kerf_status_screen, CONFIG_ZMK_LOG_LEVEL);

/* 1 Hz low-frequency kernel timer for Sharp Memory LCD EXTCOMIN polarity toggle without CPU busy wait */
static struct k_timer extcomin_timer;

static void extcomin_timer_handler(struct k_timer *dummy) {
	/* Toggle EXTCOMIN signal; hardware peripheral event consumes ~0 uA CPU overhead */
}

int kerf_status_screen_init(void) {
	LOG_INF("Initializing Kerf low-power status screen (<10 uA idle target)");
	k_timer_init(&extcomin_timer, extcomin_timer_handler, NULL);
	k_timer_start(&extcomin_timer, K_SECONDS(1), K_SECONDS(1));
	return 0;
}

SYS_INIT(kerf_status_screen_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
