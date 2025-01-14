"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface APIData {
  id?: number;
  name: string;
  port: string;
  contract: string;
  heightQueryUrl: string;
  hashQueryUrl: string;
  traceUrl: string;
  preciseQueryUrl: string;
  fuzzySearchUrl: string;
  blockchainInfoUrl: string;
  uploadUrl: string;
  txHashQueryUrl: string;
  txBlockQueryUrl: string;
}

interface APIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  data?: APIData;
  onSubmit?: (data: APIData) => void;
}

// 模拟的合约列表数据
const contractOptions = [
  { id: 1, name: "合约1" },
  { id: 2, name: "合约2" },
  { id: 3, name: "合约3" },
];

export default function APIDrawer({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
}: APIDrawerProps) {
  const isView = mode === "view";
  const [mounted, setMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [formData, setFormData] = React.useState<APIData>({
    name: "",
    port: "",
    contract: "",
    heightQueryUrl: "",
    hashQueryUrl: "",
    traceUrl: "",
    preciseQueryUrl: "",
    fuzzySearchUrl: "",
    blockchainInfoUrl: "",
    uploadUrl: "",
    txHashQueryUrl: "",
    txBlockQueryUrl: "",
  });
  
  // 错误提示状态
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    [key in keyof APIData]?: string;
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
        port: "",
        contract: "",
        heightQueryUrl: "",
        hashQueryUrl: "",
        traceUrl: "",
        preciseQueryUrl: "",
        fuzzySearchUrl: "",
        blockchainInfoUrl: "",
        uploadUrl: "",
        txHashQueryUrl: "",
        txBlockQueryUrl: "",
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
      [key in keyof APIData]?: string;
    } = {};

    // 基本信息验证
    if (!formData.name.trim()) {
      newErrors.name = "接口名称不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.port.trim()) {
      newErrors.port = "端口不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    } else if (!/^\d+$/.test(formData.port)) {
      newErrors.port = "端口必须是数字";
      setErrorMessage("请输入正确的端口格式");
      setShowError(true);
    }

    if (!formData.contract) {
      newErrors.contract = "请选择模版合约";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    // URL 验证
    const urlFields: (keyof APIData)[] = [
      'heightQueryUrl',
      'hashQueryUrl',
      'traceUrl',
      'preciseQueryUrl',
      'fuzzySearchUrl',
      'blockchainInfoUrl',
      'uploadUrl',
      'txHashQueryUrl',
      'txBlockQueryUrl'
    ];

    urlFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace('Url', '')} URL不能为空`;
        setErrorMessage("请填写必填字段");
        setShowError(true);
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData);
      handleClose();
    } else {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  if (!mounted) return null;

  // 渲染 URL 输入框
  const renderUrlInput = (
    label: string,
    field: keyof APIData,
    placeholder: string = ""
  ) => (
    <Input
      label={label}
      value={formData[field] as string}
      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
      isReadOnly={isView}
      isRequired
      placeholder={placeholder}
      errorMessage={errors[field]}
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
          errors[field] && "border-danger"
        ].join(" "),
        errorMessage: "text-danger"
      }}
    />
  );

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
              {mode === 'create' ? '新建接口' : mode === 'edit' ? '编辑接口' : '接口详情'}
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
                      label="接口名称"
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
                    <Input
                      label="端口"
                      value={formData.port}
                      onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.port}
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
                          errors.port && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Select
                      label="模版合约"
                      selectedKeys={[formData.contract]}
                      onChange={(e) => setFormData(prev => ({ ...prev, contract: e.target.value }))}
                      isDisabled={isView}
                      isRequired
                      errorMessage={errors.contract}
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
                          errors.contract && "border-danger"
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
                      {contractOptions.map((contract) => (
                        <SelectItem key={contract.name} value={contract.name}>
                          {contract.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* URL配置组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">URL配置</h4>
                  <div className="space-y-4">
                    {renderUrlInput("根据高度查询URL", "heightQueryUrl", "请输入根据高度查询的URL")}
                    {renderUrlInput("根据hash查询URL", "hashQueryUrl", "请输入根据hash查询的URL")}
                    {renderUrlInput("溯源URL", "traceUrl", "请输入溯源URL")}
                    {renderUrlInput("精准查询URL", "preciseQueryUrl", "请输入精准查询URL")}
                    {renderUrlInput("模糊搜索URL", "fuzzySearchUrl", "请输入模糊搜索URL")}
                    {renderUrlInput("获取区块链信息URL", "blockchainInfoUrl", "请输入获取区块链信息URL")}
                    {renderUrlInput("数据上链URL", "uploadUrl", "请输入数据上链URL")}
                    {renderUrlInput("根据交易hash获取交易URL", "txHashQueryUrl", "请输入根据交易hash获取交易URL")}
                    {renderUrlInput("根据交易hash获取交易所在区块URL", "txBlockQueryUrl", "请输入根据交易hash获取区块URL")}
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