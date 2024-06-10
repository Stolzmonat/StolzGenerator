export interface Canvas {
  height: number;
  width: number;
}

export interface Context {
  fillStyle: string;
  fillRect(x: number, y: number, width: number, height: number): void;
}

export function drawCzechFlag(canvas: Canvas, ctx: Context) {
  var height: number = canvas.height;
  var width: number = height * 1.9;

  // draw white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(width / 7, 0, width / 14, (height / 7) * 4);

  // draw red

  // draw blue triangle
}
