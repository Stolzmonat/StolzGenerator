// Bildpositionsspeicher für Konsistenz zwischen Renderzyklen 
export class ImagePositionStore {
  private static instance: ImagePositionStore;
  
  // Gespeicherte Bildposition und Skalierung
  private _offsetX: number = 0;
  private _offsetY: number = 0;
  private _scale: number = 100;
  
  // Singleton-Zugriff
  public static getInstance(): ImagePositionStore {
    if (!ImagePositionStore.instance) {
      ImagePositionStore.instance = new ImagePositionStore();
    }
    return ImagePositionStore.instance;
  }
  
  // Getter und Setter für Position und Skalierung
  public getOffsetX(): number {
    return this._offsetX;
  }
  
  public setOffsetX(value: number): void {
    this._offsetX = value;
  }
  
  public getOffsetY(): number {
    return this._offsetY;
  }
  
  public setOffsetY(value: number): void {
    this._offsetY = value;
  }
  
  public getScale(): number {
    return this._scale;
  }
  
  public setScale(value: number): void {
    // Bei Skalierungsänderung passen wir die Offsets proportional an
    const scaleFactor = value / this._scale;
    this._offsetX *= scaleFactor;
    this._offsetY *= scaleFactor;
    this._scale = value;
  }
  
  // Hilfsmethode, um den aktuellen Status abzurufen
  public getState() {
    return {
      offsetX: this._offsetX,
      offsetY: this._offsetY,
      scale: this._scale
    };
  }
}