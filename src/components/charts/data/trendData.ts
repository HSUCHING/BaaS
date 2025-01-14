export interface TrendDataItem {
  month: string;
  transactions: number;  // 交易量
  activeUsers: number;   // 活跃用户数
}

export const trendData: TrendDataItem[] = [
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