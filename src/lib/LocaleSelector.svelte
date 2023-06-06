<script>
    import { createEventDispatcher } from 'svelte';

    export let value = 'en';

    const dispatch = createEventDispatcher();

    function handleLocaleChange(event) {
        event.preventDefault();

        dispatch('locale-changed', event.target.value);
    }
</script>

<style>
    .locale-selector {
        display: flex;
        justify-content: center;
    }

    .select {
        margin: 0 1rem 1rem;
    }
</style>

<div class="locale-selector">
    <div class="select">
        <select value={value} on:change={handleLocaleChange}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
        </select>
    </div>
</div>