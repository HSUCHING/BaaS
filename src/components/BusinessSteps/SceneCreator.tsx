import React, { useState } from "react";
import { Input, Textarea, Select, SelectItem, Button, Switch } from "@nextui-org/react";

export default function SceneCreator() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">创建业务场景</h3>
      
      <form className="space-y-6">
        <Input
          label="场景名称"
          placeholder="输入场景名称"
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Textarea
          label="场景描述"
          placeholder="详细描述你的业务场景..."
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Select
          label="场景类型"
          placeholder="选择场景类型"
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
          <SelectItem key="government" value="government">政务服务</SelectItem>
          <SelectItem key="finance" value="finance">金融服务</SelectItem>
          <SelectItem key="healthcare" value="healthcare">医疗健康</SelectItem>
          <SelectItem key="supply-chain" value="supply-chain">供应链</SelectItem>
        </Select>

        <div className="flex justify-between items-center truncate">
          <span className="text-default-500">是否公开</span>
          <Switch defaultSelected />
        </div>
      </form>
    </div>
  );
} 