/**
 * blobToFile
 */
export function blobToFile(blob: BlobPart, name: string, options: Recordable): Promise<File> {
  return new Promise((resolve) => {
    const newFile = new File([blob], name, { ...options });
    resolve(newFile);
  });
}
