import { assetToImage } from "./assetToImage";

// Lazy-Loading für alle Flaggen
const lazyFlags = {
  "brazil": () => import("../../assets/flags/brazil.png"),
  "canadian": () => import("../../assets/flags/canadian.png"),
  "chilean": () => import("../../assets/flags/chilean.png"),
  "thailand": () => import("../../assets/flags/thai.png"),
  "swedish": () => import("../../assets/flags/swedish.png"),
  "bavaria": () => import("../../assets/flags/bavaria.png"),
  "swiss": () => import("../../assets/flags/swissPride.png"),
  "danish": () => import("../../assets/flags/danish.png"),
  "finnish": () => import("../../assets/flags/finnish.png"),
  "island": () => import("../../assets/flags/island.png"),
  "english": () => import("../../assets/flags/english.png"),
  "scottish": () => import("../../assets/flags/scottish.png"),
  "welsh": () => import("../../assets/flags/welsh.png"),
  "australian": () => import("../../assets/flags/australian.png"),
  "new zealand": () => import("../../assets/flags/newzealand.png"),
  "bosnian": () => import("../../assets/flags/bosnian.png"),
  "jamaican": () => import("../../assets/flags/jamaican.png"),
  "turkish": () => import("../../assets/flags/turkish.png"),
  "south africa": () => import("../../assets/flags/southafrica.png"),
  "malta": () => import("../../assets/flags/malta.png"),
  "japan": () => import("../../assets/flags/japan.png"),
  "team remigration (blue)": () => import("../../assets/flags/remigrationb.png"),
  "team remigration (white)": () => import("../../assets/flags/remigrationw.png"),
  "gruppe abschiebung": () => import("../../assets/flags/abschiebung.png"),
  "willkommen im mainstream": () => import("../../assets/flags/mainstream.png"),
  "free shlomo": () => import("../../assets/flags/free_shlomo.png"),
  "czech": () => import("../../assets/flags/czech.png"),
  "uk": () => import("../../assets/flags/uk.png"),
};

// Cache der geladenen Flaggenbilder
const imageCache: { [key: string]: HTMLImageElement } = {};

// Vorab einige wichtige Flaggen laden, um UX zu verbessern
// Dies löst das Problem mit dem ewigen Ladeindikator
async function initFlags() {
  try {
    // Laden der am häufigsten verwendeten Flaggen im Hintergrund
    // Dies stellt sicher, dass die Flaggen-Initialisierung als abgeschlossen gilt
    const commonFlags = ["uk", "brazil", "canadian"];
    await Promise.all(
      commonFlags.map(async (flag) => {
        try {
          if (flag in lazyFlags) {
            await getFlag(flag);
          }
        } catch (err) {
          console.warn(`Fehler beim Vorladen der Flagge ${flag}:`, err);
          // Fehler unterdrücken, damit die Initialisierung nicht fehlschlägt
        }
      })
    );
    return true;
  } catch (error) {
    console.error("Fehler bei der Flag-Initialisierung:", error);
    // Trotz Fehler true zurückgeben, damit die Anwendung nicht blockiert wird
    return true;
  }
}

// Flag initialisieren - Promise wird resolved, wenn das Flag-System bereit ist
export const flagsInitialized = initFlags();

/**
 * Lädt eine Flagge und gibt das Bild zurück
 */
async function getFlag(key: string): Promise<HTMLImageElement> {
  // Wenn bereits im Cache, sofort zurückgeben
  if (imageCache[key]) {
    return imageCache[key];
  }
  
  // Lazy laden
  if (key in lazyFlags) {
    try {
      const importedFlag = await lazyFlags[key]();
      const flagImage = await assetToImage(importedFlag.default);
      imageCache[key] = flagImage;
      return flagImage;
    } catch (error) {
      console.error(`Error loading flag image: ${key}`, error);
      throw error;
    }
  }
  
  throw new Error(`Flag not found: ${key}`);
}

/**
 * Zeichnet eine Flagge auf den Canvas
 */
export async function getPng(discriminator: string, canvas: any, ctx: any) {
  try {
    const disc = discriminator.toLowerCase();
    let flagKey = null;

    // Suche nach dem passenden Flaggenschlüssel
    for (const key in lazyFlags) {
      if (disc.startsWith(key)) {
        flagKey = key;
        break;
      }
    }

    if (flagKey) {
      const flagImage = await getFlag(flagKey);
      ctx.drawImage(flagImage, 0, 0, canvas.width, canvas.height);
    }
  } catch (e) {
    console.error("Error in getPng:", e);
  }
}

/**
 * Gibt ein Bild-Objekt für eine Flagge zurück (für Vorschaubilder)
 */
export async function getFlagThumbnail(flagName: string): Promise<HTMLImageElement | null> {
  try {
    let flagKey = null;
    
    for (const key in lazyFlags) {
      if (flagName.toLowerCase().startsWith(key)) {
        flagKey = key;
        break;
      }
    }
    
    if (flagKey) {
      return await getFlag(flagKey);
    }
    return null;
  } catch (e) {
    console.error(`Error getting flag thumbnail for ${flagName}:`, e);
    return null;
  }
}

