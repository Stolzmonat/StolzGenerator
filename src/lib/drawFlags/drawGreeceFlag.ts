export function drawGreeceFlag(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  var height: number = canvas.height;
  var width: number = height * 1.9;

  const baseColors: string[] = [
    "#148dd7",
    "#1ec6eb",
    "#2de2f5",
    "#44f0fa",
    "#66f7fc",
    "#99fbfd",
    "#ccfdfe",
  ];

  var secBaseColors: string[] = ["#00c9fe", "#00dffe", "#ffffff", "#00f2fe"];

  baseColors.reverse();
  secBaseColors.reverse();

  // base stripes
  for (var i: number = 0; i < 7; i++) {
    ctx.fillStyle = baseColors[i];
    ctx.fillRect(0, i * (height / 7), width, height / 7);
  }

  for (var i: number = 0; i < 4; i++) {
    ctx.fillStyle = secBaseColors[i];
    ctx.fillRect(0, i * (height / 7), width * 0.35, height / 7);
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(width / 7, 0, width / 14, (height / 7) * 4);
}
