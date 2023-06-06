export function drawUnionjack(canvas, ctx){




    ctx.fillStyle = "#00247d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = canvas.width * 0.11;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = canvas.width * 0.11;
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.0333;
    ctx.beginPath();
    ctx.moveTo(-canvas.width*0.05, -canvas.height*0.02);
    ctx.lineTo(canvas.width/2, canvas.height*0.54);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.0333;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height*1.04);
    ctx.lineTo(canvas.width/2, canvas.height*0.54);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.0333;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 1.05555555, -canvas.height*0.1);
    ctx.lineTo(canvas.width / 2, canvas.height*0.46);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.0333;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 1.05555555, canvas.height*1.02);
    ctx.lineTo(canvas.width / 2, canvas.height*0.46);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = canvas.width * 0.16;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = canvas.width * 0.16;
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height*0.5);
    ctx.lineTo(0, canvas.height*0.5);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.11;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = "#cf142b";
    ctx.lineWidth = canvas.width * 0.11;
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height*0.5);
    ctx.lineTo(0, canvas.height*0.5);
    ctx.stroke();

}