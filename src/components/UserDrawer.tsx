"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UserData {
  id?: number;
  username: string;
  password: string;
  name: string;
  role: string;
  department: string;
}

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  data?: UserData;
  onSubmit?: (data: UserData) => void;
}

// 模拟的角色列表数据
const roleOptions = [
  { id: 1, name: "管理员" },
  { id: 2, name: "普通用户" },
  { id: 3, name: "访客" },
];

// 模拟的局办列表数据
const departmentOptions = [
  { id: 1, name: "技术部" },
  { id: 2, name: "运营部" },
  { id: 3, name: "市场部" },
];

export default function UserDrawer({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit,
}: UserDrawerProps) {
  const isView = mode === "view";
  const [mounted, setMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [formData, setFormData] = React.useState<UserData>({
    username: "",
    password: "",
    name: "",
    role: "",
    department: "",
  });
  
  // 错误提示状态
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{
    username?: string;
    password?: string;
    name?: string;
    role?: string;
    department?: string;
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
        username: "",
        password: "",
        name: "",
        role: "",
        department: "",
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
      username?: string;
      password?: string;
      name?: string;
      role?: string;
      department?: string;
    } = {};

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = "密码不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.role) {
      newErrors.role = "请选择角色";
      setErrorMessage("请填写必填字段");
      setShowError(true);
    }

    if (!formData.department) {
      newErrors.department = "请选择局办";
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
              {mode === 'create' ? '新建用户' : mode === 'edit' ? '编辑用户' : '用户详情'}
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
                      label="用户名"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      isReadOnly={isView}
                      isRequired
                      errorMessage={errors.username}
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
                          errors.username && "border-danger"
                        ].join(" "),
                        errorMessage: "text-danger"
                      }}
                    />
                    {(mode === 'create' || mode === 'edit') && (
                      <Input
                        label={mode === 'create' ? "密码" : "新密码（不修改请留空）"}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        isRequired={mode === 'create'}
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
                    )}
                    <Input
                      label="姓名"
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
                      label="角色"
                      selectedKeys={[formData.role]}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      isDisabled={isView}
                      isRequired
                      errorMessage={errors.role}
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
                          errors.role && "border-danger"
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
                      {roleOptions.map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="局办"
                      selectedKeys={[formData.department]}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      isDisabled={isView}
                      isRequired
                      errorMessage={errors.department}
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
                          errors.department && "border-danger"
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
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept.name} value={dept.name}>
                          {dept.name}
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