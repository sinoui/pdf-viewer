export interface PdfAnnotationType {
  id: string;
  x: number;
  y: number;
  type: AnnotationType;
  creator: string;
  createTime: string;
  content: string;
}

export type AnnotationType = 'normal' | 'text';
