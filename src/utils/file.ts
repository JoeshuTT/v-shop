/**
 * blobToFile
 */
export function blobToFile(blob: BlobPart, name: string, options: Recordable): Promise<File> {
  return new Promise((resolve) => {
    const newFile = new File([blob], name, { ...options });
    resolve(newFile);
  });
}

/**
 * dataURLtoBlob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
