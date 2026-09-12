/**
 * Cloudinary Image Upload & Processing Utility
 * 
 * Images are uploaded to Cloudinary for media storage.
 * Firestore stores ONLY metadata & text info (with the resulting Cloudinary image URL).
 */

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials missing: please define NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in frontend/.env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "childguard");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Cloudinary upload failed with HTTP status ${res.status}`);
  }

  const data = await res.json();
  return data.secure_url || data.url;
}

/**
 * Resizes and converts an image file into an optimized, compact base64 JPEG data URL.
 * Used as an instant local/offline fallback if Cloudinary credentials are not yet configured.
 */
export async function fileToDataUrl(file: File, maxWidth = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads to Cloudinary if configured.
 * If Cloudinary keys are not yet provided in .env.local, cleanly falls back
 * to high-resolution compressed Base64 so registration is never blocked.
 */
export async function uploadOrEncodePhoto(file: File, _storagePath?: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    try {
      console.log(`Uploading to Cloudinary cloud: ${cloudName}...`);
      const cloudinaryUrl = await uploadToCloudinary(file);
      console.log(`Cloudinary upload successful: ${cloudinaryUrl}`);
      return cloudinaryUrl;
    } catch (err) {
      console.warn("Cloudinary upload failed, using optimized base64 fallback:", err);
      return await fileToDataUrl(file);
    }
  }

  // If Cloudinary keys are not set, fall back to optimized Data URL
  return await fileToDataUrl(file);
}
