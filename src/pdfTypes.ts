export interface PdfAnnotationType {
  id: string;
  x: number;
  y: number;
  type: AnnotationType;
  creator: string;
  createTime: string;
  content: string;
}

/**
 * 添加批注的类型
 * normal 正常操作，默认不执行批注
 * text 文字批注
 * additional  附加批注
 */
export type AnnotationType = 'normal' | 'text' | 'additional';
