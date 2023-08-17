/**
 * checkImgType
 * @param {File} file
 */
export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

/**
 * isImgTypeByName
 * @param {string} name
 */
export function isImgTypeByName(name: string) {
  return /\.(jpe?g|png|gif)$/i.test(name);
}

/**
 * blobToFile
 * @param {Blob} blob
 * @param {string} fileName 文件名
 * @param {object} [fileOptions] 文件可选属性的选项对象
 * @returns
 */
export function blobToFile(blob: Blob, fileName: string, fileOptions: object = {}) {
  const options = { type: blob.type, ...fileOptions };
  return new File([blob], fileName, options);
}

/**
 * dataURLToFile
 * @param {string} dataURL
 * @param {string} fileName 文件名
 * @param {object} [fileOptions] 文件可选属性的选项对象
 */
export function dataURLToFile(dataURL: string, fileName: string, fileOptions: object = {}) {
  const blob = dataURLToBlob(dataURL);
  const options = { type: blob.type, ...fileOptions };
  return new File([blob], fileName, options);
}

/**
 * dataURLToBlob
 * @param {string} dataURL
 */
export function dataURLToBlob(dataURL: string) {
  const parts = dataURL.split(',') as any;
  const mime = parts[0].match(/:(.*?);/)[1];
  const b64Data = window.atob(parts[1]);

  const byteArray = new Uint8Array(b64Data.length);
  for (let i = 0; i < b64Data.length; i++) {
    byteArray[i] = b64Data.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mime });
}

/**
 * fileToDataURL
 * @param {Blob|File} blob file或者blob
 */
export function fileToDataURL(blob: Blob) {
  return blobToDataURL(blob);
}

/**
 * blobToDataURL
 * @param {Blob|File} blob file或者blob
 */
export function blobToDataURL(blob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

/**
 * getDataURLMineType
 * @param {string} dataURL
 */
export function getDataURLMineType(dataURL: string) {
  const matches = dataURL.match(/^data:(.*);base64,/);
  if (matches && matches.length >= 2) {
    return matches[1].split('/')[1];
  }

  return null;
}
