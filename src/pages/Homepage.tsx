"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  ChainIcon,
  ManageIcon,
  UseIcon,
  OperateIcon,
  ChartLineIcon,
  BlockIcon,
  TPSIcon,
  NodeIcon,
  ContractIcon,
  AlertIcon,
  ResourceIcon,
  MarketIcon,
  ToolIcon,
  MessageIcon,
  WeatherIcon,
  DocumentIcon,
  SearchIcon,
  AppIcon,
} from "@/components/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  ComposedChart,
  Cell,
} from "recharts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { ActivityRings, activityData } from "@/components/charts/ActivityRings";
import { Sunburst } from "@/components/charts/Sunburst";
import { OrganizationChart } from "@/components/charts/OrganizationChart";
import { SankeyChart } from '../components/charts/SankeyChart';
import { sankeyData } from '../components/charts/data/sankeyData';
import { TrendChart } from '../components/charts/TrendChart';
import Stepper from "@/components/Stepper";
import Modal from "@/components/Modal";
import ContractSelector from "@/components/BusinessSteps/ContractSelector";
import ChainSelector from "@/components/BusinessSteps/ChainSelector";
import OrganizationSelector from "@/components/BusinessSteps/OrganizationSelector";
import SceneCreator from "@/components/BusinessSteps/SceneCreator";
import APICreator from "@/components/BusinessSteps/APICreator";
import SetupComplete from "@/components/BusinessSteps/Complete";

// 模拟的交易量数据
const transactionData = [
  {
    date: "2024-01",
    transactions: 3500,
    activeUsers: 1200,
    type: "采购",
  },
  {
    date: "2024-02",
    transactions: 4200,
    activeUsers: 1500,
    type: "销售",
  },
  {
    date: "2024-03",
    transactions: 3800,
    activeUsers: 1800,
    type: "物流",
  },
  {
    date: "2024-04",
    transactions: 5000,
    activeUsers: 2200,
    type: "金融",
  },
  {
    date: "2024-05",
    transactions: 4800,
    activeUsers: 2500,
    type: "其他",
  },
];

// 模拟的交易类型占比数据
const transactionTypeData = [
  { name: "采购", value: 35, fill: "#0ea5e9" },
  { name: "销售", value: 25, fill: "#22c55e" },
  { name: "物流", value: 20, fill: "#eab308" },
  { name: "金融", value: 15, fill: "#ec4899" },
  { name: "其他", value: 5, fill: "#8b5cf6" },
];

// 模拟的组织参与度数据
const organizationData = [
  { month: "1月", count: 12 },
  { month: "2月", count: 15 },
  { month: "3月", count: 18 },
  { month: "4月", count: 22 },
  { month: "5月", count: 25 },
  { month: "6月", count: 28 },
];

// 添加性能指标数据
const performanceMetrics = [
  {
    title: "TPS",
    value: 2800,
    unit: "tx/s",
    change: "+12.5%",
    isPositive: true,
    color: "#3B82F6",
  },
  {
    title: "区块生成时间",
    value: 2.5,
    unit: "s",
    change: "-0.3s",
    isPositive: true,
    color: "#8B5CF6",
  },
  {
    title: "确认延迟",
    value: 3.8,
    unit: "s",
    change: "-0.5s",
    isPositive: true,
    color: "#10B981",
  },
  {
    title: "交易成功率",
    value: 99.8,
    unit: "%",
    change: "+0.2%",
    isPositive: true,
    color: "#F59E0B",
  },
];

// 添加安全性指标数据
const securityMetrics = [
  {
    title: "双花攻击率",
    value: 0.001,
    unit: "%",
    change: "-0.002%",
    isPositive: true,
    color: "#3B82F6",
    description: "链交易安全性",
  },
  {
    title: "节点运行时间",
    value: 99.99,
    unit: "%",
    change: "+0.01%",
    isPositive: true,
    color: "#8B5CF6",
    description: "链稳定性",
  },
  {
    title: "错误率",
    value: 0.05,
    unit: "%",
    change: "-0.02%",
    isPositive: true,
    color: "#10B981",
    description: "交易/区块验证",
  },
  {
    title: "共识协议稳定性",
    value: 99.95,
    unit: "%",
    change: "+0.03%",
    isPositive: true,
    color: "#F59E0B",
    description: "共识达成率",
  },
];

// 添加预置色变量
const colors = {
  purple: "rgb(123, 31, 162)",
  violet: "rgb(103, 58, 183)",
  pink: "rgb(244, 143, 177)",
  black: "rgb(33, 33, 33)",
  dred: "rgb(80, 50, 60)",
  red: "rgb(102, 0, 0)",
};

// 更新卡片样式
const cardStyles = {
  base: `
    backdrop-blur-xl 
    bg-[#1C1C1E]/80 
    shadow-[0_8px_16px_rgba(0,0,0,0.5)] 
    rounded-xl 
    transition-all 
    duration-300
  `,
  header: "px-6 py-4",
  body: "px-6 pb-6",
  // 新的入口卡片渐变样式
  actionCard: `
    bg-[#1C1C1E]
    shadow-[0_8px_16px_rgba(0,0,0,0.5)]
    transition-all
    duration-300
    group
    hover:-translate-y-0.5
    hover:scale-[1.01]
    cursor-pointer
  `,
  // 图表卡片样式
  chartCard: `
    bg-[#1C1C1E]/90 
    shadow-[0_8px_16px_rgba(0,0,0,0.5)] 
    hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)] 
    transition-all 
    duration-300
  `,
};

// 入口卡片数据
const actionCards = [
  {
    title: "建链",
    description: "快速部署新的区块链网络",
    icon: ChainIcon,
    hoverColor:
      "hover:bg-gradient-to-br hover:from-[#2D2B8F] hover:via-[#312E9F] hover:to-[#2B4EAF]",
  },
  {
    title: "管链",
    description: "管理现有区块链网络",
    icon: ManageIcon,
    hoverColor:
      "hover:bg-gradient-to-br hover:from-[#2F2D9F] hover:via-[#2D3AAF] hover:to-[#2B52AF]",
  },
  {
    title: "用链",
    description: "使用区块链网络服务",
    icon: UseIcon,
    hoverColor:
      "hover:bg-gradient-to-br hover:from-[#312D9F] hover:via-[#2D2B8F] hover:to-[#5C4D8F]",
  },
  {
    title: "运链",
    description: "运维区块链网络",
    icon: OperateIcon,
    hoverColor:
      "hover:bg-gradient-to-br hover:from-[#2D2B8F] hover:via-[#2B52AF] hover:to-[#4D4D8F]",
  },
];

// 添加一个仪表盘组件
const GaugeChart = ({ value, title, rank, percentile }) => {
  const percentage = value;
  const radius = 80;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const arcAngle = (5 / 6) * 2 * Math.PI;
  const circumference = normalizedRadius * arcAngle;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const rotateAngle = 95;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{ transform: `rotate(${rotateAngle}deg)` }}
        >
          {/* 外层光晕效果 */}
          <circle
            stroke="rgba(123, 31, 162, 0.1)"
            fill="transparent"
            strokeWidth={strokeWidth + 4}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="filter blur-[8px]"
          />

          {/* 背景圆弧 */}
          <circle
            stroke="rgba(44, 44, 46, 0.8)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference} ${
              2 * Math.PI * normalizedRadius
            }`}
            strokeLinecap="round"
            className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]"
          />

          {/* 进度圆弧 - 底层发光效果 */}
          <circle
            stroke="url(#gradientBlur)"
            fill="transparent"
            strokeWidth={strokeWidth + 4}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference} ${
              2 * Math.PI * normalizedRadius
            }`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="filter blur-[4px]"
          />

          {/* 进度圆弧 - 主要显示 */}
          <circle
            stroke="url(#animatedGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference} ${
              2 * Math.PI * normalizedRadius
            }`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(123,31,162,0.4)]"
          />

          <defs>
            {/* 静态模糊渐变保持不变 */}
            <linearGradient id="gradientBlur" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(123,31,162,0.4)" />
              <stop offset="50%" stopColor="rgba(103,58,183,0.4)" />
              <stop offset="100%" stopColor="rgba(244,143,177,0.4)" />
            </linearGradient>

            {/* 动画渐变 - 修改为旋转动画 */}
            <linearGradient
              id="animatedGradient"
              gradientUnits="userSpaceOnUse"
              gradientTransform="rotate(0)"
            >
              <stop offset="0%" stopColor="rgb(123,31,162)" />
              <stop offset="50%" stopColor="rgb(103,58,183)" />
              <stop offset="100%" stopColor="rgb(244,143,177)" />

              {/* 添加渐变旋转动画 */}
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                values="0 ${radius} ${radius}; 360 ${radius} ${radius}"
                dur="8s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* 添加动态遮罩以增强流动感 */}
            <mask id="gradientMask">
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                stroke="url(#animatedGradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${
                  2 * Math.PI * normalizedRadius
                }`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values={`${strokeDashoffset};${
                    strokeDashoffset - 10
                  };${strokeDashoffset}`}
                  dur="4s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </circle>
            </mask>
          </defs>
        </svg>

        {/* 中心内容 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="relative">
            <div className="text-3xl font-bold bg-gradient-to-r from-[rgb(123,31,162)] via-[rgb(103,58,183)] to-[rgb(244,143,177)] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(123,31,162,0.3)]">
              {value.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">{title}</div>
          </div>
        </div>
      </div>

      {/* 底部指标 */}
      <div className="flex gap-8 mt-4">
        <div className="text-center">
          <div className="text-xs text-gray-400">Rank</div>
          <div className="text-lg font-medium bg-gradient-to-r from-[rgb(123,31,162)] to-[rgb(103,58,183)] bg-clip-text text-transparent">
            #{rank}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Percentile</div>
          <div className="text-lg font-medium bg-gradient-to-r from-[rgb(103,58,183)] to-[rgb(244,143,177)] bg-clip-text text-transparent">
            {percentile}
          </div>
        </div>
      </div>
    </div>
  );
};

// 更新指标项组件样式，使其更小巧
const MetricItem = ({ title, value, unit, change, isPositive, color }) => (
  <div className="flex flex-col bg-[#1C1C1E] rounded-lg hover:bg-[#2C2C2E] transition-all duration-300 w-[140px]">
    <div className="text-sm text-gray-400 mb-1">{title}</div>
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      <div
        className={`text-sm font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </div>
    </div>
  </div>
);

// 更新指标项组件样式
const SecurityMetricItem = ({
  title,
  value,
  unit,
  change,
  isPositive,
  description,
}) => (
  <div className="flex flex-col bg-[#1C1C1E] rounded-lg p-4 hover:bg-[#2C2C2E] transition-all duration-300">
    <div className="flex justify-between items-start mb-2">
      <div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div
        className={`text-sm font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-semibold text-white">{value}</span>
      <span className="text-sm text-gray-400">{unit}</span>
    </div>
  </div>
);

// 添加一个新的组件用于文字动画
const AnimatedTitle = ({ text }) => {
  const characters = text.split("");
  const animationSteps = 20;
  const animationDuration = 50;
  const delayBetweenLetters = 0.2;
  const totalDelayTime = characters.length * delayBetweenLetters;

  return (
    <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase font-light">
      {characters.map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animationName: "anim-text-flow-keys",
            animationDuration: `${animationDuration}s`,
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationFillMode: "forwards",
            animationDelay: `${index * delayBetweenLetters - totalDelayTime}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
};

// 添加关键帧动画到全局样式
const globalStyles = `
  @keyframes anim-text-flow-keys {
    ${Array.from({ length: 21 }, (_, i) => {
      const percentage = i * 5;
      const hue = Math.floor(Math.random() * 365);
      return `${percentage}% { color: hsla(${hue}, 60%, 60%, 1); }`;
    }).join("\n")}
  }

  // 添加天气图标相关样式
  .icon {
    width: 100%;
    height: 100%;
  }

  .longRay {
    stroke: #ffdd1a;
    stroke-width: 3;
    stroke-dasharray: 10;
    stroke-dashoffset: 10;
    animation: longRayAnimation 4s linear infinite;
  }

  .shortRay {
    stroke: #ffdd1a;
    stroke-width: 1.5;
    stroke-dasharray: 3;
    stroke-dashoffset: 1;
    animation: shortRayAnimation 3s linear infinite;
  }

  .small-cloud {
    animation: float 8s linear infinite;
  }

  .reverse-small-cloud {
    animation: reverse-float 6s linear infinite;
  }

  @keyframes longRayAnimation {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes shortRayAnimation {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes float {
    0% { transform: translate(0px, 15px); opacity: 0.75; }
    25% { transform: translate(15px, 0px); opacity: 1; }
    50% { transform: translate(30px, 0px); opacity: 1; }
    75% { transform: translate(25px, 0px); opacity: 1; }
    100% { transform: translate(0px, 15px); opacity: 0.75; }
  }

  @keyframes reverse-float {
    0% { transform: translate(0px, -15px); opacity: 0.75; }
    25% { transform: translate(-15px, 0px); opacity: 1; }
    50% { transform: translate(-30px, 0px); opacity: 1; }
    75% { transform: translate(-25px, 0px); opacity: 1; }
    100% { transform: translate(0px, -15px); opacity: 0.75; }
  }
`;


// 首先添加天气SVG定义
const WeatherSVGDefs = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
    <defs>
      <radialGradient
        id="gradYellow"
        cx="50%"
        cy="50%"
        r="80%"
        fx="90%"
        fy="80%"
      >
        <stop offset="0%" style={{ stopColor: "yellow", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "orange", stopOpacity: 1 }} />
      </radialGradient>
      <radialGradient
        id="gradDarkGray"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" style={{ stopColor: "white", stopOpacity: 1 }} />
        <stop offset="70%" style={{ stopColor: "gray", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "dimgray", stopOpacity: 1 }} />
      </radialGradient>
      {/* ... 其他渐变定义 ... */}
    </defs>
    <symbol id="sun">
      <circle cx="50" cy="50" r="20" fill="url(#gradYellow)" />
      <line x1="50" y1="27" x2="50" y2="2" className="longRay" />
      {/* ... 其他太阳射线 ... */}
    </symbol>
    <symbol id="moon">
      <path
        d="M60,20 A30,30 0 1,0 90,65 22,22 0 1,1 60,20z"
        fill="url(#gradYellow)"
      />
    </symbol>
    {/* ... 添加其他天气符号定义 ... */}
  </svg>
);

// 修改日期时间组件
const DateTime = () => {
  // 使用 useEffect 来避免 SSR 不匹配问题
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 在客户端渲染之前返回一个占位符
  if (!mounted) {
    return <div className="flex items-center gap-6">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-6">
      <div>
        <div className="flex items-center gap-2 text-lg font-medium text-white">
          <span>{now.toLocaleTimeString("zh-CN", { hour12: false })}</span>
          <span className="text-gray-500">|</span>
          <span>
            {now.toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>
            第
            {Math.ceil(
              (now.getDate() +
                new Date(now.getFullYear(), now.getMonth(), 1).getDay()) /
                7
            )}
            周
          </span>
          <span className="text-gray-500">|</span>
          <span>{now.toLocaleDateString("zh-CN", { weekday: "long" })}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">癸卯年三月初六</span>
        </div>
      </div>
      <div className="border-l border-gray-700 pl-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <WeatherIcon type="Sunny" />
          </div>
          <div>
            <div className="text-lg text-white">23°C</div>
            <div className="text-xs text-gray-400">晴朗 / 优</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 定义待办类型枚举
const TodoType = {
  BUSINESS: { label: "业务类", color: "primary" },
  MAINTENANCE: { label: "系统维护", color: "success" },
  SECURITY: { label: "安全监控", color: "warning" },
  USER_OP: { label: "用户操作", color: "secondary" },
} as const;

// 定义优先级枚举
const Priority = {
  HIGH: { label: "高", color: "danger" },
  MEDIUM: { label: "中", color: "warning" },
  LOW: { label: "低", color: "success" },
} as const;

// 定义状态枚举
const Status = {
  PENDING: { label: "待处理", color: "warning" },
  IN_PROGRESS: { label: "进行中", color: "primary" },
  COMPLETED: { label: "已完成", color: "success" },
} as const;

// 模拟用户数据
const users = {
  user1: { name: "张俊平", avatar: "/img/user1.png" },
  user2: { name: "李思楠", avatar: "/img/user2.png" },
  user3: { name: "何咏欣", avatar: "/img/user3.png" },
  user4: { name: "古里奇", avatar: "/img/user4.png" },
} as const;

// 模拟待办数据
const todoList = [
  {
    id: "TD001",
    type: TodoType.BUSINESS,
    title: "新增节点审批",
    priority: Priority.HIGH,
    status: Status.PENDING,
    createdAt: "2024-03-18 09:00",
    dueTime: "2024-03-18 18:00",
    assignee: "user1",
  },
  {
    id: "TD002",
    type: TodoType.MAINTENANCE,
    title: "系统性能优化",
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    createdAt: "2024-03-18 10:30",
    dueTime: "2024-03-19 17:00",
    assignee: "user2",
  },
  {
    id: "TD003",
    type: TodoType.SECURITY,
    title: "异常交易排查",
    priority: Priority.HIGH,
    status: Status.PENDING,
    createdAt: "2024-03-18 11:00",
    dueTime: "2024-03-18 14:00",
    assignee: "user3",
  },
  {
    id: "TD004",
    type: TodoType.USER_OP,
    title: "用户权限变更",
    priority: Priority.LOW,
    status: Status.PENDING,
    createdAt: "2024-03-18 13:00",
    dueTime: "2024-03-20 18:00",
    assignee: "user4",
  },
  {
    id: "TD005",
    type: TodoType.MAINTENANCE,
    title: "数据备份确认",
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    createdAt: "2024-03-18 14:30",
    dueTime: "2024-03-19 10:00",
    assignee: "user1",
  },
];

// 待办事项组件
const TodoBoard = () => {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-white">待办事项</h3>
          <Chip size="sm" color="primary" variant="flat">
            5
          </Chip>
        </div>
        <div className="flex gap-2">
          <Button size="sm" color="primary" variant="flat" className="text-xs">
            添加待办
          </Button>
          <Button size="sm" variant="light" className="text-xs">
            查看全部
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-4 pb-4">
        <div className="space-y-2">
          {todoList.slice(0, 6).map((todo) => (
            <div
              key={todo.id}
              className="relative flex items-center gap-3 p-2 rounded-lg bg-[#2C2C2E] hover:bg-[#3C3C3E] transition-all duration-300"
            >
              {/* Checkbox - 垂直居中 */}
              <Checkbox
                size="sm"
                aria-label={`标记待办事项：${todo.title}`}
                classNames={{
                  wrapper: "before:border-gray-500",
                }}
              />

              {/* 主要内容区域 */}
              <div className="flex-1 min-w-0 pl-4">
                {/* 状态标识 - 背景色跟随状态 */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`
                    flex items-center gap-2 px-2 py-1 rounded-md
                    ${
                      todo.status === Status.PENDING
                        ? "bg-yellow-500/10"
                        : todo.status === Status.IN_PROGRESS
                        ? "bg-blue-500/10"
                        : "bg-green-500/10"
                    }
                  `}
                  >
                    <div
                      className={`
                      w-2 h-2 rounded-full
                      ${
                        todo.status === Status.PENDING
                          ? "bg-yellow-500"
                          : todo.status === Status.IN_PROGRESS
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }
                    `}
                    />
                    <span
                      className={`
                      text-xs
                      ${
                        todo.status === Status.PENDING
                          ? "text-yellow-500"
                          : todo.status === Status.IN_PROGRESS
                          ? "text-blue-500"
                          : "text-green-500"
                      }
                    `}
                    >
                      {todo.status.label}
                    </span>
                  </div>
                </div>

                {/* 标题和类型 */}
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    color={todo.type.color}
                    variant="flat"
                    className="text-xs"
                  >
                    {todo.type.label}
                  </Chip>
                  <span className="text-sm text-white truncate">
                    {todo.title}
                  </span>
                </div>

                {/* 截止时间 */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                  <span>
                    截止:{" "}
                    {new Date(todo.dueTime).toLocaleString("zh-CN", {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* 右侧 - 头像和优先级垂直居中对齐 */}
              <div className="flex flex-col justify-center items-center gap-2 h-full">
                {/* 头像 */}
                <div className="relative group">
                  <Image
                    src={users[todo.assignee].avatar}
                    alt={users[todo.assignee].name}
                    width={24}
                    height={24}
                    className="rounded-full border border-gray-700 aspect-square object-cover"
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                    unoptimized
                    priority
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {users[todo.assignee].name}
                  </div>
                </div>

                {/* 优先级 */}
                <Chip
                  size="sm"
                  color={todo.priority.color}
                  variant="dot"
                  className="text-xs"
                >
                  {todo.priority.label}
                </Chip>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

// 定义快捷入口数据
const quickLinks = [
  {
    title: "合约管理",
    description: "智能合约的部署与管理",
    icon: DocumentTextIcon,
    href: "/contract",
  },
  {
    title: "区块链浏览器",
    description: "链上数据查询与分析",
    icon: MagnifyingGlassIcon,
    href: "/explorer",
  },
  {
    title: "区块链应用",
    description: "已部署的区块链应用",
    icon: Square3Stack3DIcon,
    href: "/applications",
  },
  {
    title: "开发工具",
    description: "智能合约开发套件",
    icon: WrenchScrewdriverIcon,
    href: "/tools",
  },
];

// 简化场景类型数据
const sceneTypeData = [
  {
    name: "智慧政务",
    value: 30,
    color: "#0ea5e9",
    description: "政务服务、行政审批、公共服务",
  },
  {
    name: "城市管理",
    value: 25,
    color: "#22c55e",
    description: "市政设施、环境监测、应急管理",
  },
  {
    name: "民生服务",
    value: 20,
    color: "#eab308",
    description: "教育医疗、社会保障、公共出行",
  },
  {
    name: "城市规划",
    value: 15,
    color: "#ec4899",
    description: "空间规划、建设管理、数字孪生",
  },
  {
    name: "商业服务",
    value: 10,
    color: "#8b5cf6",
    description: "供应链金融、商业保理、企业服务",
  },
];

// 确保 setupSteps 的类型定义正确
interface Step {
  id: number;
  title: string;
  subtitle: string;
  status: 'complete' | 'current' | 'pending';
}

// 添加 Stepper 配置
const setupSteps = [
  {
    id: 1,
    title: "创建场景",
    subtitle: "请描述我你的业务场景",
    status: "complete",
  },
  {
    id: 2,
    title: "创建/选择子链",
    subtitle: "创建场景前先创建子链",
    status: "complete",
  },
  {
    id: 3,
    title: "创建/选择组织",
    subtitle: "选择这个场景的参与方",
    status: "complete",
  },
  {
    id: 4,
    title: "创建/选择智能合约",
    subtitle: "合约定义了场景业务逻辑和数据",
    status: "current",
  },
  {
    id: 5,
    title: "创建服务接口",
    subtitle: "这里定义了场景对外的API接口",
    status: "pending",
  },
  {
    id: 6,
    title: "🎉 恭喜完成配置",
    subtitle: "现在你可以搭建你的区块链应用了!",
    status: "pending",
  },
];

export default function Homepage() {
  const [timeRange, setTimeRange] = useState("month");
  const router = useRouter();
  // 添加 Modal 控制状态
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);


  const handleStepChange = (step: number) => {
    // 确保步骤在有效范围内
    if (step >= 1 && step <= setupSteps.length) {
      setCurrentStep(step);
    }
  };
  
  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <SceneCreator />;
      case 2:
        return <ChainSelector />;
      case 3:
        return <OrganizationSelector />;
      case 4:
        return <ContractSelector />;
      case 5:
        return <APICreator />;
      case 6:
        return <SetupComplete />;
      default:
        return null;
    }
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* 添加全局样式 */}
      <style jsx global>
        {globalStyles}
      </style>

      {/* 欢迎语 */}
      <div className="flex justify-between items-center mb-8">
        <AnimatedTitle text="城市区块链 BaaS管理平台" />
        <DateTime />
        <Chip
          color="primary"
          variant="shadow"
          classNames={{
            base: "bg-[#2C2C2E] shadow-lg",
            content: "text-white font-medium",
          }}
        >
          v 1.0
        </Chip>
      </div>

      {/* 主要内容区域 - 改为16列布局 */}
      <div className="grid grid-cols-16 gap-6">
        {/* 左侧区域 - 占12列 */}
        <div className="col-span-12 space-y-6">
          {/* 四个操作卡片 */}
          <div className="grid grid-cols-4 gap-4">
            {actionCards.map((card, index) => (
              <Card
                key={card.title}
                isPressable
                // 为建链卡片添加点击事件
                onPress={() => {
                  if (card.title === "建链") {
                    setIsSetupModalOpen(true);
                  }
                }}
                className={`${card.hoverColor} ${cardStyles.actionCard}`}
              >
                <CardBody className="flex flex-col justify-center items-center p-4">
                  <div className="p-3 rounded-xl bg-[#2C2C2E] group-hover:bg-[#3D3D6F] transition-all duration-300 mb-3">
                    <card.icon className="w-6 h-6 text-gray-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-base font-medium text-white text-center mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-400 text-center">
                    {card.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 交易量趋势 */}
          <Card className={cardStyles.chartCard}>
            <CardHeader className="flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-medium text-white">趋势分析</h3>
              <div className="flex gap-2">
                {["day", "month", "quarter", "year"].map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    className={`
                      ${
                        timeRange === range
                          ? "bg-[#3C3C3E] text-white"
                          : "bg-[#2C2C2E] hover:bg-[#3C3C3E] text-gray-300"
                      } transition-all duration-300
                    `}
                    onPress={() => setTimeRange(range)}
                  >
                    {range === "day"
                      ? "日"
                      : range === "month"
                      ? "月"
                      : range === "quarter"
                      ? "季"
                      : "年"}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="h-[400px]">
                <TrendChart />
              </div>
            </CardBody>
          </Card>
          {/* 活动环和其他图表的容器 - 使用6列布局 */}
          <div className="grid grid-cols-12 gap-6">
            {/* 任务完成情况 - 严格占4列 */}
            <Card className={`${cardStyles.chartCard} col-span-6`}>
              <CardHeader className="px-6 py-4">
                <h3 className="text-lg font-medium text-white">任务完成情况</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="h-[240px] flex items-center justify-center">
                  <ActivityRings
                    data={activityData}
                    size={240}
                    strokeWidth={14}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {activityData.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center p-2.5 rounded-lg bg-[#1C1C1E]/50 backdrop-blur-sm hover:bg-[#1C1C1E] transition-all duration-300"
                    >
                      <div className="text-xs text-gray-400 mb-1 whitespace-nowrap">
                        {item.name}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-lg font-semibold"
                          style={{
                            color: item.color,
                            textShadow: `0 0 10px ${item.color}40`,
                          }}
                        >
                          {item.current}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {item.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card className={`${cardStyles.chartCard} col-span-6`}>
              <CardHeader className="px-6 py-4">
                <h3 className="text-lg font-medium text-white">城市治理分类</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="h-[400px] flex items-center justify-center">
                  <Sunburst width={360} height={360} />
                </div>
              </CardBody>
            </Card>
            <Card className={`${cardStyles.chartCard} col-span-12`}>
              <CardHeader className="px-6 py-4">
                <h3 className="text-lg font-medium text-white">组织参与度</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="h-[448px]">
                  <OrganizationChart />
                </div>
              </CardBody>
            </Card>
            <Card className={`${cardStyles.chartCard} col-span-12`}>
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-medium text-white">数据流向分析</h3>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="h-[800px]">
                <SankeyChart data={sankeyData} />
              </div>
            </CardBody>
          </Card>
          </div>
        </div>

        {/* 右侧区域 - 占4列 */}
        <div className="col-span-4 space-y-6">
          {/* 待办事项 */}
          <TodoBoard />

          {/* 快捷入口 */}
          <Card className={cardStyles.chartCard}>
            <CardHeader className="px-4 py-3">
              <h3 className="text-base font-medium text-white">快捷入口</h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Card
                      key={link.title}
                      isPressable
                      className="bg-[#2C2C2E] hover:bg-[#3C3C3E] transition-all duration-300"
                      onPress={() => router.push(link.href)}
                    >
                      <CardBody className="flex flex-col items-center p-4">
                        <div className="p-2 rounded-xl bg-[#3D3D3F] mb-2">
                          <Icon className="w-5 h-5 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-medium text-white mb-0.5">
                          {link.title}
                        </h3>
                        <p className="text-xs text-gray-400 text-center">
                          {link.description}
                        </p>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </CardBody>
          </Card>
          <Card className={`${cardStyles.chartCard} col-span-4`}>
            <CardHeader className="px-4 py-3">
              <h3 className="text-lg font-medium text-white">性能指标</h3>
            </CardHeader>
            <CardBody className="p-2">
              <div className="relative w-full flex justify-center">
                {/* 调整四个指标块的位置，缩小与中心的间距 */}
                <div className="absolute top-6 left-6">
                  <MetricItem {...performanceMetrics[0]} />
                </div>
                <div className="absolute top-6 right-4">
                  <MetricItem {...performanceMetrics[1]} />
                </div>
                <div className="absolute bottom-6 left-6">
                  <MetricItem {...performanceMetrics[2]} />
                </div>
                <div className="absolute bottom-6 right-4">
                  <MetricItem {...performanceMetrics[3]} />
                </div>

                {/* 中央的综合评分图表 */}
                <div className="mt-16 mb-16">
                  {" "}
                  {/* 减小上下边距 */}
                  <GaugeChart
                    value={70.21}
                    title="综合性能评分"
                    rank={95}
                    percentile="Top 20%"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          {/* 系统资源状态 */}
          <Card className={cardStyles.chartCard}>
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-medium text-white">系统资源状态</h3>
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-4">
              {/* CPU使用率 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">CPU使用率</span>
                    <span className="text-xs text-gray-500 ml-2">
                      计算资源消耗
                    </span>
                  </div>
                  <span className="text-white">45%</span>
                </div>
                <Progress
                  value={45}
                  classNames={{
                    base: "h-1.5",
                    indicator:
                      "bg-[linear-gradient(45deg,rgb(123,31,162),rgb(103,58,183),rgb(244,143,177))] shadow-[0_0_6px_rgba(123,31,162,0.6)]",
                    track: "bg-[#2C2C2E]",
                  }}
                  radius="full"
                />
              </div>

              {/* 内存使用率 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">内存使用率</span>
                    <span className="text-xs text-gray-500 ml-2">
                      运行内存占用
                    </span>
                  </div>
                  <span className="text-white">68%</span>
                </div>
                <Progress
                  value={68}
                  classNames={{
                    base: "h-1.5",
                    indicator:
                      "bg-[linear-gradient(45deg,rgb(123,31,162),rgb(103,58,183),rgb(244,143,177))] shadow-[0_0_6px_rgba(123,31,162,0.6)]",
                    track: "bg-[#2C2C2E]",
                  }}
                  radius="full"
                />
              </div>

              {/* 存储使用量 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">存储使用量</span>
                    <span className="text-xs text-gray-500 ml-2">
                      链数据存储空间
                    </span>
                  </div>
                  <span className="text-white">32%</span>
                </div>
                <Progress
                  value={32}
                  classNames={{
                    base: "h-1.5",
                    indicator:
                      "bg-[linear-gradient(45deg,rgb(123,31,162),rgb(103,58,183),rgb(244,143,177))] shadow-[0_0_6px_rgba(123,31,162,0.6)]",
                    track: "bg-[#2C2C2E]",
                  }}
                  radius="full"
                />
              </div>

              {/* 网络带宽使用率 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">网络带宽使用率</span>
                    <span className="text-xs text-gray-500 ml-2">
                      数据同步与传播
                    </span>
                  </div>
                  <span className="text-white">55%</span>
                </div>
                <Progress
                  value={55}
                  classNames={{
                    base: "h-1.5",
                    indicator:
                      "bg-[linear-gradient(45deg,rgb(123,31,162),rgb(103,58,183),rgb(244,143,177))] shadow-[0_0_6px_rgba(123,31,162,0.6)]",
                    track: "bg-[#2C2C2E]",
                  }}
                  radius="full"
                />
              </div>
            </CardBody>
          </Card>
          {/* 安全性指标 */}
          <Card className={cardStyles.chartCard}>
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-medium text-white">安全性指标</h3>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {securityMetrics.map((metric, index) => (
                  <SecurityMetricItem key={index} {...metric} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>


      {/* Setup Modal with Stepper */}
      <Modal 
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        title="建链向导"
        size="xl"
      >
        <Stepper
          steps={setupSteps}
          currentStep={currentStep}
          onStepClick={handleStepChange}
        >
          {renderStepContent(currentStep)}
          {/* {currentStep === 4 && (
            <ContractSelector
              currentStep={currentStep}
              totalSteps={setupSteps.length}
              onPrevStep={() => setCurrentStep(currentStep - 1)}
              onNextStep={() => {
                if (currentStep < setupSteps.length) {
                  setCurrentStep(currentStep + 1);
                } else {
                  // 处理完成逻辑
                  console.log('完成设置');
                }
              }}
            />
          )} */}
          {/* ... 其他步骤的内容 ... */}
        </Stepper>
      </Modal>
    </main>
  );
}
