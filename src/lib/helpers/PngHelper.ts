import { assetToImage } from "./assetToImage";

import br from "../../assets/flags/brazil.png";

import ca from "../../assets/flags/canada.png";

import th from "../../assets/flags/thai.png";

import sw from "../../assets/flags/sweden.png";

import swis from "../../assets/flags/swissPride.png";

import denmark from "../../assets/flags/denmark.png";

import finnish from "../../assets/flags/finland.png";

import ice from "../../assets/flags/island.png";

import english from "../../assets/flags/english.png";

import scottish from "../../assets/flags/scottland.png";

import welsh from "../../assets/flags/welsh.png";

import FlippedSchluchtenScheißer from "../../assets/flags/upsidedown_austria.png";

import newzealandish from "../../assets/flags/newzealand.png";

import bosnish from "../../assets/flags/bosnien.png";

import jamaican from "../../assets/flags/jamaika.png";

import turkish from "../../assets/flags/turkish.png";

import southafrican from "../../assets/flags/southafrica.png";

import maltese from "../../assets/flags/malta.png";

import japanese from "../../assets/flags/japan.png";

const canada = await assetToImage(ca);
const brazil = await assetToImage(br);
const thai = await assetToImage(th);
const sweden = await assetToImage(sw);
const swiss = await assetToImage(swis);
const denish = await assetToImage(denmark);
const finland = await assetToImage(finnish);
const iceland = await assetToImage(ice);
const england = await assetToImage(english);
const scottland = await assetToImage(scottish);
const wales = await assetToImage(welsh);
const aussi = await assetToImage(FlippedSchluchtenScheißer);
const newzealand = await assetToImage(newzealandish);
const bosnia = await assetToImage(bosnish);
const jamaica = await assetToImage(jamaican);
const turkey = await assetToImage(turkish);
const southafrica = await assetToImage(southafrican);
const malta = await assetToImage(maltese);
const japan = await assetToImage(japanese);

export function getPng(discriminator: string, canvas, ctx) {
  try {
    var flag: HTMLImageElement;
    switch (discriminator.toLowerCase().substring(0, 5)) {
      case "brazi":
        flag = brazil;
        break;
      case "canad":
        flag = canada;
        break;
      case "thail":
        flag = thai;
        break;
      case "thail":
        flag = thai;
        break;
      case "swedi":
        flag = sweden;
        break;
      case "swiss":
        flag = swiss;
        break;
      case "danis":
        flag = denish;
        break;
      case "icela":
        flag = iceland;
        break;
      case "finni":
        flag = finland;
        break;
      case "engli":
        flag = england;
        break;
      case "scott":
        flag = scottland;
        break;
      case "welsh":
        flag = wales;
        break;
      case "austr":
        flag = aussi;
        break;
      case "new z":
        flag = newzealand;
        break;
      case "bosni":
        flag = bosnia;
        break;
      case "turki":
        flag = turkey;
        break;
      case "jamai":
        flag = jamaica;
        break;
      case "south":
        flag = southafrica;
        break;
      case "malte":
        flag = malta;
        break;
      case "japan":
        flag = japan;
        break;
    }
    ctx.drawImage(flag, 0, 0, canvas.width, canvas.height);
  } catch (e) {}
}
