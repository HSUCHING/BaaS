import React from 'react';
import { motion } from 'framer-motion';

interface RingData {
  name: string;
  current: number;
  target: number;
  color: string;
}

interface ActivityRingsProps {
  data: RingData[];
  size?: number;
  strokeWidth?: number;
}

export const ActivityRings: React.FC<ActivityRingsProps> = ({
  data,
  size = 300,
  strokeWidth = 20,
}) => {
  // 计算环的半径，从外到内
  const getRadius = (index: number) => {
    const maxRadius = (size / 2) - strokeWidth;
    const gap = 4; // 环之间的间隔
    return maxRadius - (index * (strokeWidth + gap));
  };

  // 计算完成百分比
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {data.map((ring, index) => {
          const radius = getRadius(index);
          const circumference = 2 * Math.PI * radius;
          const percentage = getPercentage(ring.current, ring.target);
          const offset = circumference - (percentage / 100) * circumference;

          return (
            <g key={ring.name}>
              {/* 背景环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`${ring.color}33`}
                strokeWidth={strokeWidth}
              />
              {/* 进度环 */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </g>
          );
        })}
      </svg>
      
      {/* 中心显示总体完成率 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-3xl font-bold">
          {Math.round(
            data.reduce((acc, ring) => 
              acc + getPercentage(ring.current, ring.target), 0) / data.length
          )}%
        </div>
        <div className="text-sm text-gray-400">完成率</div>
      </div>
    </div>
  );
};

// 使用示例数据
export const activityData: RingData[] = [
  {
    name: "参与方数量",
    current: 75,
    target: 100,
    color: "#ff375f"  // 红色
  },
  {
    name: "场景数量",
    current: 45,
    target: 50,
    color: "#30d158"  // 绿色
  },
  {
    name: "交易数量",
    current: 8000,
    target: 10000,
    color: "#0a84ff"  // 蓝色
  }
]; 