export function drawUSAFlag(canvas, ctx) {
        // console.log('america');
        var height = canvas.height;
        var width = height * 1.9;
        var xStarSeparation = height * 0.063;
        var yStarSeparation = height * 0.054;
    
        //create white background
    
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
    
        //create red stripes
    
        for (var i = 0; i < 13; i += 2) {
          ctx.fillStyle = "#e0162b";
          ctx.fillRect(0, i * (height / 13), width, height / 13);
        }
    
        //create blue box
    
        ctx.fillStyle = "#0052a5";
        ctx.fillRect(0, 0, 0.76 * height, (7 / 13) * height);
    
        //fill stars and add to flag
    
        var outerRadius = (0.0616 * height) / 2;
        var innerRadius =
          (outerRadius * Math.sin(Math.PI / 10)) / Math.sin((7 * Math.PI) / 10);
    
        ctx.fillStyle = "#ffffff";
        for (var row = 1; row <= 9; ++row) {
          for (var col = 1; col <= 11; ++col) {
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
          context,
          xCenter,
          yCenter,
          nPoints,
          outerRadius,
          innerRadius
        ) {
          ctx.beginPath();
          for (var ixVertex = 0; ixVertex <= 2 * nPoints; ++ixVertex) {
            var angle = (ixVertex * Math.PI) / nPoints - Math.PI / 2;
            var radius = ixVertex % 2 == 0 ? outerRadius : innerRadius;
            ctx.lineTo(
              xCenter + radius * Math.cos(angle),
              yCenter + radius * Math.sin(angle)
            );
          }
        }
}
