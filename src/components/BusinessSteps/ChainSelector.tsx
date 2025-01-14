import React, { useState } from "react";
import { Card, Button, Input, Radio, RadioGroup,Select,SelectItem } from "@nextui-org/react";

const CHAIN_TEMPLATES = [
  {
    id: 1,
    name: "高性能子链",
    description: "适用于高频交易场景，支持每秒数千笔交易",
    tps: "5000+",
  },
  {
    id: 2,
    name: "隐私子链",
    description: "适用于数据隐私要求高的场景，支持零知识证明",
    tps: "1000+",
  },
  // ... 更多模板
];


export default function ChainSelector() {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [mode, setMode] = useState<"select" | "create">("select");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">选择或创建子链</h3>

      <RadioGroup value={mode} onValueChange={(value) => setMode(value as "select" | "create")}>
        <Radio value="select">选择现有子链</Radio>
        <Radio value="create">创建新子链</Radio>
      </RadioGroup>

      {mode === "select" ? (
        <div className="grid grid-cols-2 gap-4">
          {CHAIN_TEMPLATES.map((chain) => (
            <Card
              key={chain.id}
              isPressable
              onPress={() => setSelectedChain(chain.id)}
              className={`bg-default-100 border-2 ${
                selectedChain === chain.id
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <div className="p-4">
                <h4 className="text-lg font-medium text-white">{chain.name}</h4>
                <p className="text-sm text-default-500">{chain.description}</p>
                <div className="mt-2">
                  <span className="text-xs bg-default-200 px-2 py-1 rounded">
                    TPS: {chain.tps}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <form className="space-y-4">
          <Input
            label="子链名称"
            placeholder="输入子链名称"
            variant="bordered"
            classNames={{
              label: "text-default-500",
              input: "text-white",
            }}
          />
          <Select
            label="共识机制"
            placeholder="选择共识机制"
            variant="bordered"
            classNames={{
              label: "text-default-500",
              value: "text-white",
            }}
            popoverProps={{
              classNames: {
                base: "dark",
                content: "dark bg-[#18181b]",
              },
            }}
          >
            <SelectItem key="pos" value="pos">权益证明 (PoS)</SelectItem>
            <SelectItem key="poa" value="poa">权威证明 (PoA)</SelectItem>
            <SelectItem key="pbft" value="pbft">实用拜占庭容错 (PBFT)</SelectItem>
          </Select>
        </form>
      )}
    </div>
  );
} 