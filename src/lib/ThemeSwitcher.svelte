<script lang="ts">
    import { theme, toggleTheme } from "../services/theme";
    import Switch from "./Switch.svelte";
    import { _ } from "../services/i18n";
    
    // Die Variable für die Checkbox
    let isDarkMode: boolean;
    
    // Aktualisiere isDarkMode, wenn sich das Theme ändert
    $: isDarkMode = $theme === 'dark';
    
    // Wenn sich isDarkMode ändert, aktualisiere das Theme
    $: if (isDarkMode !== ($theme === 'dark')) {
        toggleTheme();
    }
</script>

<div class="theme-selector">
    <Switch bind:checked={isDarkMode}>
        {#if $theme === 'dark'}
            <span class="icon">🌙</span> {@html $_("dark-mode")}
        {:else}
            <span class="icon">☀️</span> {@html $_("light-mode")}
        {/if}
    </Switch>
</div>

<style>
    .theme-selector {
        margin: 1rem 0;
    }
    
    .icon {
        display: inline-block;
        margin-right: 0.5rem;
    }
</style>