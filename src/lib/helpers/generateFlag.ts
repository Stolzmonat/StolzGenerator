import { flagColours } from "../constants/flagColours";
import { Size } from "../types/size";
import { drawUnionjack } from "../drawFlags/drawUnionJack";
import { drawUSAFlag } from "../drawFlags/drawUsaFlag";
import { drawGreeceFlag } from "../drawFlags/drawGreeceFlag";
import { drawChileanFlag } from "../drawFlags/drawChileanFlag";
import { getPng, flagsInitialized } from "./PngHelper";

// Synchrone Version für Flaggen, die keine PNG-Dateien benötigen
export function generateFlag(
  colors: string[],
  size: Size = new Size(105, 60),
  originalAspectRatio: number = 7 / 4, // default aspect ratio
  secondaryColors?: string[] // Optional secondary flag colors
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate new height based on original aspect ratio
  const newHeight = size.width / originalAspectRatio;

  canvas.width = size.width;
  canvas.height = newHeight;

  if (ctx) {
    if (colors[0] == "-") {
      for (let i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(
          ((i - 1) * size.width) / (colors.length - 1),
          0,
          size.width / (colors.length - 1),
          size.height
        );
      }
      
      // If a secondary flag is provided, overlay it with 50% opacity
      if (secondaryColors && secondaryColors.length > 0) {
        drawSecondaryFlagSync(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    } else if (colors[0]?.startsWith("#")) {
      for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(
          0,
          (i * size.height) / colors.length,
          size.width,
          size.height / colors.length
        );
      }
      
      // If a secondary flag is provided, overlay it with 50% opacity
      if (secondaryColors && secondaryColors.length > 0) {
        drawSecondaryFlagSync(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    }

    // Für spezielle Flaggen
    const flagLookup = {
      // "uk pride": () => { drawUnionjack(canvas, ctx); return true; },
      "american pride": () => { drawUSAFlag(canvas, ctx); return true; },
      "greece pride": () => { drawGreeceFlag(canvas, ctx); return true; },
      "chilean pride": () => { drawChileanFlag(canvas, ctx); return true; }
    };

    for (const key in flagLookup) {
      if (colors[0]?.toLowerCase()?.includes(key)) {
        flagLookup[key]();
        return canvas.toDataURL();
      }
    }

    // Für alle anderen Flaggen erstellen wir ein einfaches Farbmuster
    // anstatt zu versuchen, die PNG-Dateien zu laden
    if (colors[0] == "-") {
      for (let i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i] || "#cccccc";
        ctx.fillRect(
          ((i - 1) * size.width) / (colors.length - 1),
          0,
          size.width / (colors.length - 1),
          size.height
        );
      }
    } else {
      // Erstelle einfache Streifen als Vorschaubild
      const stripeHeight = size.height / (colors.length || 1);
      for (let i = 0; i < (colors.length || 1); i++) {
        ctx.fillStyle = colors[i] || "#cccccc";
        ctx.fillRect(0, i * stripeHeight, size.width, stripeHeight);
      }
    }
  }

  return canvas.toDataURL();
}

// Asynchrone Version für die tatsächliche Darstellung von PNG-Flaggen
export async function generateFlagAsync(
  colors: string[],
  size: Size = new Size(105, 60),
  originalAspectRatio: number = 7 / 4,
  secondaryColors?: string[]
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate new height based on original aspect ratio
  const newHeight = size.width / originalAspectRatio;

  canvas.width = size.width;
  canvas.height = newHeight;

  if (ctx) {
    if (colors[0] == "-") {
      for (let i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(
          ((i - 1) * size.width) / (colors.length - 1),
          0,
          size.width / (colors.length - 1),
          size.height
        );
      }
      
      // If a secondary flag is provided, overlay it with 50% opacity
      if (secondaryColors && secondaryColors.length > 0) {
        await drawSecondaryFlag(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    } else if (colors[0]?.startsWith("#")) {
      for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(
          0,
          (i * size.height) / colors.length,
          size.width,
          size.height / colors.length
        );
      }
      
      // If a secondary flag is provided, overlay it with 50% opacity
      if (secondaryColors && secondaryColors.length > 0) {
        await drawSecondaryFlag(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    }

    // Draw primary flag
    await drawFlagByColors(ctx, canvas, colors);
    
    // If a secondary flag is provided, overlay it with 50% opacity
    if (secondaryColors && secondaryColors.length > 0) {
      await drawSecondaryFlag(ctx, canvas, secondaryColors);
    }
  }

  return canvas.toDataURL();
}

function drawSecondaryFlagSync(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): void {
  // Save context state to restore opacity later
  ctx.save();
  
  // Set opacity for secondary flag
  ctx.globalAlpha = 0.5;
  
  // Einfache Streifen für die Vorschau zeichnen
  const stripeHeight = canvas.height / (colors.length || 1);
  for (let i = 0; i < (colors.length || 1); i++) {
    ctx.fillStyle = colors[i] || "#cccccc";
    ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
  }
  
  // Restore context state
  ctx.restore();
}

async function drawFlagByColors(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): Promise<void> {
  // Warte auf die Initialisierung der vorgeladenen Flaggen
  await flagsInitialized;
  
  for (var item in flagColours) {
    if (flagColours[item] == colors) {
      if (item?.toLowerCase().startsWith("amer")) {
        drawUSAFlag(canvas, ctx);
      // } else if (item?.toLowerCase().startsWith("uk p")) {
      //   drawUnionjack(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("greece")) {
        drawGreeceFlag(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("chile")) {
        drawChileanFlag(canvas, ctx);
      } else {
        await getPng(item, canvas, ctx);
      }
    }
  }
}

async function drawSecondaryFlag(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): Promise<void> {
  // Save context state to restore opacity later
  ctx.save();
  
  // Set opacity for secondary flag
  ctx.globalAlpha = 0.5;
  
  // Draw the secondary flag
  await drawFlagByColors(ctx, canvas, colors);
  
  // Restore context state
  ctx.restore();
}
