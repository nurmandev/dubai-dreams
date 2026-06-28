import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cloudinaryUrl(
  url: string,
  opts: { width?: number; height?: number; quality?: string; format?: string } = {},
): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const { width, height, quality = "auto", format = "auto" } = opts;
  const parts = url.split("/upload/");
  let transformations = `f_${format},q_${quality}`;
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height},c_fill`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
