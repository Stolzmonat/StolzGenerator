export function drawUSAFlag(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  var height: number = canvas.height;
  var width: number = height * 1.9;
  var xStarSeparation: number = height * 0.063;
  var yStarSeparation: number = height * 0.054;

  //create white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  //create red stripes
  for (var i: number = 0; i < 13; i += 2) {
    ctx.fillStyle = "#e0162b";
    ctx.fillRect(0, i * (height / 13), width, height / 13);
  }

  //create blue box
  ctx.fillStyle = "#0052a5";
  ctx.fillRect(0, 0, 0.76 * height, (7 / 13) * height);

  //fill stars and add to flag
  var outerRadius: number = (0.0616 * height) / 2;
  var innerRadius: number =
    (outerRadius * Math.sin(Math.PI / 10)) / Math.sin((7 * Math.PI) / 10);

  ctx.fillStyle = "#ffffff";
  for (var row: number = 1; row <= 9; ++row) {
    for (var col: number = 1; col <= 11; ++col) {
      if ((row + col) % 2 == 0) {
        drawStar(
          canvas,
          xStarSeparation * col,
          yStarSeparation * row,
          5,
          outerRadius,
          innerRadius
        );
        ctx.fill();
      }
    }
  }

  //function used to build stars
  function drawStar(
    context: HTMLCanvasElement,
    xCenter: number,
    yCenter: number,
    nPoints: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    ctx.beginPath();
    for (var ixVertex: number = 0; ixVertex <= 2 * nPoints; ++ixVertex) {
      var angle: number = (ixVertex * Math.PI) / nPoints - Math.PI / 2;
      var radius: number = ixVertex % 2 == 0 ? outerRadius : innerRadius;
      ctx.lineTo(
        xCenter + radius * Math.cos(angle),
        yCenter + radius * Math.sin(angle)
      );
    }
  }
}
