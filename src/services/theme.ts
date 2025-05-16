import { writable } from 'svelte/store';

// Mögliche Theme-Optionen
export type Theme = 'light' | 'dark';

// Funktion zum Lesen der Systempräferenz
function getSystemPreferredTheme(): Theme {
    if (typeof window !== 'undefined' && window.matchMedia) {
        // Überprüft, ob der Browser Dark Mode bevorzugt
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? 'dark' : 'light';
    }
    
    // Fallback auf 'light', wenn matchMedia nicht verfügbar ist
    return 'light';
}

// Theme-Store erstellen mit der Systempräferenz als Initialwert
export const theme = writable<Theme>(getSystemPreferredTheme());

// Funktion zum Wechseln des Themes
export function toggleTheme() {
    theme.update(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
}

// Funktion zum expliziten Setzen des Themes
export function setTheme(newTheme: Theme) {
    theme.set(newTheme);
}

// MediaQueryList für prefers-color-scheme, um Änderungen während der Laufzeit zu erkennen
if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Event-Listener für Änderungen der Systempräferenz
    const handleThemeChange = (e: MediaQueryListEvent) => {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        theme.set(newTheme);
    };
    
    // Listener hinzufügen mit Berücksichtigung älterer Browser
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleThemeChange);
    } else if (mediaQuery.addListener) {
        // Für ältere Browser (veraltet, aber für die Kompatibilität)
        mediaQuery.addListener(handleThemeChange);
    }
}