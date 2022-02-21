/* eslint-disable */

const UUID_KEY = '__DC_STAT_UUID';
const storage = window.localStorage || window.sessionStorage || {};
let deviceId;

/**
 * 获取设备唯一标记
 * @description 实现原理来自 uni-app，清空 Storage 会导致改变
 * @see https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
 */
export default function () {
  deviceId = deviceId || storage[UUID_KEY];
  if (!deviceId) {
    deviceId = String(Date.now()) + Math.floor(Math.random() * 1e7);
    try {
      storage[UUID_KEY] = deviceId;
    } catch (error) {}
  }
  return deviceId;
}
