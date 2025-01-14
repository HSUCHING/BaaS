"use client";
import React, { useEffect, useRef, useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import {
  ChevronDownIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import {
  ChainIcon,
  BlockIcon,
  TransactionIcon,
  BIDIcon,
  CertificateIcon,
  StorageIcon,
} from "@/components/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Marquee from "@/components/ui/marquee";
// 区块链数据统计
const cryptoCards = [
  {
    name: "子链",
    icon: <ChainIcon />,
    value: "7",
    label: "子链",
  },
  {
    name: "区块高度",
    icon: <BlockIcon />,
    value: "6089",
    label: "区块高度",
  },
  {
    name: "交易数",
    icon: <TransactionIcon />,
    value: "149624",
    label: "交易数",
  },
  {
    name: "BID标识数",
    icon: <BIDIcon />,
    value: "83",
    label: "BID标识数",
  },
  {
    name: "公共存证数",
    icon: <CertificateIcon />,
    value: "92",
    label: "公共存证数",
  },
  {
    name: "文件存储数",
    icon: <StorageIcon />,
    value: "1128",
    label: "文件存储数",
  },
];

// 生成过去7天的日期
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(
      date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
    );
  }
  return dates;
};

// 模拟数据
const generateData = () => {
  const dates = getLast7Days();
  return dates.map((date) => ({
    date,
    公共存证: Math.floor(Math.random() * 1000 + 500),
    存证更新: Math.floor(Math.random() * 800 + 300),
    存证溯源: Math.floor(Math.random() * 600 + 200),
    文件上传: Math.floor(Math.random() * 400 + 100),
    文件下载: Math.floor(Math.random() * 900 + 400),
    标识注册: Math.floor(Math.random() * 300 + 100),
    标识解析: Math.floor(Math.random() * 700 + 300),
    跨链: Math.floor(Math.random() * 500 + 200),
  }));
};

const serviceColors = {
  公共存证: "#8884d8",
  存证更新: "#82ca9d",
  存证溯源: "#ffc658",
  文件上传: "#ff7300",
  文件下载: "#00C49F",
  标识注册: "#FFBB28",
  标识解析: "#FF8042",
  跨链: "#a4de6c",
};

// 恢复之前的通知数据
const notificationData = [
  {
    id: 1,
    avatar: "/img/enterprise/police.png",
    unit: "重要委办单位",
    time: "2分钟前",
    type: "公共存证",
    description: "调用公共存证服务",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 2,
    avatar: "/img/enterprise/shanghaielement.png",
    unit: "创业公司",
    time: "5分钟前",
    type: "文件上传",
    description: "上传文件至链上存储",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 3,
    avatar: "/img/enterprise/powerchina.png",
    unit: "xxx 某能源公司",
    time: "8分钟前",
    type: "标识注册",
    description: "注册新的链上标识",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 4,
    avatar: "/img/enterprise/chinacitibank.png",
    unit: "xxxx大型商业银行",
    time: "12分钟前",
    type: "跨链",
    description: "发起跨链交易请求",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 5,
    avatar: "/img/enterprise/sinopharm.png",
    unit: "N某医药公司",
    time: "15分钟前",
    type: "存证溯源",
    description: "查询存证记录",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 6,
    avatar: "/img/enterprise/chinacitibank.png",
    unit: "xxxxy银行",
    time: "18分钟前",
    type: "存证更新",
    description: "更新链上存证数据",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 7,
    avatar: "/img/enterprise/shanghaibank.png",
    unit: "某地区性银行",
    time: "20分钟前",
    type: "标识解析",
    description: "解析链上标识信息",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
  {
    id: 8,
    avatar: "/img/enterprise/powerchina.png",
    unit: "xxx 电力",
    time: "25分钟前",
    type: "文件下载",
    description: "从链上下载文件",
    isHot: Math.random() > 0.7, // 30%的概率是新消息
  },
];

const NotificationList = () => {
  const itemHeight = 88; // 项目高度
  const itemGap = 16; // 项目间距
  const totalHeight = itemHeight + itemGap; // 每个项目的总高度（包含间距）

  const [notifications, setNotifications] = useState(notificationData);
  const [positions, setPositions] = useState(
    notifications.map((_, index) => index * totalHeight)
  );
  const [movingIndex, setMovingIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const newPositions = prev.map((pos) => pos - totalHeight);
        const outIndex = newPositions.findIndex((pos) => pos < -totalHeight);

        if (outIndex !== -1) {
          setMovingIndex(outIndex);
          const lastVisiblePos = Math.max(...newPositions);
          newPositions[outIndex] = lastVisiblePos + totalHeight;

          setTimeout(() => {
            setMovingIndex(-1);
          }, 300);
        }

        return newPositions;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <div className="h-[440px] overflow-hidden relative">
      <style jsx>{`
        @keyframes borderBlink {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: #e60000;
          }
        }
        .hot-message {
          border: 2px solid transparent;
          animation: borderBlink 2s ease-in-out infinite;
        }
        .new-badge {
          position: absolute;
          top: 0px;
          left: 0px;
          // background-color: #DAA520;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          transform: rotate(-5deg);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="absolute w-full transition-all duration-300"
          style={{
            transform: `translateY(${positions[index]}px)`,
            opacity: movingIndex === index ? 0 : 1,
            zIndex: positions[index] < 0 ? 0 : 1,
          }}
        >
          <div
            className={`relative h-[88px] p-4 bg-default-100 rounded-lg ${
              notification.isHot ? "hot-message" : ""
            }`}
          >
            {notification.isHot && <span className="new-badge">🔥</span>}
            <div className="flex items-center gap-4 h-full">
              <Avatar
                src={notification.avatar}
                className="w-10 h-10 shrink-0"
                aria-label={`${notification.unit} 的头像`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-default-foreground truncate">
                    {notification.unit}
                  </p>
                  <span className="text-xs text-default-500 shrink-0">
                    {notification.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-500 rounded-full shrink-0">
                    {notification.type}
                  </span>
                  <p className="text-xs text-default-500 truncate">
                    {notification.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 更新极光色数组，增加更多炫酷的渐变组合
const auroraColors = [
  'linear-gradient(45deg, #ff6b6b, #feca57, #ff9ff3)',  // 热带日落
  'linear-gradient(45deg, #4834d4, #686de0, #45aaf2)',  // 深邃海洋
  'linear-gradient(45deg, #6c5ce7, #a55eea, #fd79a8)',  // 神秘紫罗兰
  'linear-gradient(45deg, #00b894, #00cec9, #81ecec)',  // 薄荷极光
  'linear-gradient(45deg, #ff7675, #fd79a8, #fab1a0)',  // 粉色晚霞
  'linear-gradient(45deg, #fdcb6e, #e17055, #ff7675)',  // 金色黄昏
  'linear-gradient(45deg, #0984e3, #00cec9, #55efc4)',  // 海洋之心
  'linear-gradient(45deg, #6c5ce7, #00cec9, #81ecec)',  // 极光幻境
  'linear-gradient(45deg, #e056fd, #686de0, #45aaf2)',  // 银河漩涡
  'linear-gradient(45deg, #ff9ff3, #a55eea, #fd79a8)',  // 魔法粉晶
  'linear-gradient(45deg, #ffeaa7, #fab1a0, #ff7675)',  // 温暖阳光
  'linear-gradient(45deg, #48dbfb, #45aaf2, #4834d4)',  // 深海极光
  'linear-gradient(45deg, #badc58, #6ab04c, #45aaf2)',  // 自然之息
  'linear-gradient(45deg, #ff9f43, #ee5253, #ff6b6b)',  // 熔岩流动
  'linear-gradient(45deg, #574b90, #786fa6, #f8c291)'   // 暮色天空
];

// 修改场景数据，添加 isNew 标识和随机背景色
const scenarioData = [
  {
    id: "SC001",
    name: "供应链金融数字化",
    leader: "某某银行股份有限公司",
    description: "基于区块链的供应链金融解决方案，实现多方可信数据共享和业务协同",
    contractNo: "CTR20240301-001",
    status: "进行中",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC002",
    name: "跨境贸易结算",
    leader: "某某国际贸易公司",
    description: "基于区块链的跨境贸易支付结算平台，提供安全高效的国际贸易服务",
    contractNo: "CTR20240228-003",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC003",
    name: "数字身份认证",
    leader: "某某科技有限公司",
    description: "去中心化数字身份认证系统，支持多场景可信身份验证",
    contractNo: "CTR20240215-007",
    status: "试运行",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC004",
    name: "碳排放权交易",
    leader: "某某环保科技公司",
    description: "基于区块链的碳排放权交易平台，实现碳资产全生命周期管理",
    contractNo: "CTR20240220-005",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC005",
    name: "医疗数据共享",
    leader: "某某医疗科技公司",
    description: "医疗健康数据安全共享平台，促进医疗资源协同",
    contractNo: "CTR20240225-002",
    status: "进行中",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC006",
    name: "数字资产交易",
    leader: "某某金融科技公司",
    description: "基于区块链的数字资产交易平台，支持多种数字资产的安全交易",
    contractNo: "CTR20240310-008",
    status: "试运行",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC007",
    name: "知识产权保护",
    leader: "某某版权科技公司",
    description: "区块链数字版权保护系统，实现创新成果全生命周期追溯",
    contractNo: "CTR20240305-004",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC008",
    name: "政务数据共享",
    leader: "某某政务服务中心",
    description: "跨部门政务数据共享平台，提升政务服务效率",
    contractNo: "CTR20240308-006",
    status: "进行中",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC009",
    name: "供应链溯源",
    leader: "某某物流科技公司",
    description: "商品全链路追溯系统，保障商品质量安全",
    contractNo: "CTR20240312-009",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC010",
    name: "智慧能源交易",
    leader: "某某能源科技公司",
    description: "分布式能源交易平台，促进清洁能源高效利用",
    contractNo: "CTR20240315-010",
    status: "试运行",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC006",
    name: "数字资产交易",
    leader: "某某金融科技公司",
    description: "基于区块链的数字资产交易平台，支持多种数字资产的安全交易",
    contractNo: "CTR20240310-008",
    status: "试运行",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC007",
    name: "知识产权保护",
    leader: "某某版权科技公司",
    description: "区块链数字版权保护系统，实现创新成果全生命周期追溯",
    contractNo: "CTR20240305-004",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC008",
    name: "政务数据共享",
    leader: "某某政务服务中心",
    description: "跨部门政务数据共享平台，提升政务服务效率",
    contractNo: "CTR20240308-006",
    status: "进行中",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC009",
    name: "供应链溯源",
    leader: "某某物流科技公司",
    description: "商品全链路追溯系统，保障商品质量安全",
    contractNo: "CTR20240312-009",
    status: "已上线",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  },
  {
    id: "SC010",
    name: "智慧能源交易",
    leader: "某某能源科技公司",
    description: "分布式能源交易平台，促进清洁能源高效利用",
    contractNo: "CTR20240315-010",
    status: "试运行",
    isNew: Math.random() > 0.7,
    imageColor: auroraColors[Math.floor(Math.random() * auroraColors.length)]
  }
];

const firstRow = scenarioData.slice(0, scenarioData.length / 2);
const secondRow = scenarioData.slice(scenarioData.length / 2);

const ScenarioBlock = () => {
  return (
    <Card className="col-span-8 p-6 bg-default-50">
      <div className="mb-4">
        <h2 className="text-xl font-medium text-white">赋能场景</h2>
      </div>
      <div className="w-full flex flex-col gap-6">
        {/* 原有的从左到右的 Marquee */}
        <Marquee pauseOnHover className="py-4">
          {firstRow.map((scenario) => (
            <div
              key={scenario.id + Math.random()}
              className="mx-4 min-w-[200px] max-w-[50vw] bg-default-100 rounded-lg p-4 border border-default-200"
            >
              <div className="flex justify-between items-start mb-2 relative">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: scenario.imageColor,
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {scenario.name.slice(0, 1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white truncate flex-1">
                    {scenario.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {scenario.isNew && (
                    <span className="absolute -top-4 -left-4 text-[#DAA520] text-sm px-2 py-0.5 transform -rotate-12 shadow-lg">
                      新
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    scenario.status === "已上线" ? "bg-green-500/20 text-green-500" :
                    scenario.status === "进行中" ? "bg-blue-500/20 text-blue-500" :
                    "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {scenario.status}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-sm text-default-500">牵头方：</span>
                <span className="text-sm text-default-foreground truncate">
                  {scenario.leader}
                </span>
              </div>
              <p className="text-sm text-default-500 mb-2 line-clamp-2">
                <span className="text-sm text-default-500">场景描述：</span>
                <span className="text-sm text-default-foreground truncate">
                  {scenario.description}
                </span>
              </p>
              <div className="text-xs text-default-400">
                合约编号：{scenario.contractNo}
              </div>
            </div>
          ))}
        </Marquee>

        {/* 反向的 Marquee */}
        <Marquee pauseOnHover reverse className="py-4">
          {secondRow.map((scenario) => (
            <div
              key={scenario.id + Math.random()}
              className="mx-4 min-w-[200px] max-w-[50vw] bg-default-100 rounded-lg p-4 border border-default-200"
            >
              <div className="flex justify-between items-start mb-2 relative">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: scenario.imageColor,
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {scenario.name.slice(0, 1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white truncate flex-1">
                    {scenario.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {scenario.isNew && (
                    <span className="absolute -top-4 -left-4 text-[#DAA520] text-sm px-2 py-0.5 transform -rotate-12 shadow-lg">
                      新
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    scenario.status === "已上线" ? "bg-green-500/20 text-green-500" :
                    scenario.status === "进行中" ? "bg-blue-500/20 text-blue-500" :
                    "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {scenario.status}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-sm text-default-500">牵头方：</span>
                <span className="text-sm text-default-foreground truncate">
                  {scenario.leader}
                </span>
              </div>
              <p className="text-sm text-default-500 mb-2 line-clamp-2">
                <span className="text-sm text-default-500">场景描述：</span>
                <span className="text-sm text-default-foreground truncate">
                  {scenario.description}
                </span>
              </p>
              <div className="text-xs text-default-400">
                合约编号：{scenario.contractNo}
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </Card>
  );
};

export default function Dashboard() {
  const [selectedView, setSelectedView] = React.useState(new Set(["核心指标"]));

  const handleViewSelect = (selection) => {
    setSelectedView(selection);
    console.log("Selected view:", Array.from(selection)[0]);
  };

  const chartData = React.useMemo(() => generateData(), []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="relative flex items-center justify-between py-3 mb-6">
        {/* Left side - Title */}
        <h1 className="text-xl font-medium text-white">区块链平台看板</h1>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Select
            placeholder="视图选择"
            selectedKeys={selectedView}
            className="w-[200px]"
            onSelectionChange={handleViewSelect}
            size="md"
            variant="flat"
            popoverProps={{
              classNames: {
                base: "dark",
                content: "dark",
              },
            }}
          >
            <SelectItem key="核心指标" value="核心指标">
              核心指标
            </SelectItem>
            <SelectItem key="交易流程" value="交易流程">
              交易流程
            </SelectItem>
            <SelectItem key="跨链交易" value="跨链交易">
              跨链交易
            </SelectItem>
          </Select>
          <button className="flex items-center justify-center gap-2 h-10 px-4 min-w-[140px] bg-[#DAA520] hover:bg-[#B8860B] text-white text-sm font-medium rounded-sm transition-colors">
            <PlusIcon className="w-5 h-5" />
            增加组件
          </button>
        </div>
      </div>

      {/* Crypto Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {cryptoCards.map((crypto) => (
          <Card key={crypto.name} className="p-4">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl text-gold mb-2">{crypto.icon}</span>
              <span className="text-2xl font-bold text-white mb-1">
                {crypto.value}
              </span>
              <span className="text-sm text-gold">{crypto.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <ScenarioBlock />
        {/* Notifications */}
        <Card className="col-span-4 p-6 bg-default-50">
          <div className="mb-4">
            <h2 className="text-xl font-medium text-white">最新服务调用</h2>
          </div>
          <NotificationList />
        </Card>
        {/* Service Trends Chart */}
        <Card className="col-span-12 p-6 bg-default-50">
          <div className="mb-4">
            <h2 className="text-xl font-medium text-white">服务调用趋势</h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
                <YAxis stroke="#888" tick={{ fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#fff",
                  }}
                />
                {Object.entries(serviceColors).map(([service, color]) => (
                  <Line
                    key={service}
                    type="monotone"
                    dataKey={service}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Portfolio Tokens */}
        {/* <Card className="col-span-3 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Portfolio Tokens
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-sm text-sm bg-card text-secondary hover:text-gold">
                All market
              </button>
              <button className="px-3 py-1 rounded-sm text-sm bg-card text-secondary hover:text-gold">
                Crypto
              </button>
            </div>
          </div> */}
          {/* Token list content */}
        {/* </Card> */}
      </div>
    </div>
  );
}
