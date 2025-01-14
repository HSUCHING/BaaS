import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
} from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/outline";

const CONTRACT_TEMPLATES = [
  {
    id: 1,
    name: "身份认证合约",
    description:
      "用于居民健康码验证、企业注册资质认证等场景，合约自动验证身份信息并授权访问权限。",
  },
  {
    id: 2,
    name: "电子政务合约",
    description:
      "适用于社保申请、税务办理等场景，自动验证申请条件，发放福利或处理申报。",
  },
  {
    id: 3,
    name: "应急调度合约",
    description:
      "根据灾害类型和影响范围，触发资源调用（如消防车辆、医疗队伍）的自动化流程。",
  },
  {
    id: 4,
    name: "公共资源管理合约",
    description:
      "应用于电力分配、停车位调度、水资源管理等场景，根据需求和实时情况动态分配资源。",
  },
];

interface ContractSelectorProps {
  // 移除步骤相关的 props
  // currentStep: number;
  // totalSteps: number;
  // onPrevStep: () => void;
  // onNextStep: () => void;
}

export default function ContractSelector() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    // 等待动画完成后再真正关闭抽屉
    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsClosing(false);
    }, 800); // 与动画时长匹配
  };

  return (
    <>
      <div className={`space-y-6 ${isDrawerOpen ? "pointer-events-none" : ""}`}>
        {/* 合约选择部分 */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            选择智能合约
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {CONTRACT_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                isPressable
                onPress={() => setSelectedTemplate(template.id)}
                className={`bg-default-100 border-2 ${
                  selectedTemplate === template.id
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <div className="p-4">
                  <h4 className="text-lg font-medium text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-default-500">
                    {template.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 创建新合约按钮 */}
        <div className="flex justify-between items-center">
          <p className="text-default-500">没有找到合适的合约模板？</p>
          <Button
            color="primary"
            endContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => setIsDrawerOpen(true)}
          >
            创建新合约
          </Button>
        </div>
      </div>

      {/* 创建合约的抽屉 */}
      {isDrawerOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 pointer-events-auto"
            onClick={handleClose}
          />

          {/* 抽屉面板 */}
          <div
            className={`fixed inset-y-0 right-0 w-[500px] bg-default-100 shadow-xl z-50 pointer-events-auto`}
            style={{
              perspective: "1000px",
              animation: isClosing
                ? "drawerSlideOut 0.8s ease-in forwards"
                : "drawerSlideIn 0.8s ease-out forwards",
            }}
          >
            <div className="h-full flex flex-col">
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between p-6 border-b border-default-200">
                <h3 className="text-xl font-semibold text-white">
                  创建智能合约
                </h3>
                <Button isIconOnly variant="light" onPress={handleClose}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              {/* 合约表单 */}
              <div className="flex-1 overflow-y-auto p-6">
                <form className="space-y-6">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <Input
                      label="合约名称"
                      placeholder="输入合约名称"
                      variant="bordered"
                      classNames={{
                        label: "text-default-500",
                        input: "text-white",
                      }}
                    />

                    <Textarea
                      label="合约描述"
                      placeholder="描述合约的功能和用途"
                      variant="bordered"
                      classNames={{
                        label: "text-default-500",
                        input: "text-white",
                      }}
                    />

                    <Select
                      label="合约类型"
                      placeholder="选择合约类型"
                      variant="bordered"
                      classNames={{
                        label: "text-default-500",
                        value: "text-white",
                        base: "dark",
                      }}
                      popoverProps={{
                        classNames: {
                          base: "dark",
                          content: "dark bg-[#18181b]",
                        },
                      }}
                    >
                      <SelectItem key="identity" value="identity">
                        身份与认证类合约
                      </SelectItem>
                      <SelectItem key="governance" value="governance">
                        城市治理类合约
                      </SelectItem>
                      <SelectItem key="digital-assets" value="digital-assets">
                        数字资产管理类合约
                      </SelectItem>
                      <SelectItem key="compliance" value="compliance">
                        合规与审计类合约
                      </SelectItem>
                      <SelectItem key="payments" value="payments">
                        智能支付与结算类合约
                      </SelectItem>
                    </Select>

                    <Input
                      label="初始供应量"
                      type="number"
                      placeholder="输入代币初始供应量"
                      variant="bordered"
                      classNames={{
                        label: "text-default-500",
                        input: "text-white",
                      }}
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-default-500">是否可升级</span>
                      <Switch defaultSelected />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-default-500">是否可暂停</span>
                      <Switch defaultSelected />
                    </div>

                    <Select
                      label="访问控制"
                      placeholder="选择访问控制模式"
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
                      <SelectItem key="ownable" value="ownable">
                        单一所有者
                      </SelectItem>
                      <SelectItem key="roles" value="roles">
                        角色控制
                      </SelectItem>
                      <SelectItem key="dao" value="dao">
                        社区治理
                      </SelectItem>
                    </Select>
                  </div>
                </form>
              </div>

              {/* 底部按钮 */}
              <div className="p-6 border-t border-default-200">
                <div className="flex justify-end gap-4">
                  <Button variant="bordered" onPress={handleClose}>
                    取消
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      // 处理表单提交
                      handleClose();
                    }}
                  >
                    创建合约
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
