export function getImageDimension(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (e) => reject(e);
  });
}
