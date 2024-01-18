<script lang="ts">
    export let checked = false;

    let isHovering = false;

    function element_mouseEnter() {
        isHovering = true;
    }
    function element_mouseLeave() {
        isHovering = false;
    }

    // Function to toggle the checked state
    function toggleChecked() {
        checked = !checked;
    }
</script>

<div
    tabindex="0"
    role="checkbox"
    aria-checked={checked}
    class:hover={isHovering}
    on:mouseenter={element_mouseEnter}
    on:mouseleave={element_mouseLeave}
    on:keydown={event => {
        if (event.key == "Enter") toggleChecked();
    }}
    on:click={toggleChecked}
>
    <!-- Bind the checked property to the input -->
    <input type="checkbox" bind:checked hidden />
    <span class="check-ind"><span class="check-ind-k" /></span>
    <p><slot /></p>
</div>

<style>
    div > p {
        display: inline;
        vertical-align: middle;
    }
    input[type="checkbox"] {
        display: none;
    }
    input[type="checkbox"] ~ span.check-ind {
        display: inline-block;
        background-color: white;
        border: 2px solid var(--ridge-color);
        border-radius: 1.5rem;
        width: 2.5rem;
        height: 1.5rem;
        vertical-align: middle;
        transition-duration: var(--small-element-transition-duration);
        transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
        margin-right: 0.25rem;
    }
    span.check-ind-k {
        box-sizing: border-box;
        border: 2px solid var(--ridge-color);
        border-radius: 1.25rem;
        display: inline-block;
        background-color: white;
        width: 1.25rem;
        height: 1.25rem;
        margin: 0.125rem 0.125rem;
        transition-duration: var(--small-element-transition-duration);
        transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
    }
    input[type="checkbox"]:checked ~ span.check-ind {
        background-color: var(--primary-color);
    }
    input[type="checkbox"]:checked ~ span.check-ind span.check-ind-k {
        margin-left: 1.125rem;
    }
    div.hover span.check-ind {
        transform: scale3d(1.1, 1.1, 1);
        margin-right: 0.5rem;
    }
    div.hover span.check-ind-k {
        background-color: hsl(0, 0%, 95%);
    }
</style>
