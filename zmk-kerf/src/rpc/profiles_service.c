/*
 * Copyright (c) 2026 Redwan / Kerf Keeb
 * SPDX-License-Identifier: MIT
 */

#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/settings/settings.h>
#include <kerf/profiles.h>
#include <kerf/service.h>

LOG_MODULE_REGISTER(kerf_profiles_rpc, CONFIG_ZMK_LOG_LEVEL);

static uint8_t active_profile_index = 0;
static struct kerf_profile_data profiles[KERF_MAX_PROFILES];

int kerf_profiles_get_active_id(void) {
	return active_profile_index;
}

int kerf_profiles_activate(uint8_t profile_id) {
	if (profile_id >= KERF_MAX_PROFILES) {
		return -EINVAL;
	}

	active_profile_index = profile_id;

	/* Save active profile index to Zephyr settings */
	settings_save_one("kerf/prof/active", &active_profile_index, sizeof(active_profile_index));
	LOG_INF("Activated profile %d: %s", profile_id, profiles[profile_id].name);

	return 0;
}

int kerf_profiles_get(uint8_t profile_id, struct kerf_profile_data *data) {
	if (profile_id >= KERF_MAX_PROFILES || !data) {
		return -EINVAL;
	}
	memcpy(data, &profiles[profile_id], sizeof(struct kerf_profile_data));
	return 0;
}

int kerf_profiles_save(const struct kerf_profile_data *data) {
	if (!data || data->profile_id >= KERF_MAX_PROFILES) {
		return -EINVAL;
	}

	memcpy(&profiles[data->profile_id], data, sizeof(struct kerf_profile_data));

	char key[32];
	snprintf(key, sizeof(key), "kerf/prof/%d", data->profile_id);
	return settings_save_one(key, data, sizeof(struct kerf_profile_data));
}

int kerf_handle_profiles_request(uint8_t cmd, const uint8_t *in, size_t in_len, uint8_t *out, size_t *out_len) {
	switch (cmd) {
	case 1: { /* ListProfiles */
		out[0] = active_profile_index;
		out[1] = KERF_MAX_PROFILES;
		size_t offset = 2;
		for (int i = 0; i < KERF_MAX_PROFILES; i++) {
			out[offset++] = (uint8_t)i;
			out[offset++] = (i == active_profile_index) ? 1 : 0;
			size_t name_len = strnlen(profiles[i].name, KERF_PROFILE_NAME_MAX_LEN);
			out[offset++] = (uint8_t)name_len;
			memcpy(&out[offset], profiles[i].name, name_len);
			offset += name_len;
		}
		*out_len = offset;
		return KERF_ERROR_OK;
	}

	case 2: { /* GetProfile */
		if (in_len < 1) return KERF_ERROR_INVALID;
		uint8_t id = in[0];
		if (id >= KERF_MAX_PROFILES) return KERF_ERROR_INVALID;

		memcpy(out, &profiles[id], sizeof(struct kerf_profile_data));
		*out_len = sizeof(struct kerf_profile_data);
		return KERF_ERROR_OK;
	}

	case 3: { /* SaveProfile */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < sizeof(struct kerf_profile_data)) return KERF_ERROR_INVALID;

		const struct kerf_profile_data *incoming = (const struct kerf_profile_data *)in;
		if (incoming->profile_id >= KERF_MAX_PROFILES) return KERF_ERROR_INVALID;

		int ret = kerf_profiles_save(incoming);
		if (ret < 0) return KERF_ERROR_NO_SPACE;

		out[0] = 1;
		*out_len = 1;
		return KERF_ERROR_OK;
	}

	case 4: { /* ActivateProfile */
		if (kerf_is_locked()) return KERF_ERROR_LOCKED;
		if (in_len < 1) return KERF_ERROR_INVALID;

		uint8_t target_id = in[0];
		if (target_id >= KERF_MAX_PROFILES) return KERF_ERROR_INVALID;

		int ret = kerf_profiles_activate(target_id);
		if (ret < 0) return KERF_ERROR_INVALID;

		out[0] = 1;
		out[1] = target_id;
		*out_len = 2;
		return KERF_ERROR_OK;
	}

	default:
		return KERF_ERROR_UNSUPPORTED;
	}
}

static int kerf_profiles_settings_set(const char *name, size_t len, settings_read_cb read_cb, void *cb_arg) {
	const char *next;
	if (settings_name_steq(name, "active", &next)) {
		if (len != sizeof(active_profile_index)) return -EINVAL;
		read_cb(cb_arg, &active_profile_index, sizeof(active_profile_index));
		return 0;
	}

	for (int i = 0; i < KERF_MAX_PROFILES; i++) {
		char key_idx[8];
		snprintf(key_idx, sizeof(key_idx), "%d", i);
		if (settings_name_steq(name, key_idx, &next)) {
			if (len != sizeof(struct kerf_profile_data)) return -EINVAL;
			read_cb(cb_arg, &profiles[i], sizeof(struct kerf_profile_data));
			return 0;
		}
	}

	return -ENOENT;
}

struct settings_handler kerf_profiles_conf = {
	.name = "kerf/prof",
	.h_set = kerf_profiles_settings_set,
};

int kerf_profiles_init(void) {
	// Initialize defaults for the 3 slots
	for (int i = 0; i < KERF_MAX_PROFILES; i++) {
		profiles[i].profile_id = i;
		snprintf(profiles[i].name, sizeof(profiles[i].name), "Profile %d", i + 1);
		profiles[i].underglow.on = true;
		profiles[i].underglow.hue = 160;
		profiles[i].underglow.saturation = 100;
		profiles[i].underglow.brightness = 50;
		profiles[i].power.debounce_press_ms = 5;
		profiles[i].power.debounce_release_ms = 5;
		profiles[i].power.idle_timeout_ms = 30000;
		profiles[i].power.deep_sleep_timeout_ms = 900000;
	}

	settings_register(&kerf_profiles_conf);
	settings_load_subtree("kerf/prof");
	return 0;
}

SYS_INIT(kerf_profiles_init, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);
