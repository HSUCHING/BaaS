import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataItem {
  month: string;
  transactions: number;  // 交易量
  activeUsers: number;   // 活跃用户数
}

const trendData: TrendDataItem[] = [
  { month: "1月", transactions: 3200, activeUsers: 2800 },
  { month: "2月", transactions: 4500, activeUsers: 3200 },
  { month: "3月", transactions: 3800, activeUsers: 3600 },
  { month: "4月", transactions: 5000, activeUsers: 4200 },
  { month: "5月", transactions: 4900, activeUsers: 4800 },
  { month: "6月", transactions: 6000, activeUsers: 5500 },
  { month: "7月", transactions: 5500, activeUsers: 6200 },
  { month: "8月", transactions: 6500, activeUsers: 7000 },
  { month: "9月", transactions: 5800, activeUsers: 7800 },
  { month: "10月", transactions: 7000, activeUsers: 8500 },
  { month: "11月", transactions: 6800, activeUsers: 9200 },
  { month: "12月", transactions: 7500, activeUsers: 10000 }
];

export const TrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={trendData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="#ffffff60"
          tick={{ fill: "#ffffff80", fontSize: 12 }}
          axisLine={{ stroke: "#ffffff20" }}
        />
        {/* 左侧Y轴 - 交易量 */}
        <YAxis
          yAxisId="left"
          stroke="#ffffff60"
          tick={{ fill: "#ffffff80", fontSize: 12 }}
          axisLine={{ stroke: "#ffffff20" }}
          label={{
            value: "交易量",
            angle: -90,
            position: "insideLeft",
            fill: "#ffffff80",
            fontSize: 12,
          }}
        />
        {/* 右侧Y轴 - 活跃用户数 */}
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#ffffff60"
          tick={{ fill: "#ffffff80", fontSize: 12 }}
          axisLine={{ stroke: "#ffffff20" }}
          label={{
            value: "活跃用户数",
            angle: 90,
            position: "insideRight",
            fill: "#ffffff80",
            fontSize: 12,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "transparent",
            border: "none",
          }}
          labelStyle={{ color: "#ffffff", marginBottom: "4px" }}
          itemStyle={{ color: "#ffffff80" }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: "12px" }}
        />
        {/* 交易量柱状图 */}
        <Bar
          yAxisId="left"
          dataKey="transactions"
          name="交易量"
          fill="#1890FF"
          radius={[4, 4, 0, 0]}
          barSize={40}
          opacity={0.5}
        />
        {/* 活跃用户数曲线 */}
        <Line
          yAxisId="right"
          dataKey="activeUsers"
          name="活跃用户数"
          stroke="#FFB72B"
          strokeWidth={2}
          dot={{ 
            fill: "#FFB72B",
            r: 4,
            strokeWidth: 0
          }}
          activeDot={{ 
            r: 6,
            fill: "#FFB72B",
            strokeWidth: 0
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}; 