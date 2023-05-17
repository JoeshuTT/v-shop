/**
 * 生成昵称
 */
export function fakeNickName(options: Recordable) {
  const { type } = options;

  if (type === 'mobile') {
    return `用户${options.mobile.slice(-4)}`;
  }

  return `用户${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
}
