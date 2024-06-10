import type { CanvasDrawOptions } from "../types/canvasDrawOptions";
import { drawToCanvas } from "./drawToCanvas";
import { fileToImage } from "./fileToImage";
import * as gifshot from "gifshot";

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

    if (selectedFile && selectedImage) {
      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;
    } else {
      canvas.width = 512;
      canvas.height = 512;
    }

    if (options.isRotating && selectedImage) {
      const fps = 30;
      const frameCount = fps * options.animationLength;

      canvas.width = Math.min(canvas.width, 256);
      canvas.height = Math.min(canvas.height, 256);

      for (let i = 0; i < frameCount; i++) {
        drawToCanvas(canvas, ctx, selectedImage, options, i / fps);
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
        (obj: { error: boolean, image: string }) => {
          if (!obj.error) {
            const image: string = obj.image;
            const link: HTMLAnchorElement = document.createElement("a");
            link.download = "lpppog_ani" + Date.now() + ".gif";
            link.href = image;
            link.click();
            resolve();
          } else {
            reject(new Error("GIF creation failed"));
          }
        }
      );
    } else {
      if (selectedImage) {
        drawToCanvas(canvas, ctx, selectedImage, options, 0);
      }

      const link = document.createElement("a");
      link.download = "lpppog" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      resolve();
    }
  });
}
