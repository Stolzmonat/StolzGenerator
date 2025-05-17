import type { CanvasDrawOptions } from "../types/canvasDrawOptions";
import { drawToCanvas } from "./drawToCanvas";
import { fileToImage } from "./fileToImage";
import * as gifshot from "gifshot";
import { ImagePositionStore } from "./ImagePositionStore";

// Referenzgröße der Vorschau-Canvas (standardmäßig auf dem Bildschirm)
const PREVIEW_CANVAS_SIZE = 320; // Die typische Größe des Vorschau-Canvas

export function download(
  selectedFile: File,
  options: CanvasDrawOptions
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let frames: string[] = [];

    let selectedImage: HTMLImageElement | null = null;
    if (selectedFile) {
      try {
        selectedImage = await fileToImage(selectedFile);
      } catch (error) {
        return reject(error);
      }
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx === null) {
      return reject(new Error("Unable to get canvas context"));
    }

    // Standard-Canvasgröße für die Vorschau (1:1 Seitenverhältnis)
    const defaultSize = 512;
    canvas.width = defaultSize;
    canvas.height = defaultSize;

    // Falls ein Bild ausgewählt wurde, aber die Originalgröße beibehalten,
    // anstatt immer das Maximum zu nehmen
    if (selectedFile && selectedImage) {
      // Wähle eine vernünftige Größe für das Ausgabebild
      const maxSize = 1024; // Maximale Canvasgröße in Pixeln

      // Wenn das Originalbild zu groß ist, skaliere es herunter
      if (selectedImage.width > maxSize || selectedImage.height > maxSize) {
        const scale = Math.min(
          maxSize / selectedImage.width,
          maxSize / selectedImage.height
        );
        canvas.width = Math.round(selectedImage.width * scale);
        canvas.height = Math.round(selectedImage.height * scale);
      } else {
        // Bei kleinen Bildern verwende die Originalgröße, aber mindestens defaultSize
        canvas.width = Math.max(selectedImage.width, defaultSize);
        canvas.height = Math.max(selectedImage.height, defaultSize);
      }
    }

    // Aktualisiere die Optionen mit den Werten aus dem ImagePositionStore
    const imageStore = ImagePositionStore.getInstance();
    const imageState = imageStore.getState();
    
    // Berechne das Verhältnis zwischen Export-Canvas und Vorschau-Canvas
    const scaleFactor = canvas.width / PREVIEW_CANVAS_SIZE;
    
    // Skaliere die Offset- und Skalierungswerte proportional zur Größenänderung
    options = {
      ...options,
      imageOffsetX: imageState.offsetX * scaleFactor,
      imageOffsetY: imageState.offsetY * scaleFactor,
      imageScale: imageState.scale,
      aspectRatioScale: imageState.aspectRatioScale
    };

    if (options.isRotating && selectedImage) {
      const fps = 30;
      const frameCount = fps * options.animationLength;

      // Bei Animationen die Größe reduzieren, aber nicht unter 256 Pixel
      const maxSize = 256;
      const minSize = 256;

      if (canvas.width > maxSize || canvas.height > maxSize) {
        const scale = Math.min(
          maxSize / canvas.width,
          maxSize / canvas.height
        );
        canvas.width = Math.max(Math.round(canvas.width * scale), minSize);
        canvas.height = Math.max(Math.round(canvas.height * scale), minSize);
        
        // Nach Größenänderung nochmals die Offsets anpassen
        const additionalScaleFactor = canvas.width / defaultSize;
        options.imageOffsetX = options.imageOffsetX * additionalScaleFactor;
        options.imageOffsetY = options.imageOffsetY * additionalScaleFactor;
      } else if (canvas.width < minSize || canvas.height < minSize) {
        // Stelle sicher, dass die Größe nicht zu klein ist
        const scale = Math.max(
          minSize / canvas.width,
          minSize / canvas.height
        );
        canvas.width = Math.round(canvas.width * scale);
        canvas.height = Math.round(canvas.height * scale);
        
        // Nach Größenänderung nochmals die Offsets anpassen
        const additionalScaleFactor = canvas.width / defaultSize;
        options.imageOffsetX = options.imageOffsetX * additionalScaleFactor;
        options.imageOffsetY = options.imageOffsetY * additionalScaleFactor;
      }

      for (let i = 0; i < frameCount; i++) {
        await drawToCanvas(canvas, ctx, selectedImage, options, i / fps);
        frames.push(canvas.toDataURL());
      }

      gifshot.createGIF(
        {
          gifWidth: canvas.width,
          gifHeight: canvas.height,
          images: frames,
          numFrames: frames.length,
          interval: 1 / fps,
          frameDuration: 1 / fps,
          sampleInterval: 10, // Increase the sample interval for better quality
          saveRenderingContexts: true, // Save rendering contexts for better quality
        },
        (obj: { error: boolean; image: string }) => {
          if (!obj.error) {
            const image: string = obj.image;
            const link: HTMLAnchorElement = document.createElement("a");
            link.download = "stolz_overlay_anim_" + Date.now() + ".gif";
            link.href = image;
            link.click();
            resolve();
          } else {
            reject(new Error("GIF creation failed"));
          }
        }
      );
    } else {
      // Statisches PNG erstellen
      if (selectedImage) {
        // Hier await hinzufügen, um sicherzustellen, dass die Zeichnung abgeschlossen ist
        await drawToCanvas(canvas, ctx, selectedImage, options, 0);
      } else {
        // Falls kein Bild ausgewählt wurde, nur die Flagge zeichnen
        await drawToCanvas(canvas, ctx, null, options, 0);
      }

      const link = document.createElement("a");
      link.download = "stolz_overlay_" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      resolve();
    }
  });
}
