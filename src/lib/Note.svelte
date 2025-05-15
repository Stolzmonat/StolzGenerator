<script lang="ts">
    import { NoteType } from "./types/noteTypes";
    import { theme } from "../services/theme";

    export let type: NoteType = NoteType.INFO;
</script>

<div class:err={type == NoteType.ERROR} class:warn={type == NoteType.WARNING} class:dark={$theme === 'dark'}>
    <slot />
</div>

<style>
    div {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: hsl(0, 0%, 95%);
        border-radius: 0 0.5rem 0.5rem 0;
        border-left: 0.25rem solid hsl(0, 0%, 90%);
        color: var(--text-color);
    }
    
    div.dark {
        background-color: hsl(0, 0%, 20%);
        border-left: 0.25rem solid hsl(0, 0%, 30%);
    }
    
    .warn {
        border-left: 0.25rem solid hsl(35, 100%, 50%);
    }
    
    .warn.dark {
        border-left: 0.25rem solid hsl(35, 100%, 50%);
        background-color: hsla(35, 100%, 30%, 0.2);
    }
    
    .err {
        border-left: 0.25rem solid hsl(0, 90%, 60%);
    }
    
    .err.dark {
        border-left: 0.25rem solid hsl(0, 90%, 60%);
        background-color: hsla(0, 90%, 30%, 0.2);
    }
</style>
