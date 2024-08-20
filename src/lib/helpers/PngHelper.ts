import { assetToImage } from "./assetToImage";

import br from "../../assets/flags/brazil.png";

import ca from "../../assets/flags/canada.png";

import th from "../../assets/flags/thai.png";

import sw from "../../assets/flags/sweden.png";

import boarisch from "../../assets/flags/bavaria.png";

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

import remigrationb from "../../assets/flags/remigrationb.png";

import remigrationw from "../../assets/flags/remigrationw.png";

import abschiebung from "../../assets/flags/abschiebung.png";

import czechish from "../../assets/flags/czech.png";

import shlomo from "../../assets/flags/freeshlomo.png"

const canada = await assetToImage(ca);
const brazil = await assetToImage(br);
const bavaria = await assetToImage(boarisch);
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
const teamrb = await assetToImage(remigrationb);
const teamrw = await assetToImage(remigrationw);
const grabsch = await assetToImage(abschiebung);
const czech = await assetToImage(czechish);
const freeshlomo = await assetToImage(shlomo);

export function getPng(discriminator: string, canvas: any, ctx: any) {
  try {
    const flagMap: {[key: string]: HTMLImageElement} = {
      "brazil": brazil,
      "canadian": canada,
      "thailand": thai,
      "swedish": sweden,
      "bavaria": bavaria,
      "swiss": swiss,
      "danish": denish,
      "finnish": finland,
      "iceland": iceland,
      "english": england,
      "scottish": scottland,
      "welsh": wales,
      "australia": aussi,
      "new zealand": newzealand,
      "bosnia": bosnia,
      "jamaica": jamaica,
      "turkish": turkey,
      "south africa": southafrica,
      "maltese": malta,
      "japan": japan,
      "team remigration (blue)": teamrb,
      "team remigration (white)": teamrw,
      "gruppe abschiebung": grabsch,
      "freeshlomo": freeshlomo,
      "czech" : czech
    };

    const disc = discriminator.toLowerCase();
    let flag: any = undefined;

    for (const key in flagMap) {
      if (disc.startsWith(key)) {
        flag = flagMap[key];
        break;
      }
    }

    if (flag) {
      ctx.drawImage(flag, 0, 0, canvas.width, canvas.height);
    } else {
      // Handle default case or throw an error
    }
  } catch (e) {
    // Handle or log the error
  }
}

