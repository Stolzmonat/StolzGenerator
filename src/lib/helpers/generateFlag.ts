import { flagColours } from "../constants/flagColours";
import { Size } from "../types/size";
import { drawUnionjack } from "../drawFlags/drawUnionJack";
import { drawUSAFlag } from "../drawFlags/drawUsaFlag";
import { drawGreeceFlag } from "../drawFlags/drawGreeceFlag";
import { drawChileanFlag } from "../drawFlags/drawChileanFlag";

/// Default ratio = 7:4
export function generateFlag(
  colors: string[],
  size: Size = new Size(105, 60)
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size.width;
  canvas.height = size.height;

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
  } else {
    for (let i = 0; i < colors.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(
        0,
        (i * size.height) / colors.length,
        size.width,
        size.height / colors.length
      );
    }
  }

  for (var item in flagColours) {
    if (flagColours[item] == colors) {
      if (item?.toLowerCase().startsWith("swiss")) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          canvas.width / 2 - 3,
          canvas.height * 0.1,
          10,
          canvas.height * 0.8
        );
        ctx.fillRect(
          canvas.width * 0.1,
          canvas.height / 2 - 3,
          canvas.width * 0.8,
          10
        );
      } else if (item?.toLowerCase().startsWith("amer")) {
        drawUSAFlag(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("uk p")) {
        drawUnionjack(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("greece")) {
        drawGreeceFlag(canvas, ctx);
      } else if (item?.toLowerCase().startsWith("chile")) {
        drawChileanFlag(canvas, ctx);
      }
    }
  }

  return canvas.toDataURL();
}
