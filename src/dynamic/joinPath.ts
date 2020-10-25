/**
 * 合并路径
 *
 * @param path1 路径1
 * @param path2 路径2
 */
export default function joinPath(path1: string, path2: string) {
  if (path1) {
    const joiner = !path1.endsWith('/') && !path2.startsWith('/') ? '/' : '';
    return `${path1}${joiner}${path2}`;
  }
  return path2;
}
