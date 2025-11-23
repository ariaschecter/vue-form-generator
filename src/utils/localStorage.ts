// utils/localStorage.ts

export const STORAGE_KEYS = {
    APP_NAME: "app_name",
} as const;

export function saveAppName(value: string) {
    localStorage.setItem(STORAGE_KEYS.APP_NAME, value);
}

export function loadAppName(): string {
    return localStorage.getItem(STORAGE_KEYS.APP_NAME) || "";
}

export function clearAppName() {
    localStorage.removeItem(STORAGE_KEYS.APP_NAME);
}
