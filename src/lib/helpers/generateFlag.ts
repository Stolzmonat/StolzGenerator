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
  originalAspectRatio: number = 7 / 4 // default aspect ratio
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate new height based on original aspect ratio
  const newHeight = size.width / originalAspectRatio;

  canvas.width = size.width;
  canvas.height = newHeight;

  if (ctx)
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
      return canvas.toDataURL();
    }

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

  return canvas.toDataURL();
}
