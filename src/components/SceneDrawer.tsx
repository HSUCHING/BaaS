"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface SceneData {
  id?: number;
  name: string;
  link: string;
  subchain: string;
}

interface SceneDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  data?: SceneData;
  onSubmit?: (data: SceneData) => void;
}

// 模拟的子链列表数据
const subchainOptions = [
  { id: 1, name: "子链A" },
  { id: 2, name: "子链B" },
  { id: 3, name: "子链C" },
];

export default function SceneDrawer({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
}: SceneDrawerProps) {
  const isView = mode === "view";
  const [mounted, setMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [formData, setFormData] = React.useState<SceneData>({
    name: "",
    link: "",
    subchain: "",
  });
  
  // 错误提示状态
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    name?: string;
    link?: string;
    subchain?: string;
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
        link: "",
        subchain: "",
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
      link?: string;
      subchain?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "场景名称不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.link.trim()) {
      newErrors.link = "场景链接不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    } else if (!/^https?:\/\/.+/.test(formData.link)) {
      newErrors.link = "请输入有效的URL地址";
      setErrorMessage("请输入有效的URL地址");
      setShowError(true);
    }

    if (!formData.subchain) {
      newErrors.subchain = "请选择子链";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[199] bg-black/50 backdrop-blur-sm
          transition-opacity duration-500
          ${isReady ? "opacity-100" : "opacity-0"}
        `}
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
              {mode === 'create' ? '新建场景' : mode === 'edit' ? '编辑场景' : '查看场景'}
            </h3>
            <Button
              isIconOnly
              variant="light"
              onPress={handleClose}
            >
              <XMarkIcon className="w-5 h-5 text-white/90" />
            </Button>
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
                      label="场景名称"
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
                      label="场景链接"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.link}
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
                          errors.link && "border-danger"
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