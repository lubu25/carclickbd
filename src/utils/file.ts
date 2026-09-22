import { UploadFile } from "antd";

// 64 to file
export const createFileObject = (
  url: string,
  name: string,
  uid: string = ""
): UploadFile => ({
  uid,
  name,
  status: "done",
  url,
});

export const getStoreAbleFile = async (
  file: UploadFile | null
): Promise<string | null> => {
  if (typeof window === "undefined" || !file) return null;
  if (!file) return null;
  return (
    file.url ||
    (file.originFileObj ? await getBase64(file.originFileObj) : null)
  );
};

// Helper function to convert file to base64
export const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export function base64ToBlob(
  base64: string,
  mimeType: string = "image/jpeg"
): Blob {
  const byteString = atob(base64.split(",")[1]); // Decode base64 data
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
}

export function base64ToFile(
  base64: string,
  fileName: string,
  mimeType: string = "image/jpeg"
): File {
  const blob = base64ToBlob(base64, mimeType);
  return new File([blob], fileName, { type: mimeType });
}
