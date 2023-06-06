import { flagColours } from "../constants/flagColours";
import type { CanvasDrawOptions } from "../types/canvasDrawOptions";
import { CutoutType } from "../types/cutoutType";
import { degToRad } from "./degToRad";
import { isImageOk } from "./isImageOk";
import { drawUSAFlag } from "../drawFlags/drawUsaFlag";
import { drawUnionjack } from "../drawFlags/drawUnionJack";
import { drawGreeceFlag } from "../drawFlags/drawGreeceFlag";
import { drawChileanFlag } from "../drawFlags/drawChileanFlag";
import { drawCanadianFlag } from "../drawFlags/drawCanadianFlag";

/**
    @param now - the amount of milliseconds elapsed in the animation
*/
export function drawToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  selectedImage: HTMLImageElement,
  options: CanvasDrawOptions,
  now: number
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (options.cutoutType != CutoutType.OVERLAY) {
    drawFlag(canvas, ctx, options, now);
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

  if (selectedImage && isImageOk(selectedImage)) {
    ctx.drawImage(
      selectedImage,
      options.resizeInwards
        ? (canvas.width * (1 - options.cutoutSize / 100)) / 2
        : 0,
      options.resizeInwards
        ? (canvas.height * (1 - options.cutoutSize / 100)) / 2
        : 0,
      canvas.width -
        (options.resizeInwards
          ? canvas.width * (1 - options.cutoutSize / 100)
          : 0),
      canvas.height -
        (options.resizeInwards
          ? canvas.height * (1 - options.cutoutSize / 100)
          : 0)
    );
  }

  ctx.restore();

  if (options.cutoutType == CutoutType.OVERLAY) {
    drawFlag(canvas, ctx, options, now);
  }
}

function drawFlag(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: CanvasDrawOptions,
  now: number
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

  ctx.globalAlpha = options.overlayOpacity / 100;

  if (options.selectedColors[0].startsWith("./usa")) {
    drawUSAFlag(canvas, ctx);
  } else if (options.selectedColors[0].startsWith("./unionjack")) {
    drawUnionjack(canvas, ctx);
  } else if (options.selectedColors[0].startsWith("./greece")) {
    drawGreeceFlag(canvas, ctx);
  } else if (options.selectedColors[0].startsWith("./chile")) {
    drawChileanFlag(canvas, ctx);
  } else if (options.selectedColors[0].startsWith("./canada")) {
    drawCanadianFlag(canvas, ctx);
  } else if (!options.isGradient) {
    // console.log(options.selectedColors);
    if (options.selectedColors[0] == "-") {
      for (let i = 1; i < options.selectedColors.length; i++) {
        ctx.fillStyle = options.selectedColors[i];
        ctx.fillRect(
          // x
          i == 1
            ? -canvas.width / 2
            : ((i - 1) * canvas.width) / (options.selectedColors.length - 1),
          // y
          -canvas.height / 2,
          // w
          ([1, options.selectedColors.length].includes(i)
            ? canvas.width / 2
            : 0) +
            canvas.width / (options.selectedColors.length - 1),
          // h
          canvas.height * 2
        );
      }
    } else {
      for (let i = 0; i < options.selectedColors.length; i++) {
        ctx.fillStyle = options.selectedColors[i];
        ctx.fillRect(
          -canvas.width / 2,
          i == 0
            ? -canvas.height / 2
            : (i * canvas.height) / options.selectedColors.length,
          canvas.width * 2,
          ([0, options.selectedColors.length - 1].includes(i)
            ? canvas.height / 2
            : 0) +
            canvas.height / options.selectedColors.length
        );
      }
    }
  } else {
    if (options.selectedColors[0] == "-") {
      let gradient = ctx.createLinearGradient(
        0,
        canvas.width / 2,
        canvas.height,
        canvas.width / 2
      );

      for (let i = 1; i < options.selectedColors.length; i++) {
        gradient.addColorStop(
          i / (options.selectedColors.length - 1),
          options.selectedColors[i]
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

      for (let i = 0; i < options.selectedColors.length; i++) {
        gradient.addColorStop(
          i / (options.selectedColors.length - 1),
          options.selectedColors[i]
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

  // 320, 320
  for (var item in flagColours) {
    if (flagColours[item] == options.selectedColors) {
      if (item.toLowerCase().startsWith("swiss")) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          canvas.width / 2 - 30,
          canvas.height * 0.1,
          60,
          canvas.height * 0.8
        );
        ctx.fillRect(
          canvas.width * 0.1,
          canvas.height / 2 - 30,
          canvas.width * 0.8,
          60
        );
      }
    }
  }

  ctx.restore();
}
