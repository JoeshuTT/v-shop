/**
 * 拨打电话
 */
export function makePhoneCall(options: makePhoneCallOptions): Promise<void> {
  const { phoneNumber } = options;

  window.location.href = `tel:${phoneNumber}`;
  return Promise.resolve();
}

export interface makePhoneCallOptions {
  /**
   * 需要拨打的电话号码
   */
  phoneNumber: string;
}
