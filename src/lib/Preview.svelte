<script lang="ts">
    import { onMount } from "svelte";
    import { drawToCanvas } from "./helpers/drawToCanvas";
    import { fileToImage } from "./helpers/fileToImage";
    import type { CanvasDrawOptions } from "./types/canvasDrawOptions";

    export let options: CanvasDrawOptions;
    export let selectedFile: File;
    export let previewCircular: boolean;

    let selectedImage: HTMLImageElement;

    export let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let frame: number;
    let isDrawing = false;

    $: {
        (async () => {
            if (selectedFile) {
                selectedImage = await fileToImage(selectedFile);
                fixRes();
            }
        })();
    }

    function fixRes() {
        setTimeout(() => {
            canvas.width = canvas.getBoundingClientRect().width;
            canvas.height = canvas.getBoundingClientRect().height;
        }, 100);
    }

    onMount(() => {
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    async function draw() {
        let now = performance.now() / 1000;
        if (canvas && ctx) {
            // Prüfe, ob bereits ein Zeichenvorgang läuft
            if (!isDrawing) {
                isDrawing = true;
                await drawToCanvas(canvas, ctx, selectedImage, options, now);
                isDrawing = false;
            }
        } else {
            canvas.width = canvas.getBoundingClientRect().width;
            canvas.height = canvas.getBoundingClientRect().height;
            ctx = canvas.getContext("2d");
        }
        frame = requestAnimationFrame(draw);
    }
</script>

<svelte:window on:resize={fixRes} />

<canvas bind:this={canvas} class:isCircular={previewCircular} />

<style>
    canvas {
        width: min(20rem, var(--page-size));
        /* height: min(20rem, var(--page-size)); */
        aspect-ratio: 1;

        /* background: black; */
        transition: border-radius var(--big-element-transition-duration);
    }

    .isCircular {
        border-radius: 50%;
    }
</style>
