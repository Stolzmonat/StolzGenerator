#!/usr/bin/env node

/**
 * Dieses Skript generiert Vorschaubilder direkt aus den PNG-Flaggen und speichert sie als Base64-Strings.
 * So müssen die großen PNG-Dateien nicht beim Laden der Anwendung heruntergeladen werden.
 * Es verwendet Sharp für eine effiziente Bildverarbeitung.
 * 
 * Flaggen mit Farbwerten werden ignoriert, da diese effizient vom Browser gerendert werden können.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { promisify } from 'util';

// ES Module Kompatibilität
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfade konfigurieren
const flagsDir = path.join(__dirname, '../src/assets/flags');
const outputFile = path.join(__dirname, '../src/lib/constants/flagThumbnails.ts');
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);

// Lese die flagColours.ts Datei und extrahiere alle Flaggeninformationen
async function getFlagInfo() {
  console.log('Lese Flaggeninformationen aus flagColours.ts...');
  
  try {
    const flagColoursPath = path.join(__dirname, '../src/lib/constants/flagColours.ts');
    const flagColoursContent = fs.readFileSync(flagColoursPath, 'utf8');
    
    // Extrahiere den flagColours-Objektcode
    const match = flagColoursContent.match(/export\s+const\s+flagColours[^{]*{([^]*?)}/);
    if (!match) {
      throw new Error('Konnte flagColours-Objekt nicht in der Datei finden');
    }
    
    const objContent = match[1];
    
    // Parse alle Flaggen und ihre Werte
    const flagsInfo = [];
    const entryRegex = /"([^"]+)":\s*\[([\s\S]*?)\]/g;
    let entryMatch;
    
    while ((entryMatch = entryRegex.exec(objContent)) !== null) {
      const flagName = entryMatch[1];
      const valuesText = entryMatch[2].trim();
      
      // Bestimme, ob diese Flagge vom Browser gerendert werden kann oder eine PNG-Datei benötigt
      // Fall 1: Mehrere Farben/Elemente (mit Kommas)
      const hasMultipleElements = valuesText.includes(',');
      
      // Fall 2: Referenz auf einen Flag-Generator (mit ./)
      const isPathReference = valuesText.includes('./');
      
      // Fall 3: Einfacher Name ohne Kommas und ohne ./ (benötigt PNG)
      const isSingleElementWithoutPath = !hasMultipleElements && !isPathReference;
      
      // Wir müssen für PNG-basierte Flaggen und für Flaggen mit Pfadreferenzen (./) Thumbnails generieren
      // Wichtig: Auch für isPathReference Thumbnails generieren, wenn sie auf PNG-Dateien verweisen
      const needsPngThumbnail = isSingleElementWithoutPath || isPathReference;
      
      // Für Debugging-Zwecke speichern wir auch den Wert
      flagsInfo.push({
        name: flagName,
        value: valuesText,
        needsPngThumbnail,
        isPathReference,
        hasMultipleElements
      });
    }
    
    console.log(`Informationen für ${flagsInfo.length} Flaggen gefunden.`);
    return flagsInfo;
  } catch (error) {
    console.error('Fehler beim Lesen der Flaggeninformationen:', error);
    return [];
  }
}

// Hilfsfunktion zur Normalisierung von Flaggennamen für Vergleiche
function normalizeForComparison(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\(.*?\)/g, '')  // Entferne Klammern und ihren Inhalt
    .replace(/[^a-z]/g, '')   // Nur Buchstaben behalten
    .trim();
}

// Generiere alternative Schreibweisen und Varianten für einen Flaggennamen
function generateAlternativeNames(name) {
  // Jede Flagge ist einzeln für sich, keine Varianten nötig
  return [normalizeForComparison(name)];
}

// Findet die passendste PNG-Datei für einen gegebenen Flaggennamen
function findBestMatchingFile(flagName, pngFiles) {
  console.log(`Suche nach passender Datei für: ${flagName}`);
  
  // Normalisiere alle Dateinamen für besseres Matching
  const normalizedFiles = pngFiles.map(file => {
    const baseName = path.basename(file, '.png');
    return {
      originalPath: file,
      normalized: normalizeForComparison(baseName)
    };
  });
  
  // Normalisiere den Flaggennamen
  const normalizedName = normalizeForComparison(flagName);
  console.log(`Normalisierter Name für "${flagName}": ${normalizedName}`);
  
  // 1. Versuche exakte Übereinstimmungen
  const exactMatch = normalizedFiles.find(file => file.normalized === normalizedName);
  if (exactMatch) {
    console.log(`Exakte Übereinstimmung gefunden für "${flagName}": ${exactMatch.originalPath}`);
    return exactMatch.originalPath;
  }
  
  // 2. Versuche Teilübereinstimmungen
  // Suche nach Dateien, die den normalisierten Namen im Namen enthalten
  const containsName = normalizedFiles.filter(file => 
    file.normalized.includes(normalizedName) || normalizedName.includes(file.normalized)
  );
  
  if (containsName.length > 0) {
    // Bei mehreren Treffern nehme die mit der höchsten Ähnlichkeit
    // (einfache Heuristik: je näher die Längen, desto ähnlicher)
    const bestMatch = containsName.sort((a, b) => {
      const lengthDiffA = Math.abs(a.normalized.length - normalizedName.length);
      const lengthDiffB = Math.abs(b.normalized.length - normalizedName.length);
      return lengthDiffA - lengthDiffB;
    })[0];
    
    console.log(`Teilübereinstimmung gefunden für "${flagName}": ${bestMatch.originalPath}`);
    return bestMatch.originalPath;
  }
  
  // 3. Spezialfälle für bestimmte Flaggentypen
  if (flagName.toLowerCase().includes('remigration')) {
    const color = flagName.toLowerCase().includes('blue') ? 'b' : 
                 flagName.toLowerCase().includes('white') ? 'w' : '';
    
    const remigrationFile = pngFiles.find(file => 
      file.toLowerCase().includes('remigration') && file.toLowerCase().includes(color)
    );
    
    if (remigrationFile) {
      console.log(`Spezialfall (Remigration) für "${flagName}": ${remigrationFile}`);
      return remigrationFile;
    }
  }
  
  console.log(`Keine passende Datei für "${flagName}" gefunden.`);
  return null;
}

// Generiert ein Thumbnail für ein Bild mit Sharp
async function generateThumbnail(imagePath) {
  try {
    // Lese die Bilddatei
    const fullPath = path.join(flagsDir, imagePath);
    console.log(`Lade Bilddatei: ${fullPath}`);
    
    // Prüfe, ob die Datei existiert
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Datei existiert nicht: ${fullPath}`);
    }
    
    const imageBuffer = await readFileAsync(fullPath);
    
    // Resize mit Sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(50, 30, { fit: 'fill' })
      .png()
      .toBuffer();
    
    // Konvertiere zu Base64
    const base64Image = `data:image/png;base64,${resizedImageBuffer.toString('base64')}`;
    return base64Image;
  } catch (error) {
    console.error(`Fehler beim Verarbeiten von ${imagePath}:`, error);
    throw error;
  }
}

// Verarbeitet eine einzelne Flagge
async function processFlagThumbnail(flagInfo, pngFiles) {
  const { name, needsPngThumbnail, isPathReference, hasMultipleElements } = flagInfo;
  
  // Überspringen von Flaggen, die vom Browser gerendert werden können
  if (!needsPngThumbnail) {
    if (isPathReference) {
      console.log(`Überspringe "${name}" - verwendet einen Generator (${flagInfo.value})`);
    } else if (hasMultipleElements) {
      console.log(`Überspringe "${name}" - verwendet Farbwerte`);
    } else {
      console.log(`Überspringe "${name}" - kann vom Browser gerendert werden`);
    }
    return null;
  }
  
  // Für PNG-basierte Flaggen, finde die passende Datei
  const matchingFile = findBestMatchingFile(name, pngFiles);
  
  if (matchingFile) {
    console.log(`Gefundene Datei für "${name}": ${matchingFile}`);
    try {
      // Generiere Thumbnail
      return await generateThumbnail(matchingFile);
    } catch (error) {
      console.error(`Fehler beim Generieren des Thumbnails für ${name}:`, error);
    }
  } else {
    console.log(`Keine passende Datei für "${name}" gefunden.`);
  }
  
  return null;
}

// Hauptfunktion
async function main() {
  console.log('Generiere Flaggen-Thumbnails von PNG-Dateien...');
  
  try {
    // Lese alle Flaggeninformationen
    const flagsInfo = await getFlagInfo();
    
    // Lese alle PNG-Dateien
    const pngFiles = (await readdirAsync(flagsDir)).filter(file => 
      file.toLowerCase().endsWith('.png')
    );
    console.log(`${pngFiles.length} PNG-Dateien gefunden.`);
    
    // Generiere Thumbnails für PNG-basierte Flaggen
    const thumbnails = {};
    let successCount = 0;
    let failCount = 0;
    
    // Verarbeitete Flaggen nach Kategorien
    const categorySummary = {
      browserRenderable: 0,
      pngProcessed: 0,
      failed: 0
    };
    
    // Detaillierte Informationen über fehlgeschlagene Elemente
    const failedItems = [];
    
    for (const flagInfo of flagsInfo) {
      if (!flagInfo.needsPngThumbnail) {
        categorySummary.browserRenderable++;
        continue;
      }
      
      const thumbnail = await processFlagThumbnail(flagInfo, pngFiles);
      
      if (thumbnail) {
        thumbnails[flagInfo.name] = thumbnail;
        successCount++;
        categorySummary.pngProcessed++;
      } else {
        failCount++;
        categorySummary.failed++;
        
        // Sammle detaillierte Informationen über den Fehler
        const normalizedName = normalizeForComparison(flagInfo.name);
        const availableFiles = pngFiles.map(file => path.basename(file, '.png'));
        const normalizedFiles = availableFiles.map(file => normalizeForComparison(file));
        
        // Finde ähnlichste Dateinamen für bessere Fehlerdiagnose
        const similarFiles = normalizedFiles
          .map((normFile, idx) => ({ 
            name: availableFiles[idx], 
            similarity: calculateSimilarity(normalizedName, normFile)
          }))
          .filter(item => item.similarity > 0.3) // Nur Dateien mit einer gewissen Ähnlichkeit anzeigen
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 3); // Top 3 ähnlichste Dateien
        
        failedItems.push({
          flagName: flagInfo.name,
          normalizedName,
          expectation: `Erwarte eine Datei mit dem normalisierten Namen "${normalizedName}" oder ähnlich`,
          issue: "Keine passende PNG-Datei gefunden",
          suggestion: similarFiles.length > 0 
            ? `Ähnlichste Dateien: ${similarFiles.map(f => `${f.name} (${Math.round(f.similarity * 100)}%)`).join(', ')}`
            : "Keine ähnlichen Dateien gefunden",
          flagInfo
        });
      }
    }
    
    // Schreibe das Ergebnis in die Ausgabedatei
    let outputContent = `/* Automatisch generierte Datei - bitte nicht händisch ändern */\n\n`;
    outputContent += `export const flagThumbnails = ${JSON.stringify(thumbnails, null, 2)};\n`;
    
    fs.writeFileSync(outputFile, outputContent, 'utf8');
    console.log(`Erfolgreich generierte ${successCount} Thumbnails und übersprang ${failCount} Flaggen.`);
    console.log('Zusammenfassung:', categorySummary);
    
    // Detaillierter Bericht über fehlgeschlagene Elemente
    if (failedItems.length > 0) {
      console.log('\n----- DETAILLIERTER FEHLERBERICHT -----');
      console.log(`${failedItems.length} Flaggen konnten nicht verarbeitet werden:`);
      
      failedItems.forEach((item, index) => {
        console.log(`\n${index + 1}. Fehler bei: "${item.flagName}"`);
        console.log(`   Normalisierter Name: "${item.normalizedName}"`);
        console.log(`   Problem: ${item.issue}`);
        console.log(`   Erwartung: ${item.expectation}`);
        console.log(`   Vorschlag: ${item.suggestion}`);
        
        if (item.flagInfo.isPathReference) {
          console.log(`   Info: Verwendet möglicherweise einen Generator (${item.flagInfo.value})`);
        }
      });
      
      // Zusätzliche diagnostische Informationen
      console.log('\n----- VERFÜGBARE PNG-DATEIEN -----');
      console.log(pngFiles.map(file => path.basename(file)).join('\n'));
    }
  } catch (error) {
    console.error('Fehler in der Hauptfunktion:', error);
  }
}

// Hilfsfunktion zur Berechnung der Ähnlichkeit zwischen zwei Strings (Levenshtein-Distanz)
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Wenn einer der Strings leer ist, ist die Ähnlichkeit 0
  if (len1 === 0 || len2 === 0) return 0.0;
  
  // Matrix für die dynamische Programmierung initialisieren
  const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
  
  // Matrix füllen
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Löschen
        matrix[i][j - 1] + 1,      // Einfügen
        matrix[i - 1][j - 1] + cost // Ersetzen oder Beibehalten
      );
    }
  }
  
  // Distanz berechnen
  const distance = matrix[len1][len2];
  
  // Ähnlichkeit als Verhältnis zur maximalen möglichen Distanz
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1.0 : 1.0 - distance / maxLen;
}

// Starte das Skript
main().catch(error => {
  console.error('Unerwarteter Fehler:', error);
  process.exit(1);
});