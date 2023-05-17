const isClipboardApiSupported = navigator && 'clipboard' in navigator;

/**
 * 设置剪贴板内容
 */
export function setClipboardData(options: ClipboardOptions): Promise<void> {
  if (isClipboardApiSupported) {
    return navigator.clipboard.writeText(options.data);
  } else {
    legacyCopy(options.data);
    return Promise.resolve();
  }
}

/**
 * 获取剪贴板内容
 */
export function getClipboardData(): Promise<string> {
  if (isClipboardApiSupported) {
    return navigator.clipboard.readText();
  } else {
    const text = legacyRead();
    return Promise.resolve(text);
  }
}

function legacyCopy(data: string) {
  const pasteText = document.getElementById('#clipboard');
  pasteText && pasteText.remove();
  const textarea = document.createElement('textarea');
  textarea.value = data;
  textarea.id = '#clipboard';
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.zIndex = '-9999';
  document.body.appendChild(textarea);
  textarea.value = data;
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  document.execCommand('copy');
}

function legacyRead() {
  const pasteText = document.getElementById('#clipboard') as HTMLTextAreaElement | null;
  const data = pasteText ? pasteText.value : '';

  return data;
}

export interface ClipboardOptions {
  /**
   * 内容
   */
  data: string;
}
