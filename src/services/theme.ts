import { writable } from 'svelte/store';

// Mögliche Theme-Optionen
export type Theme = 'light' | 'dark';

// Theme-Store erstellen mit 'light' als Standardwert
export const theme = writable<Theme>('light');

// Funktion zum Wechseln des Themes
export function toggleTheme() {
    theme.update(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
}

// Funktion zum expliziten Setzen des Themes
export function setTheme(newTheme: Theme) {
    theme.set(newTheme);
}