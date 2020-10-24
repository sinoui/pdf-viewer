import React from 'react';

export interface Props {
  startPoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
}

export default function Line(props: Props) {
  const { startPoint, targetPoint } = props;
  const offsetX = startPoint.x + 26;
  const offsetY = startPoint.y + 13;
  const endX = targetPoint.x - offsetX;
  return (
    <svg
      style={{
        position: 'absolute',
        top: offsetY,
        left: offsetX,
        width: endX + 100,
      }}
    >
      <line
        x1="0"
        y1="0"
        x2={endX}
        y2="60"
        style={{ stroke: 'yellow', strokeWidth: 2 }}
      />
      <line
        x1="0"
        y1="0"
        x2={endX}
        y2="20"
        style={{ stroke: 'yellow', strokeWidth: 2 }}
      />
    </svg>
  );
}
