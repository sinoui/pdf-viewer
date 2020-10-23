/**
 * 创建高亮的dom节点
 * @param param0
 * @param container
 * @param annotationId
 */
export function createHeightLight(
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
  node.classList.add('pdf-text-annotation');
  node.dataset.id = annotationId;
  node.tabIndex = 0;
  container.appendChild(node);
}

/**
 * 根据section获取对应的区域坐标数组
 */
export function getRectsBySelection(selection?: Selection) {
  if (!selection) {
    return [];
  }
  const { rangeCount } = selection;
  if (rangeCount === 0) {
    return [];
  }

  const countArr = new Array(rangeCount).fill(0);

  const rects = [] as DOMRect[];
  countArr.forEach((_, index) => {
    const clientRects = selection.getRangeAt(index).getClientRects();
    Array.from(clientRects).forEach((rect) => {
      if (rect.width !== 0) {
        rects.push(rect);
      }
    });
  });

  return rects;
}

/**
 * 处理光标选中的内容，如果没有选中信息，返回false，否则div添加完成之后返回true
 * @param container pdf的容器
 * @param annotationId 添加的批注的id
 */
export function genNodeByRects(
  rects: DOMRect[],
  container: HTMLDivElement,
  annotationId: string,
) {
  rects.forEach((rect) => createHeightLight(rect, container, annotationId));
}
