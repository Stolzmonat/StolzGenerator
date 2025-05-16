import { flagColours } from "../constants/flagColours";
import type { CanvasDrawOptions } from "../types/canvasDrawOptions";
import { CutoutType } from "../types/cutoutType";
import { degToRad } from "./degToRad";
import { isImageOk } from "./isImageOk";
import { drawUSAFlag } from "../drawFlags/drawUsaFlag";
import { drawUnionjack } from "../drawFlags/drawUnionJack";
import { drawGreeceFlag } from "../drawFlags/drawGreeceFlag";
import { drawChileanFlag } from "../drawFlags/drawChileanFlag";
import { getPng } from "./PngHelper";

const flagKeys = Object.keys(flagColours);

/**
    @param now - the amount of milliseconds elapsed in the animation
*/
export async function drawToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  selectedImage: HTMLImageElement,
  options: CanvasDrawOptions,
  now: number
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (options.cutoutType != CutoutType.OVERLAY) {
    await drawFlag(canvas, ctx, options, now);
  }

  ctx.save();
  ctx.beginPath();

  if (options.cutoutType != CutoutType.OVERLAY) {
    switch (options.cutoutType) {
      case CutoutType.CIRCLE:
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          ((canvas.width / 2) * options.cutoutSize) / 100,
          0,
          Math.PI * 2
        );
        break;
      case CutoutType.SQUARE:
        ctx.rect(
          (canvas.width * (1 - options.cutoutSize / 100)) / 2,
          (canvas.height * (1 - options.cutoutSize / 100)) / 2,
          canvas.width * (options.cutoutSize / 100),
          canvas.height * (options.cutoutSize / 100)
        );
        break;
    }
    ctx.clip();
  }

  // Zeichne das Bild, wenn es vorhanden ist
  if (selectedImage && isImageOk(selectedImage)) {
    const offsetX = options.imageOffsetX || 0;
    const offsetY = options.imageOffsetY || 0;
    const scale = (options.imageScale || 100) / 100;
    
    // Zentrum des Canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Speichere den aktuellen Canvas-Status
    ctx.save();
    
    // Verschiebe den Ursprung in die Mitte des Canvas
    ctx.translate(centerX + offsetX, centerY + offsetY);
    
    // Skaliere das Bild vom Mittelpunkt aus
    ctx.scale(scale, scale);
    
    // Berechne die Größe basierend auf dem Ausschnitt und Seitenverhältnis
    const aspectRatio = selectedImage.width / selectedImage.height;
    let width, height;
    
    if (options.cutoutType === CutoutType.OVERLAY) {
      // Bei Overlay, berechne basierend auf Canvas-Größe
      if (aspectRatio >= 1) {
        // Breiteres Bild
        width = canvas.width;
        height = width / aspectRatio;
      } else {
        // Höheres Bild
        height = canvas.height;
        width = height * aspectRatio;
      }
    } else {
      // Bei Ausschnitt (Kreis/Quadrat)
      const cutoutSize = options.cutoutType === CutoutType.CIRCLE 
        ? ((canvas.width / 2) * options.cutoutSize) / 100 * 2 // Durchmesser
        : canvas.width * (options.cutoutSize / 100);
      
      if (options.resizeInwards) {
        if (aspectRatio >= 1) {
          // Breiteres Bild
          height = cutoutSize;
          width = height * aspectRatio;
        } else {
          // Höheres Bild
          width = cutoutSize;
          height = width / aspectRatio;
        }
      } else {
        // Fülle den Ausschnitt aus
        const minScale = Math.max(
          cutoutSize / selectedImage.width,
          cutoutSize / selectedImage.height
        );
        width = selectedImage.width * minScale;
        height = selectedImage.height * minScale;
      }
    }
    
    // Zeichne das Bild zentriert
    ctx.drawImage(
      selectedImage,
      -width / 2,
      -height / 2,
      width,
      height
    );
    
    // Stelle den Canvas-Status wieder her
    ctx.restore();
  }

  ctx.restore();

  if (options.cutoutType == CutoutType.OVERLAY) {
    await drawFlag(canvas, ctx, options, now);
  }
}

async function drawFlag(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: CanvasDrawOptions,
  now: number
) {
  // If no secondary flag is selected, draw primary flag on the entire canvas
  if (!options.secondaryFlag || options.secondaryFlag.length === 0 || options.secondaryFlag[0] === undefined) {
    await drawSingleFlag(canvas, ctx, options.selectedColors, options, now, 1.0);
  } 
  // Otherwise draw primary and secondary flags on their respective halves
  else {
    // Apply rotation to the entire canvas before drawing the flags
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (options.rotationOffset % 360 != 0) {
      ctx.rotate(degToRad(options.rotationOffset % 360));
    }

    if (options.isRotating) {
      ctx.rotate(
        degToRad(
          (now / options.animationLength) *
            360 *
            (options.isRotatingCounterClockwise ? -1 : 1) +
            options.rotationOffset
        )
      );
    }

    ctx.translate(canvas.width / -2, canvas.height / -2);
    
    // Set global opacity
    ctx.globalAlpha = options.overlayOpacity / 100;

    // Draw primary flag on the left half
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width / 2, canvas.height);
    ctx.clip();
    await drawFlagContent(canvas, ctx, options.selectedColors, options);
    ctx.restore();
    
    // Draw secondary flag on the right half
    ctx.save();
    ctx.beginPath();
    ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
    ctx.clip();
    await drawFlagContent(canvas, ctx, options.secondaryFlag, options);
    ctx.restore();
    
    ctx.restore();
  }
}

// Draw the flag content without applying rotation
async function drawFlagContent(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  flagColors: string[],
  options: CanvasDrawOptions
) {
  if (flagColors[0]?.startsWith("./american")) {
    drawUSAFlag(canvas, ctx);
  } else if (flagColors[0]?.startsWith("./unionjack")) {
    drawUnionjack(canvas, ctx);
  } else if (flagColors[0]?.startsWith("./greece")) {
    drawGreeceFlag(canvas, ctx);
  } else if (flagColors[0]?.startsWith("./chile")) {
    drawChileanFlag(canvas, ctx);
  } else if (flagKeys.includes(flagColors[0])) {
    await getPng(flagColors[0], canvas, ctx);
  } else if (!options.isGradient) {
    if (flagColors[0] == "-") {
      for (let i = 1; i < flagColors.length; i++) {
        ctx.fillStyle = flagColors[i];
        ctx.fillRect(
          // x
          i == 1
            ? -canvas.width / 2
            : ((i - 1) * canvas.width) / (flagColors.length - 1),
          // y
          -canvas.height / 2,
          // w
          ([1, flagColors.length].includes(i)
            ? canvas.width / 2
            : 0) +
            canvas.width / (flagColors.length - 1),
          // h
          canvas.height * 2
        );
      }
    } else {
      for (let i = 0; i < flagColors.length; i++) {
        ctx.fillStyle = flagColors[i];
        ctx.fillRect(
          -canvas.width / 2,
          i == 0
            ? -canvas.height / 2
            : (i * canvas.height) / flagColors.length,
          canvas.width * 2,
          ([0, flagColors.length - 1].includes(i)
            ? canvas.height / 2
            : 0) +
            canvas.height / flagColors.length
        );
      }
    }
  } else {
    if (flagColors[0] == "-") {
      let gradient = ctx.createLinearGradient(
        0,
        canvas.width / 2,
        canvas.height,
        canvas.width / 2
      );

      for (let i = 1; i < flagColors.length; i++) {
        gradient.addColorStop(
          i / (flagColors.length - 1),
          flagColors[i]
        );
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width * 2,
        canvas.height * 2
      );
    } else {
      let gradient = ctx.createLinearGradient(
        canvas.width / 2,
        0,
        canvas.width / 2,
        canvas.height
      );

      for (let i = 0; i < flagColors.length; i++) {
        gradient.addColorStop(
          i / (flagColors.length - 1),
          flagColors[i]
        );
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width * 2,
        canvas.height * 2
      );
    }
  }
}

// Keep the original drawSingleFlag function for when only one flag is shown
async function drawSingleFlag(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  flagColors: string[],
  options: CanvasDrawOptions,
  now: number,
  opacity: number = 1.0
) {
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (options.rotationOffset % 360 != 0) {
    ctx.rotate(degToRad(options.rotationOffset % 360));
  }

  if (options.isRotating) {
    ctx.rotate(
      degToRad(
        (now / options.animationLength) *
          360 *
          (options.isRotatingCounterClockwise ? -1 : 1) +
          options.rotationOffset
      )
    );
  }

  ctx.translate(canvas.width / -2, canvas.height / -2);

  // Apply the base opacity from options and then multiply by the flag-specific opacity
  ctx.globalAlpha = (options.overlayOpacity / 100) * opacity;

  await drawFlagContent(canvas, ctx, flagColors, options);

  ctx.restore();
}
