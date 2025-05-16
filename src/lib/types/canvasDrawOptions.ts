import type { CutoutType } from "./cutoutType";

export type CanvasDrawOptions = {
  cutoutSize: number;
  resizeInwards: boolean;
  selectedColors: string[];
  secondaryFlag: string[];
  isGradient: boolean;
  isRotating: boolean;
  animationLength: number;
  isRotatingCounterClockwise: boolean;
  overlayOpacity: number;
  cutoutType: CutoutType;
  rotationOffset: number;
  imageScale?: number;     // Skalierungsfaktor des Bildes in Prozent
  imageOffsetX?: number;   // Horizontale Verschiebung des Bildes
  imageOffsetY?: number;   // Vertikale Verschiebung des Bildes
};
