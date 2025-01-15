import React, { useEffect, useState } from 'react';
import '@/components/ui/style.css';

export const Loading: React.FC = () => {
  const [browserType, setBrowserType] = useState<'chrome' | 'other'>('chrome');

  useEffect(() => {
    // 立即执行浏览器检测
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    setBrowserType(isChrome ? 'chrome' : 'other');
  }, []);

  return (
    <div className="loading-container">
      {/* Chrome */}
      <div className={`infinityChrome ${browserType === 'other' ? 'hidden' : ''}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Safari and others */}
      <div className={`infinity ${browserType === 'chrome' ? 'hidden' : ''}`}>
        <div>
          <span></span>
        </div>
        <div>
          <span></span>
        </div>
        <div>
          <span></span>
        </div>
      </div>

      {/* SVG Filter */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Loading; 