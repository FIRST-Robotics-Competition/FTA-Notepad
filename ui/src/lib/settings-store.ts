import { browser } from '$app/environment';
import { writable } from "svelte/store";

export interface Settings {
    version: string;
    developerMode: boolean;
    darkMode: boolean;
}

let initialSettings = browser ? window.localStorage.getItem('settings') : null;

const defaultSettings: Settings = {
    version: '0',
    developerMode: false,
    darkMode: true,
};

if (!initialSettings) {
    initialSettings = JSON.stringify(defaultSettings);
} else {
    const parsedSettings = JSON.parse(initialSettings);
    for (const key in defaultSettings) {
        if (parsedSettings[key] === undefined) {
            parsedSettings[key] = defaultSettings[key as keyof Settings];
        }
    }
    initialSettings = JSON.stringify(parsedSettings);
}

export const settingsStore = writable<Settings>(JSON.parse(initialSettings));
settingsStore.subscribe((value: Settings) => {
    if (value === undefined) {
        value = defaultSettings;
    }
    if (browser) window.localStorage.setItem('settings', JSON.stringify(value));
});
