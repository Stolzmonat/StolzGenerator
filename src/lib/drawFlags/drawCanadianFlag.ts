import { assetToImage } from "../helpers/assetToImage";
import img from '../../assets/flags/canada.png';

var flag = await assetToImage(img);

export function drawCanadianFlag(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.drawImage(flag, 0, 0, canvas.width, canvas.height);
}
