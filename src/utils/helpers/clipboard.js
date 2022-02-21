/* eslint-disable */

/**
 * 获取剪贴板内容
 * @description 实现原理来自 uni-app，
 * @see https://uniapp.dcloud.io/api/system/clipboard?id=getClipboardData
 */
export function getClipboardData() {
  const pasteText = document.getElementById('#clipboard');
  const data = pasteText ? pasteText.value : undefined;
  if (data) {
    return {
      data,
      errMsg: 'getClipboardData:ok',
    };
  } else {
    return {
      errMsg: 'getClipboardData:fail',
    };
  }
}

/**
 * 设置剪贴板内容
 * @description 实现原理来自 uni-app，
 * @param {*} param0
 * @see https://uniapp.dcloud.io/api/system/clipboard?id=setclipboarddata
 */
export async function setClipboardData({ data }) {
  const pasteText = document.getElementById('#clipboard');
  pasteText && pasteText.remove();
  const textarea = document.createElement('textarea');
  textarea.id = '#clipboard';
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.zIndex = '-9999';
  document.body.appendChild(textarea);
  textarea.value = data;
  textarea.focus();
  textarea.select();
  const result = document.execCommand('Copy', false, null);
  textarea.blur();
  if (result) {
    return {
      errMsg: 'setClipboardData:ok',
    };
  } else {
    return {
      errMsg: 'setClipboardData:fail',
    };
  }
}
