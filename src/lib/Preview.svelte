<script lang="ts">
    import { onMount } from "svelte";
    import { drawToCanvas } from "./helpers/drawToCanvas";
    import { fileToImage } from "./helpers/fileToImage";
    import type { CanvasDrawOptions } from "./types/canvasDrawOptions";
    import { ImagePositionStore } from "./helpers/ImagePositionStore";
    import { _ } from "../services/i18n";

    export let options: CanvasDrawOptions;
    export let selectedFile: File;
    export let previewCircular: boolean;

    let selectedImage: HTMLImageElement;

    export let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let frame: number;
    let isDrawing = false;

    // Bildpositionsspeicher für Konsistenz zwischen Renderzyklen
    const imageStore = ImagePositionStore.getInstance();

    // Variablen für das Drag & Drop
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    $: {
        (async () => {
            if (selectedFile) {
                selectedImage = await fileToImage(selectedFile);
                fixRes();
            }
        })();
    }

    // Wenn sich die Skalierung über den Slider ändert
    $: if (options.imageScale !== undefined && options.imageScale !== imageStore.getScale()) {
        imageStore.setScale(options.imageScale);
    }

    // Wenn sich das Seitenverhältnis über den Slider ändert
    $: if (options.aspectRatioScale !== undefined && options.aspectRatioScale !== imageStore.getAspectRatioScale()) {
        imageStore.setAspectRatioScale(options.aspectRatioScale);
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
                
                // Aktualisiere die Optionen mit den aktuellen Werten aus dem Bildpositionsspeicher
                const currentState = imageStore.getState();
                options.imageOffsetX = currentState.offsetX;
                options.imageOffsetY = currentState.offsetY;
                options.imageScale = currentState.scale;
                options.aspectRatioScale = currentState.aspectRatioScale;
                
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

    // Event-Handler für die Maus-/Touch-Interaktionen
    function handleMouseDown(event: MouseEvent) {
        if (!selectedImage) return;
        
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        
        // Verhindern der Standard-Browser-Drag-Aktionen
        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging || !selectedImage) return;
        
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        
        // Aktualisieren der Bildposition im Speicher
        imageStore.setOffsetX(imageStore.getOffsetX() + deltaX);
        imageStore.setOffsetY(imageStore.getOffsetY() + deltaY);
        
        lastX = event.clientX;
        lastY = event.clientY;
        
        // Verhindern der Standard-Browser-Drag-Aktionen
        event.preventDefault();
    }

    function handleMouseUp() {
        isDragging = false;
    }

    // Touch-Event-Handler für mobile Geräte
    function handleTouchStart(event: TouchEvent) {
        if (!selectedImage || event.touches.length !== 1) return;
        
        isDragging = true;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
        
        // Verhindern der Standard-Browser-Drag-Aktionen
        event.preventDefault();
    }

    function handleTouchMove(event: TouchEvent) {
        if (!isDragging || !selectedImage || event.touches.length !== 1) return;
        
        const deltaX = event.touches[0].clientX - lastX;
        const deltaY = event.touches[0].clientY - lastY;
        
        // Aktualisieren der Bildposition im Speicher
        imageStore.setOffsetX(imageStore.getOffsetX() + deltaX);
        imageStore.setOffsetY(imageStore.getOffsetY() + deltaY);
        
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
        
        // Verhindern der Standard-Browser-Drag-Aktionen
        event.preventDefault();
    }

    function handleTouchEnd() {
        isDragging = false;
    }
</script>

<svelte:window on:resize={fixRes} />

<div class="canvas-container">
    <canvas 
        bind:this={canvas} 
        class:isCircular={previewCircular}
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseUp}
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
        on:touchcancel={handleTouchEnd}
    />
    {#if selectedImage}
        <div class="instructions">
            {@html $_("drag-image")}
        </div>
    {/if}
</div>

<style>
    .canvas-container {
        position: relative;
        width: min(20rem, var(--page-size));
        aspect-ratio: 1;
        cursor: move;
    }

    canvas {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        transition: border-radius var(--big-element-transition-duration);
    }

    .isCircular {
        border-radius: 50%;
    }

    .instructions {
        position: relative;
        margin-top: 1rem;
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-color);
        opacity: 0.7;
    }
</style>
