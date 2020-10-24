import React, { useCallback, useEffect, useState } from 'react';
import './PageNumber.css';

interface PageNumberProps {
  /**
   * 当前页
   */
  currentPage: number;
  /**
   * 总页数
   */
  total: number;
  /**
   * 页数切换
   */
  onPageChange: (page: number) => void;
}

export default function PageNumber({
  currentPage,
  total,
  onPageChange,
}: PageNumberProps) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(`${currentPage}`);
  }, [currentPage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[0-9]/.test(val)) {
      setValue(val);
    } else {
      setValue('');
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (value) {
      onPageChange(parseInt(value, 10));
    }
  }, [value, onPageChange]);

  const handleKeUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        onPageChange(parseInt(value, 10));
      }
    },
    [value, onPageChange],
  );

  return (
    <div className="sinoui-pdf-page-number-container">
      <input
        className="sinoui-pdf-page-number-input"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyUp={handleKeUp}
      />
      <span className="sinoui-pdf-page-number-divide">/</span>
      <span className="sinoui-pdf-page-number-total">{total}</span>
    </div>
  );
}
