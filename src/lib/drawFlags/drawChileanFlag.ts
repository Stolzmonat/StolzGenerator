export function drawChileanFlag(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  var height: number = canvas.height;
  var width: number = height * 1.9;

  const upperLeft: string[] = ["#14388c", "#0d3d91", "#173e99"];

  const upperRight: string[] = ["#e2e3e5", "#e8e9ed", "#ffffff"];

  var baseColors: string[] = ["#c80f2e", "#e30011", "#e30011"];

  //draw upper left
  for (var i = 0; i < 3; i++) {
    ctx.fillStyle = upperLeft[i];
    ctx.fillRect(0, i * (height / 6), canvas.width / 2, canvas.height / 6);
  }

  //draw upper right
  for (var i = 0; i < 3; i++) {
    ctx.fillStyle = upperRight[i];
    ctx.fillRect(
      canvas.width / 2,
      i * (height / 6),
      canvas.width,
      canvas.height / 6
    );
  }

  // draw base
  for (var i = 0; i < 3; i++) {
    ctx.fillStyle = baseColors[i];
    ctx.fillRect(
      0,
      i * (height / 6) + (canvas.height/2),
      canvas.width,
      canvas.height / 6
    );
  }
}
