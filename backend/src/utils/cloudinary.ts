import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extract the Cloudinary public_id from a full Cloudinary URL.
 * Example URL: https://res.cloudinary.com/<cloud>/image/upload/v1234/omnis_properties/abc123.jpg
 * Returned public_id: omnis_properties/abc123
 */
export function extractPublicId(url: string): string | null {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;
    // Match everything after /upload/vXXXX/ or /upload/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Delete a single asset from Cloudinary by its URL.
 * Detects the resource_type (image vs video vs raw for PDFs).
 */
export async function deleteCloudinaryAsset(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  // Determine resource type from URL path
  let resourceType: "image" | "video" | "raw" = "image";
  if (url.includes("/video/upload/")) {
    resourceType = "video";
  } else if (
    url.includes("/raw/upload/") ||
    url.toLowerCase().endsWith(".pdf")
  ) {
    resourceType = "raw";
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`[Cloudinary] Deleted ${resourceType}: ${publicId}`);
  } catch (err: any) {
    // Log but don't crash – the DB record is more important
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, err.message);
  }
}

/**
 * Delete multiple Cloudinary assets in parallel.
 */
export async function deleteCloudinaryAssets(urls: string[]): Promise<void> {
  await Promise.all(
    urls.filter(Boolean).map((url) => deleteCloudinaryAsset(url)),
  );
}

export { cloudinary };
