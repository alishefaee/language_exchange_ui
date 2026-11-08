// src/utils/imageCompressor.ts

export interface CompressImageOptions {
  maxDimension?: number; // Default: 512px
  quality?: number;      // Default: 0.82
  outputType?: "image/webp" | "image/jpeg" | "image/png";
  maxSizeBytes?: number; // Default: 5MB per Swagger spec
}

const ALLOWED_INPUT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SWAGGER_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Center-crops an image to a 1:1 square, scales it down to maxDimension,
 * and compresses it into a lightweight WebP/JPEG File ready for multipart upload.
 */
export async function compressAvatarImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const {
    maxDimension = 512,
    quality = 0.82,
    outputType = "image/webp",
    maxSizeBytes = MAX_SWAGGER_BYTES,
  } = options;

  if (!ALLOWED_INPUT_TYPES.includes(file.type.toLowerCase())) {
    throw new Error("Only .jpg, .jpeg, .png, and .webp formats are supported.");
  }

  const bitmap = await createImageBitmap(file);

  try {
    // 1. Calculate 1:1 square center-crop coordinates
    const minSide = Math.min(bitmap.width, bitmap.height);
    const sx = Math.floor((bitmap.width - minSide) / 2);
    const sy = Math.floor((bitmap.height - minSide) / 2);

    // 2. Prevent upscaling smaller images
    const targetSize = Math.min(minSide, maxDimension);

    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to initialize 2D canvas context for image compression.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

    // 3. Encode to compressed Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (res) => (res ? resolve(res) : reject(new Error("Image compression failed."))),
        outputType,
        quality
      );
    });

    if (blob.size > maxSizeBytes) {
      throw new Error("Compressed image still exceeds the 5MB maximum size limit.");
    }

    // 4. Construct a File with the matching extension required by Swagger
    const ext =
      outputType === "image/webp" ? "webp" : outputType === "image/png" ? "png" : "jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "") || "avatar";

    return new File([blob], `${baseName}.${ext}`, {
      type: outputType,
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}