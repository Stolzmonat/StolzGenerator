import { flagColours } from "../constants/flagColours";
import { Size } from "../types/size";
import { drawUnionjack } from "../drawFlags/drawUnionJack";
import { drawUSAFlag } from "../drawFlags/drawUsaFlag";
import { drawGreeceFlag } from "../drawFlags/drawGreeceFlag";
import { drawChileanFlag } from "../drawFlags/drawChileanFlag";
import { getPng } from "./PngHelper";

/// Default ratio = 7:4
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
        drawSecondaryFlag(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    } else if (colors[0].startsWith("#")) {
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
        drawSecondaryFlag(ctx, canvas, secondaryColors);
      }
      
      return canvas.toDataURL();
    }

    // Draw primary flag
    drawFlagByColors(ctx, canvas, colors);
    
    // If a secondary flag is provided, overlay it with 50% opacity
    if (secondaryColors && secondaryColors.length > 0) {
      drawSecondaryFlag(ctx, canvas, secondaryColors);
    }
  }

  return canvas.toDataURL();
}

function drawFlagByColors(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): void {
  for (var item in flagColours) {
    if (flagColours[item] == colors) {
      if (item?.toLowerCase().startsWith("amer")) {
        drawUSAFlag(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("uk p")) {
        drawUnionjack(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("greece")) {
        drawGreeceFlag(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("chile")) {
        drawChileanFlag(canvas, ctx);
      } else {
        getPng(item, canvas, ctx);
      }
    }
  }
}

function drawSecondaryFlag(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): void {
  // Save context state to restore opacity later
  ctx.save();
  
  // Set opacity for secondary flag
  ctx.globalAlpha = 0.5;
  
  // Draw the secondary flag
  drawFlagByColors(ctx, canvas, colors);
  
  // Restore context state
  ctx.restore();
}
