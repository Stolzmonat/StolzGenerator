export function assetToImage(fileLocation: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image();
        // let srcUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(fileLocation);
            resolve(img);
        };
        img.onerror = (e) => {
            reject(e);
        };

        img.src = fileLocation;
    });
}