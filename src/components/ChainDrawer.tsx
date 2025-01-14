"use client";
import React from "react";
import { Input, Button, Select, SelectItem, Textarea } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChainData {
  id?: number;
  name: string;
  ip: string;
  password: string;
  status: string;
  os: string;
  description: string;
}

interface ChainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  data?: ChainData;
  onSubmit?: (data: ChainData) => void;
}

export default function ChainDrawer({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
}: ChainDrawerProps) {
  const [formData, setFormData] = React.useState<ChainData>({
    name: "",
    ip: "",
    password: "",
    status: "active",
    os: "ubuntu",
    description: "",
  });

  // 添加错误状态
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    name?: string;
    ip?: string;
    password?: string;
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
        ip: "",
        password: "",
        status: "active",
        os: "ubuntu",
        description: "",
      });
    }
    clearErrors();
  }, [data, mode]);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      ip?: string;
      password?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "子链名称不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.ip.trim()) {
      newErrors.ip = "IP地址不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip)) {
      newErrors.ip = "请输入有效的IP地址";
      setErrorMessage("请填写正确的IP地址格式");
      setShowError(true);
    }

    if (!formData.password.trim()) {
      newErrors.password = "密码不能为空";
      setErrorMessage("请填写必填字段");
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

  React.useEffect(() => {
    console.log("ChainDrawer mounted");
    console.log("Props:", { isOpen, mode, data });
  }, [isOpen, mode, data]);

  const [mounted, setMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

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

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[199] transition-opacity
        `}
        style={{ 
            transitionDuration: '500ms'  // 直接在 style 中设置过渡时间
          }}
        onClick={onClose}
      />

      {/* Drawer with enhanced slide animation */}
      <div
        className={`
          fixed top-0 right-0 w-[50%] h-screen bg-[#18181b] z-[200] shadow-2xl
          transition-all ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isReady ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ 
          transitionDuration: '500ms'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header - 优化标题区域 */}
          <div className="flex-none px-8 h-16 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white tracking-wide">
              {mode === 'create' ? '新建子链' : mode === 'edit' ? '编辑子链' : '子链详情'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>
          
          {/* Content - 优化表单布局 */}
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
                      label="子链名称"
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
                      label="IP 地址"
                      value={formData.ip}
                      onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.ip}
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
                          errors.ip && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    <Input
                      label="主机root账户密码"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.password}
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
                          errors.password && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                  </div>
                </div>

                {/* 安全配置组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">安全配置</h4>
                  <div className="space-y-4">
                    <Input
                      label="主机root账户密码"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      isReadOnly={isView}
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
                          "backdrop-blur-sm"
                        ].join(" "),
                      }}
                    />
                  </div>
                </div>

                {/* 系统设置组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">系统设置</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="状态"
                      selectedKeys={[formData.status]}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      isDisabled={isView}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        trigger: [
                          "bg-white/5",
                          "border-white/10",
                          "data-[hover=true]:border-white/30",
                          "shadow-xl",
                          "backdrop-blur-sm"
                        ].join(" "),
                        value: "text-white"
                      }}
                      popoverProps={{
                        classNames: {
                          base: "dark",  // 使用 NextUI 的深色主题
                          content: "dark bg-[#18181b]"
                        }
                      }}
                    >
                      <SelectItem key="active">运行中</SelectItem>
                      <SelectItem key="inactive">已停止</SelectItem>
                      <SelectItem key="vacation">空闲中</SelectItem>
                    </Select>
                    <Select
                      label="操作系统"
                      selectedKeys={[formData.os]}
                      onChange={(e) => setFormData(prev => ({ ...prev, os: e.target.value }))}
                      isDisabled={isView}
                      variant="bordered"
                      classNames={{
                        base: "max-w-full",
                        label: "text-white/90 font-normal",
                        trigger: [
                          "bg-white/5",
                          "border-white/10",
                          "data-[hover=true]:border-white/30",
                          "shadow-xl",
                          "backdrop-blur-sm"
                        ].join(" "),
                        value: "text-white"
                      }}
                      popoverProps={{
                        classNames: {
                          base: "dark",  // 使用 NextUI 的深色主题
                          content: "dark bg-[#18181b]"
                        }
                      }}
                    >
                      <SelectItem key="ubuntu">Ubuntu</SelectItem>
                      <SelectItem key="centos">CentOS</SelectItem>
                    </Select>
                  </div>
                </div>

                {/* 备注信息组 */}
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">备注信息</h4>
                  <Textarea
                    label="描述"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    isReadOnly={isView}
                    variant="bordered"
                    classNames={{
                      base: "max-w-full",
                      label: "text-white/90 font-normal",
                      input: ["text-white", "placeholder:text-white/60", "min-h-[100px]"].join(" "),
                      inputWrapper: [
                        "bg-white/5",
                        "border-white/10",
                        "group-data-[focus=true]:border-white/30",
                        "hover:border-white/20",
                        "!cursor-text",
                        "shadow-xl",
                        "backdrop-blur-sm"
                      ].join(" "),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer - 优化按钮区域 */}
          <div className="flex-none px-8 h-20 border-t border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-end space-x-4">
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose}
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
