<script lang="ts">
    export let checked = false;
    export let disabled = false;

    let isHovering = false;

    function element_mouseEnter() {
        if (!disabled) isHovering = true;
    }
    function element_mouseLeave() {
        isHovering = false;
    }
</script>

<label
    tabindex={disabled ? "-1" : "0"}
    on:keydown={event => {
        if (!disabled && event.key == "Enter") event.currentTarget.click();
    }}
    role="checkbox"
    aria-disabled={disabled}
    on:mouseenter={element_mouseEnter}
    on:mouseleave={element_mouseLeave}
    class:hover={isHovering}
    class:disabled={disabled}
>
    <input type="checkbox" bind:checked {disabled} />
    <span class="check-ind"><span class="check-ind-k" /></span>
    <p><slot /></p>
</label>

<style>
    label > p {
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
    label.hover span.check-ind {
        transform: scale3d(1.1, 1.1, 1);
        margin-right: 0.5rem;
    }
    label.hover span.check-ind-k {
        background-color: hsl(0, 0%, 95%);
    }
    label.disabled {
        pointer-events: none;
        opacity: 0.6;
        cursor: not-allowed;
    }
    label.disabled span.check-ind {
        background-color: var(--select-color);
        border-color: var(--ridge-color);
    }
    label.disabled p {
        color: var(--disabled-color);
    }
</style>
