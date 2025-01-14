import React, { useState } from "react";
import { Input, Select, SelectItem, Switch, Button, Textarea } from "@nextui-org/react";
import {
  PlusIcon
} from "@/components/icons";

export default function APICreator() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">创建服务接口</h3>

      <form className="space-y-6">
        <Input
          label="API名称"
          placeholder="输入API名称"
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Select
          label="请求方法"
          placeholder="选择HTTP方法"
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
          <SelectItem key="get" value="get">GET</SelectItem>
          <SelectItem key="post" value="post">POST</SelectItem>
          <SelectItem key="put" value="put">PUT</SelectItem>
          <SelectItem key="delete" value="delete">DELETE</SelectItem>
        </Select>

        <Input
          label="路径"
          placeholder="/api/v1/..."
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Textarea
          label="请求参数"
          placeholder="描述API请求参数..."
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Textarea
          label="响应格式"
          placeholder="描述API响应格式..."
          variant="bordered"
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <div className="flex justify-between items-center">
          <span className="text-default-500">需要认证</span>
          <Switch defaultSelected />
        </div>
      </form>

      <Button
        color="primary"
        className="mt-4"
        startContent={<PlusIcon className="w-4 h-4" />}
      >
        添加新接口
      </Button>
    </div>
  );
} 