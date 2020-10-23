function createHeightLight(
  { left, top, width, height }: DOMRect,
  container: Element,
) {
  const { left: rootLeft, top: rootTop } = container.getBoundingClientRect();
  const node = document.createElement('div');
  const id = Math.floor(Math.random() * 9000 + 1000);
  node.style.position = 'absolute';
  node.style.top = `${top - rootTop}px`;
  node.style.left = `${left - rootLeft}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  node.style.backgroundColor = 'yellow';
  node.style.opacity = '0.4';
  node.style.cursor = 'pointer';

  container.appendChild(node);
}

/**
 * 处理光标选中的内容，如果没有选中信息，返回false，否则div添加完成之后返回true
 * @param container
 */
export default function genSelectionRange(container: HTMLDivElement) {
  const selection = window.getSelection();
  if (!container || !selection) {
    return false;
  }

  const { rangeCount } = selection;
  if (rangeCount === 0) {
    return false;
  }

  new Array(rangeCount).fill(0).forEach((_, index) => {
    const clientRects = selection.getRangeAt(index).getClientRects();
    Array.from(clientRects).forEach((rect) =>
      createHeightLight(rect, container),
    );
  });

  return true;
}
