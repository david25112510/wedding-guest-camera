const FULL_MAX_EDGE = 2048;
const THUMBNAIL_MAX_EDGE = 720;

export type OptimizedPhoto = {
  photo: File;
  thumbnail: File;
};

export function scaledDimensions(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function canvasBlob(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxEdge: number,
  quality: number,
) {
  const dimensions = scaledDimensions(sourceWidth, sourceHeight, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("O navegador não conseguiu preparar a foto.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("O navegador não conseguiu otimizar a foto.")),
      "image/jpeg",
      quality,
    );
  });
}

async function decodePhoto(file: File) {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return {
      source: bitmap as CanvasImageSource,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = objectUrl;
  try {
    await image.decode();
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
  return {
    source: image as CanvasImageSource,
    width: image.naturalWidth,
    height: image.naturalHeight,
    release: () => URL.revokeObjectURL(objectUrl),
  };
}

export async function optimizePhoto(file: File): Promise<OptimizedPhoto> {
  const decoded = await decodePhoto(file);
  try {
    const [photoBlob, thumbnailBlob] = await Promise.all([
      canvasBlob(decoded.source, decoded.width, decoded.height, FULL_MAX_EDGE, 0.82),
      canvasBlob(decoded.source, decoded.width, decoded.height, THUMBNAIL_MAX_EDGE, 0.72),
    ]);
    const baseName = file.name.replace(/\.[^.]+$/, "") || "momento";
    return {
      photo: new File([photoBlob], `${baseName}.jpg`, { type: "image/jpeg" }),
      thumbnail: new File([thumbnailBlob], `${baseName}-miniatura.jpg`, { type: "image/jpeg" }),
    };
  } finally {
    decoded.release();
  }
}
