import React from "react";
import { Card, Button } from "@nextui-org/react";

export default function SetupComplete() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">
          🎉 恭喜！配置已完成
        </h3>
        <p className="text-default-500">
          你已经成功完成了所有配置步骤，现在可以开始构建你的区块链应用了！
        </p>
      </div>

      <Card className="bg-default-100 p-6 max-w-xl w-full">
        <h4 className="text-lg font-medium text-white mb-4">配置总结</h4>
        <div className="space-y-3 text-default-500">
          <div className="flex justify-between">
            <span>场景名称</span>
            <span className="text-white">示例场景</span>
          </div>
          <div className="flex justify-between">
            <span>选择的子链</span>
            <span className="text-white">高性能子链</span>
          </div>
          <div className="flex justify-between">
            <span>参与组织数</span>
            <span className="text-white">3个</span>
          </div>
          <div className="flex justify-between">
            <span>智能合约数</span>
            <span className="text-white">2个</span>
          </div>
          <div className="flex justify-between">
            <span>API接口数</span>
            <span className="text-white">5个</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button color="primary" size="lg">
          查看详情
        </Button>
        <Button color="primary" variant="bordered" size="lg">
          下载配置
        </Button>
      </div>
    </div>
  );
} 