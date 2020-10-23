function createHeightLight(
  { left, top, width, height }: DOMRect,
  container: Element,
  annotationId: string,
) {
  const { left: rootLeft, top: rootTop } = container.getBoundingClientRect();
  const node = document.createElement('div');
  node.style.position = 'absolute';
  node.style.top = `${top - rootTop}px`;
  node.style.left = `${left - rootLeft}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  node.style.backgroundColor = 'yellow';
  node.style.opacity = '0.4';
  node.style.cursor = 'pointer';
  node.dataset.id = annotationId;

  container.appendChild(node);
}

/**
 * 处理光标选中的内容，如果没有选中信息，返回false，否则div添加完成之后返回true
 * @param container pdf的容器
 * @param annotationId 添加的批注的id
 */
export default function genSelectionRange(
  container: HTMLDivElement,
  annotationId: string,
) {
  const selection = window.getSelection();
  if (!container || !selection) {
    return false;
  }

  const { rangeCount } = selection;
  if (rangeCount === 0) {
    return false;
  }

  const countArr = new Array(rangeCount).fill(0);

  const sum = countArr
    .map((_, index) => {
      const clientRects = selection.getRangeAt(index).getClientRects();
      return clientRects.length;
    })
    .reduce((pre, cur) => pre + cur);

  if (sum === 0) {
    return false;
  }

  countArr.forEach((_, index) => {
    const clientRects = selection.getRangeAt(index).getClientRects();
    Array.from(clientRects).forEach((rect) =>
      createHeightLight(rect, container, annotationId),
    );
  });

  return true;
}
