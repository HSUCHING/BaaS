"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChannelData {
  id?: number;
  name: string;
  subchain: string;
  blockTime: number;
  maxTransactions: number;
  maxBlockSize: number;
  maxTransactionSize: number;
}

interface ChannelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  data?: ChannelData;
  onSubmit?: (data: ChannelData) => void;
}

// 模拟的子链列表数据
const subchainOptions = [
  { id: 1, name: "子链A" },
  { id: 2, name: "子链B" },
  { id: 3, name: "子链C" },
];

export default function ChannelDrawer({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
}: ChannelDrawerProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [formData, setFormData] = React.useState<ChannelData>({
    name: "",
    subchain: "",
    blockTime: 2,
    maxTransactions: 100,
    maxBlockSize: 1024 * 1024, // 1MB
    maxTransactionSize: 1024, // 1KB
  });
  
  // 错误提示状态
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    name?: string;
    subchain?: string;
    blockTime?: string;
    maxTransactions?: string;
    maxBlockSize?: string;
    maxTransactionSize?: string;
  }>({});

  // 清除所有错误状态的函数
  const clearErrors = () => {
    setShowError(false);
    setErrorMessage("");
    setErrors({});
  };

  // 处理关闭
  const handleClose = () => {
    clearErrors();
    onClose();
  };

  React.useEffect(() => {
    if (data && (mode === "edit" || mode === "view")) {
      setFormData(data);
    } else {
      setFormData({
        name: "",
        subchain: "",
        blockTime: 2,
        maxTransactions: 100,
        maxBlockSize: 1024 * 1024,
        maxTransactionSize: 1024,
      });
    }
    clearErrors();
  }, [data, mode]);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      subchain?: string;
      blockTime?: string;
      maxTransactions?: string;
      maxBlockSize?: string;
      maxTransactionSize?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "通道名称不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.subchain) {
      newErrors.subchain = "请选择所属子链";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (formData.blockTime <= 0) {
      newErrors.blockTime = "初块时间必须大于0";
      setErrorMessage("请填写正确的初块时间");
      setShowError(true);
    }

    if (formData.maxTransactions <= 0) {
      newErrors.maxTransactions = "区块最大交易量必须大于0";
      setErrorMessage("请填写正确的区块最大交易量");
      setShowError(true);
    }

    if (formData.maxBlockSize <= 0) {
      newErrors.maxBlockSize = "区块最大字节数必须大于0";
      setErrorMessage("请填写正确的区块最大字节数");
      setShowError(true);
    }

    if (formData.maxTransactionSize <= 0) {
      newErrors.maxTransactionSize = "交易最大字节数必须大于0";
      setErrorMessage("请填写正确的交易最大字节数");
      setShowError(true);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData);
      onClose();
    } else {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  const isView = mode === "view";

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[199]
          transition-all ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isReady ? "opacity-100" : "opacity-0"}
        `}
        style={{ 
          transitionDuration: '500ms'
        }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={`
          fixed right-0 top-0 bottom-0 z-[200]
          w-full max-w-[600px] bg-[#18181b]
          transition-all ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isReady ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ 
          transitionDuration: '500ms'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-none px-8 h-16 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white tracking-wide">
              {mode === 'create' ? '新建通道' : mode === 'edit' ? '编辑通道' : '通道详情'}
            </h3>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* 错误提示 */}
            {showError && (
              <div className="mx-8 mt-6 px-4 py-3 bg-danger-50 border border-danger rounded-lg">
                <p className="text-danger text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="max-w-[600px] mx-auto py-8 px-8">
              <div className="space-y-8">
                {/* 基本信息组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">基本信息</h4>
                  <div className="space-y-4">
                    <Input
                      label="通道名称"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.name}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        input: ["text-white", "placeholder:text-white/60"].join(" "),
                        inputWrapper: [
                          "bg-white/5",
                          "border-white/10",
                          "group-data-[focus=true]:border-white/30",
                          "hover:border-white/20",
                          "!cursor-text",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.name && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Select
                      label="所属子链"
                      selectedKeys={[formData.subchain]}
                      onChange={(e) => setFormData(prev => ({ ...prev, subchain: e.target.value }))}
                      isDisabled={isView}
                      isRequired
                      errorMessage={errors.subchain}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        trigger: [
                          "bg-white/5",
                          "border-white/10",
                          "data-[hover=true]:border-white/30",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.subchain && "border-danger"
                        ].join(" "),
                        value: "text-white",
                        errorMessage: "text-danger"
                      }}
                      popoverProps={{
                        classNames: {
                          base: "dark",
                          content: "dark bg-[#18181b]"
                        }
                      }}
                    >
                      {subchainOptions.map((chain) => (
                        <SelectItem key={chain.name} value={chain.name}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* 配置信息组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">配置信息</h4>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      label="初块时间(s)"
                      value={formData.blockTime.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, blockTime: Number(e.target.value) }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.blockTime}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        input: ["text-white", "placeholder:text-white/60"].join(" "),
                        inputWrapper: [
                          "bg-white/5",
                          "border-white/10",
                          "group-data-[focus=true]:border-white/30",
                          "hover:border-white/20",
                          "!cursor-text",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.blockTime && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Input
                      type="number"
                      label="区块最大交易量"
                      value={formData.maxTransactions.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxTransactions: Number(e.target.value) }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.maxTransactions}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        input: ["text-white", "placeholder:text-white/60"].join(" "),
                        inputWrapper: [
                          "bg-white/5",
                          "border-white/10",
                          "group-data-[focus=true]:border-white/30",
                          "hover:border-white/20",
                          "!cursor-text",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.maxTransactions && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Input
                      type="number"
                      label="区块最大字节数(B)"
                      value={formData.maxBlockSize.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxBlockSize: Number(e.target.value) }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.maxBlockSize}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        input: ["text-white", "placeholder:text-white/60"].join(" "),
                        inputWrapper: [
                          "bg-white/5",
                          "border-white/10",
                          "group-data-[focus=true]:border-white/30",
                          "hover:border-white/20",
                          "!cursor-text",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.maxBlockSize && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Input
                      type="number"
                      label="交易最大字节数(B)"
                      value={formData.maxTransactionSize.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxTransactionSize: Number(e.target.value) }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.maxTransactionSize}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        input: ["text-white", "placeholder:text-white/60"].join(" "),
                        inputWrapper: [
                          "bg-white/5",
                          "border-white/10",
                          "group-data-[focus=true]:border-white/30",
                          "hover:border-white/20",
                          "!cursor-text",
                          "shadow-xl",
                          "backdrop-blur-sm",
                          errors.maxTransactionSize && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-none px-8 h-20 border-t border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-end space-x-4">
            <Button 
              color="danger" 
              variant="light" 
              onPress={handleClose}
              className="w-24"
              radius="sm"
            >
              关闭
            </Button>
            {!isView && (
              <Button 
                color="primary" 
                onPress={handleSubmit}
                className="w-24"
                radius="sm"
              >
                确定
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 