<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { theme } from '../services/theme';

    export let value = 'de';

    const dispatch = createEventDispatcher();

    // Unterstützte Sprachen
    const supportedLocales = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pt', 'ru', 'ja', 'zh', 'ar', 'pl', 'sv', 'tr', 'ko', 'hi', 'vi', 'el', 'hu', 'fi', 'no', 'da', 'cs'];
    
    // Browsersprache erkennen, falls benötigt
    function detectBrowserLanguage() {
        if (typeof navigator !== 'undefined') {
            const lang = navigator.language.split('-')[0].toLowerCase();
            if (supportedLocales.includes(lang)) {
                return lang;
            }
        }
        return 'de'; // Fallback
    }
    
    onMount(() => {
        // Wenn kein Wert gesetzt wurde, Browsersprache verwenden
        if (!value) {
            value = detectBrowserLanguage();
        }
    });

    function handleLocaleChange(event) {
        event.preventDefault();
        dispatch('locale-changed', event.target.value);
    }
    
    // Hover-Status für visuelle Effekte
    let isHovering = false;
    let isFocused = false;
    
    function handleMouseEnter() {
        isHovering = true;
    }
    
    function handleMouseLeave() {
        isHovering = false;
    }
    
    function handleFocus() {
        isFocused = true;
    }
    
    function handleBlur() {
        isFocused = false;
    }
</script>

<style>
    .locale-selector {
        display: flex;
        justify-content: center;
    }

    .select {
        position: relative;
        width: 10rem;
    }
    
    select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 100%;
        padding: 0.5rem 2rem 0.5rem 1rem;
        border: 2px solid var(--ridge-color);
        border-radius: 1rem;
        background-color: var(--bg);
        color: var(--text-color);
        font-size: 1rem;
        cursor: pointer;
        transition-duration: var(--small-element-transition-duration);
        transition-timing-function: var(--ease-out-cubic);
    }
    
    select:hover, 
    select.hover {
        border-color: var(--primary-color);
        transform: scale(1.02);
    }
    
    select:focus,
    select.focused {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: var(--slider-thumb-shadow);
    }
    
    /* Pfeil-Symbol für das Dropdown */
    .select::after {
        content: "▼";
        font-size: 0.6rem;
        position: absolute;
        top: 50%;
        right: 0.75rem;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--text-color);
        transition-duration: var(--small-element-transition-duration);
    }
    
    /* Pfeil drehen beim Hover */
    .select.hover::after,
    .select.focused::after {
        color: var(--primary-color);
    }
    
    /* Dark Mode Anpassungen */
    select.dark {
        background-color: var(--bg);
        border-color: var(--ridge-color);
    }
    
    select.dark:hover,
    select.dark.hover {
        border-color: var(--primary-color);
    }
    
    select.dark:focus,
    select.dark.focused {
        border-color: var(--primary-color);
    }
    
    /* Responsive Design */
    @media screen and (max-width: 35rem) {
        .select {
            width: 8rem;
        }
    }
</style>

<div class="locale-selector">
    <div class="select" class:hover={isHovering} class:focused={isFocused}>
        <select 
            value={value} 
            on:change={handleLocaleChange}
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
            on:focus={handleFocus}
            on:blur={handleBlur}
            class:hover={isHovering}
            class:focused={isFocused}
            class:dark={$theme === 'dark'}
        >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="ru">Русский</option>
            <option value="pt">Português</option>
            <option value="ja">日本語</option>
            <option value="hi">हिन्दी</option>
            <option value="it">Italiano</option>
            <option value="nl">Nederlands</option>
            <option value="ko">한국어</option>
            <option value="tr">Türkçe</option>
            <option value="pl">Polski</option>
            <option value="vi">Tiếng Việt</option>
            <option value="sv">Svenska</option>
            <option value="el">Ελληνικά</option>
            <option value="hu">Magyar</option>
            <option value="cs">Čeština</option>
            <option value="fi">Suomi</option>
            <option value="da">Dansk</option>
            <option value="no">Norsk</option>
        </select>
    </div>
</div>