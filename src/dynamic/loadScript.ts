/**
 * 加载 js 脚本
 *
 * @param src js脚本源路径
 */
const loadScript = async (src: string): Promise<HTMLScriptElement> => {
  const id = `script_${encodeURIComponent(src)}`;
  let script = document.getElementById(id) as HTMLScriptElement;
  if (script) {
    return script as HTMLScriptElement;
  }

  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.id = id;
  document.head.appendChild(script);

  await new Promise((resolve, reject) => {
    script.addEventListener(
      'load',
      () => {
        resolve();
      },
      false,
    );
    script.addEventListener('loaderror', () => {
      reject();
    });
  });
  return script;
};

export default loadScript;
