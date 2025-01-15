"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import {
  MagnifyingGlassIcon,
  CubeTransparentIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export default function BlockExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <main className="container mx-auto p-4 space-y-6">
      {/* 搜索区域 */}
      <Card className="bg-default-50/50 shadow-md backdrop-blur-md">
        <CardBody className="p-6">
          <div className="flex gap-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索区块 / 交易哈希 / 地址 / 合约"
              startContent={
                <MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
              }
              className="flex-1"
              size="lg"
            />
            <Button
              color="primary"
              className="px-8"
              startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
            >
              搜索
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 链状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="最新区块高度"
          value="12,345,678"
          change="+1 区块/3s"
          trend="up"
          icon={<CubeTransparentIcon className="w-5 h-5" />}
        />
        <StatCard
          title="当前 TPS"
          value="2,890"
          change="+12.5%"
          trend="up"
          icon={<ArrowPathIcon className="w-5 h-5" />}
        />
        <StatCard
          title="总交易数"
          value="89,123,456"
          change="+1,234"
          trend="up"
          icon={<DocumentDuplicateIcon className="w-5 h-5" />}
        />
        <StatCard
          title="平均确认时间"
          value="2.5s"
          change="-0.2s"
          trend="down"
          icon={<ClockIcon className="w-5 h-5" />}
        />
      </div>

      {/* 主要内容区域 */}
      <Card className="bg-default-50/50 shadow-md backdrop-blur-md">
        <Tabs
          aria-label="区块链数据"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key.toString())}
          className="p-0"
          classNames={{
            panel: "px-10", 
          }}
        >
          <Tab key="overview" title="概览">
            <Overview />
          </Tab>
          <Tab key="blocks" title="区块">
            <BlocksTable />
          </Tab>
          <Tab key="transactions" title="交易">
            <TransactionsTable />
          </Tab>
          <Tab key="contracts" title="合约">
            <ContractsTable />
          </Tab>
          <Tab key="accounts" title="账户">
            <AccountsTable />
          </Tab>
        </Tabs>
      </Card>
    </main>
  );
}

// 统计卡片组件
function StatCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-default-50/50 shadow-md backdrop-blur-md">
      <CardBody className="p-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-2 rounded-lg",
              trend === "up"
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            )}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-default-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <Chip
            size="sm"
            color={trend === "up" ? "success" : "danger"}
            variant="flat"
          >
            {change}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}

// 概览组件
function Overview() {
  return (
    <div className="p-6 space-y-6">
      {/* 区块链活动图表 */}
      <Card className="p-4">
        <CardHeader>
          <h3 className="text-lg font-medium">区块链活动</h3>
        </CardHeader>
        <CardBody>
          {/* 这里添加图表组件 */}
          <div className="h-50 rounded-lg grid lg:grid-cols-2 gap-2">
            {/* 最新区块和交易 */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">最新区块</h3>
                </CardHeader>
                <CardBody>
                  <BlocksTable limit={5} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">最新交易</h3>
                </CardHeader>
                <CardBody>
                  <TransactionsTable limit={5} />
                </CardBody>
              </Card>
            {/* 使用 echarts 或其他图表库 */}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// 区块表格组件
function BlocksTable({ limit }: { limit?: number }) {
  return (
    <Table aria-label="区块列表">
      <TableHeader>
        <TableColumn>区块高度</TableColumn>
        <TableColumn>时间</TableColumn>
        <TableColumn>交易数</TableColumn>
        <TableColumn>区块大小</TableColumn>
        <TableColumn>出块节点</TableColumn>
      </TableHeader>
      <TableBody>
        {/* 示例数据 */}
        <TableRow>
          <TableCell>82,122,253</TableCell>
          <TableCell>3秒前</TableCell>
          <TableCell>156</TableCell>
          <TableCell>1.2 MB</TableCell>
          <TableCell>Node_01</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>72,723,623</TableCell>
          <TableCell>5秒前</TableCell>
          <TableCell>232</TableCell>
          <TableCell>2.4 MB</TableCell>
          <TableCell>Node_02</TableCell>
        </TableRow>
        {/* 添加更多行 */}
      </TableBody>
    </Table>
  );
}

// 交易表格组件
function TransactionsTable({ limit }: { limit?: number }) {
  return (
    <Table aria-label="交易列表">
      <TableHeader>
        <TableColumn>交易哈希</TableColumn>
        <TableColumn>方法</TableColumn>
        <TableColumn>发送方</TableColumn>
        <TableColumn>接收方</TableColumn>
        <TableColumn>状态</TableColumn>
      </TableHeader>
      <TableBody>
        {/* 示例数据 */}
        <TableRow>
          <TableCell>0x832...321</TableCell>
          <TableCell>Transfer</TableCell>
          <TableCell>0xfdse...dsfs</TableCell>
          <TableCell>0x0994...4325</TableCell>
          <TableCell>
            <Chip color="success" size="sm">
              成功
            </Chip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>0x532...7642</TableCell>
          <TableCell>Transfer</TableCell>
          <TableCell>0xtrew...nmnv</TableCell>
          <TableCell>0x5124...8633</TableCell>
          <TableCell>
            <Chip color="success" size="sm">
              成功
            </Chip>
          </TableCell>
        </TableRow>
        {/* 添加更多行 */}
      </TableBody>
    </Table>
  );
}

// 合约表格组件
function ContractsTable() {
  return (
    <Table aria-label="合约列表">
      <TableHeader>
        <TableColumn>合约地址</TableColumn>
        <TableColumn>合约名称</TableColumn>
        <TableColumn>创建者</TableColumn>
        <TableColumn>交互次数</TableColumn>
        <TableColumn>验证状态</TableColumn>
      </TableHeader>
      <TableBody>
        {/* 示例数据 */}
        <TableRow>
          <TableCell>0xaac3...5632</TableCell>
          <TableCell>档案管理</TableCell>
          <TableCell>0x8232...baac</TableCell>
          <TableCell>82,112</TableCell>
          <TableCell>
            <Chip color="success" size="sm">
              已验证
            </Chip>
          </TableCell>
        </TableRow>
        {/* 添加更多行 */}
      </TableBody>
    </Table>
  );
}

// 账户表格组件
function AccountsTable() {
  return (
    <Table aria-label="账户列表">
      <TableHeader>
        <TableColumn>账户地址</TableColumn>
        <TableColumn>余额</TableColumn>
        <TableColumn>交易数</TableColumn>
        <TableColumn>最后活动</TableColumn>
        <TableColumn>类型</TableColumn>
      </TableHeader>
      <TableBody>
        {/* 示例数据 */}
        <TableRow>
          <TableCell>0x8732...4222</TableCell>
          <TableCell>2,9832.56</TableCell>
          <TableCell>542</TableCell>
          <TableCell>2分钟前</TableCell>
          <TableCell>
            <Chip color="primary" size="sm">
              Gov
            </Chip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>0x8832...2653</TableCell>
          <TableCell>2,7632.32</TableCell>
          <TableCell>872</TableCell>
          <TableCell>10分钟前</TableCell>
          <TableCell>
            <Chip color="primary" size="sm">
              Corp
            </Chip>
          </TableCell>
        </TableRow>
        {/* 添加更多行 */}
      </TableBody>
    </Table>
  );
}
