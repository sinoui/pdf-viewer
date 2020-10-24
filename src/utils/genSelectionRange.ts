/* eslint-disable no-plusplus */
/**
 * 创建高亮的dom节点
 * @param param0 需要操作的选中区域集合
 * @param container 要添加到的dom元素
 * @param annotationId 需要添加的批注id
 * @param rect 保存批注时的dom操作，用于回显的判断
 */
export function createHeightLight(
  { left, top, width, height }: DOMRect,
  container: Element,
  annotationId: string,
  rect?: DOMRect,
) {
  let rootLeft;
  let rootTop;
  if (rect) {
    rootLeft = rect.left;
    rootTop = rect.top;
  } else {
    const rectWithContainer = container.getBoundingClientRect();
    rootLeft = rectWithContainer.left ?? 0;
    rootTop = rectWithContainer.top ?? 0;
  }
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
 * 对比两个rect，检测rect1是否在rect2中
 * @param rect1
 * @param rect2
 */
function checkInRange(rect1: DOMRect, rect2: DOMRect) {
  const { left: left1, top: top1, right: right1, bottom: bottom1 } = rect1;
  const { left: left2, top: top2, right: right2, bottom: bottom2 } = rect2;

  if (
    left1 >= left2 &&
    top1 >= top2 &&
    right1 <= right2 &&
    bottom1 <= bottom2
  ) {
    return true;
  }
  return false;
}

/**
 * 计算选中区域过滤重叠的部分
 * @param rects
 */
function calcRects(rects: DOMRect[]) {
  // 过滤完全重叠的部分
  const ret = rects.reduce((pre: DOMRect[], cur: DOMRect) => {
    const idx = pre.findIndex((item) => checkInRange(item, cur));
    if (idx < 0) {
      return [...pre, cur];
    }
    return [...pre.slice(0, idx), cur, ...pre.slice(idx + 1)];
  }, []);
  return ret;
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

  // return rects;
  return calcRects(rects);
}

/**
 * 处理光标选中的内容，生成对应的高亮dom
 * @param rects 光标选中结点的所有位置集合
 * @param container pdf的容器
 * @param annotationId 添加的批注的id
 * @param rect 保存批注时的dom操作，用于回显的判断
 */
export function genNodeByRects(
  rects: DOMRect[],
  container: HTMLDivElement,
  annotationId: string,
  rect?: DOMRect,
) {
  rects.forEach((_rect) =>
    createHeightLight(_rect, container, annotationId, rect),
  );
}
