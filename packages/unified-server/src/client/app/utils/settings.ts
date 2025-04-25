/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as BreadboardUI from "@breadboard-ai/shared-ui";
import { SettingsStore } from "@breadboard-ai/shared-ui/data/settings-store.js";

// This one is the same as /usr/local/google/home/jialehong/Desktop/breadboard/packages/visual-editor/src/utils/settings-helper.ts.
export class SettingsHelperImpl implements BreadboardUI.Types.SettingsHelper {
#store: SettingsStore;

constructor() {
    this.#store = SettingsStore.instance();
}

async restoreStore() {
  await this.#store.restore();
}

get(
    section: BreadboardUI.Types.SETTINGS_TYPE,
    name: string
): BreadboardUI.Types.SettingEntry["value"] | undefined {
    console.log('trying to get:', name);
    return this.#store.values[section].items.get(name);
}

async set(
    section: BreadboardUI.Types.SETTINGS_TYPE,
    name: string,
    value: BreadboardUI.Types.SettingEntry["value"]
): Promise<void> {
    console.log(`set ${name} as ${value}`);
    const values = this.#store.values;
    values[section].items.set(name, value);
    await this.#store.save(values);
}

async delete(
    section: BreadboardUI.Types.SETTINGS_TYPE,
    name: string
): Promise<void> {
    const values = this.#store.values;
    values[section].items.delete(name);
    await this.#store.save(values);
}
}
  