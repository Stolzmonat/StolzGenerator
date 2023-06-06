export function drawChileanFlag(canvas, ctx) {
  var height = canvas.height;
  var width = height * 1.9;

  const upperLeft = ["#14388c", "#0d3d91", "#173e99"];

  const upperRight = ["#e2e3e5", "#e8e9ed", "#ffffff"];

  var baseColors = ["#c80f2e", "#e30011", "#e30011"];

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
