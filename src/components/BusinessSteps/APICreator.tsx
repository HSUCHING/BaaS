import React, { useState } from "react";
import { Input, Select, SelectItem, Switch, Button, Textarea, Card, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { PlusIcon, DeleteIcon } from "@/components/icons";

interface ParamField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface APISchema {
  name: string;
  method: string;
  path: string;
  requestParams: {
    headers: ParamField[];
    query: ParamField[];
    body: ParamField[];
  };
  responseSchema: {
    success: ParamField[];
    error: ParamField[];
  };
  requiresAuth: boolean;
}

export default function APICreator() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [api, setApi] = useState<APISchema>({
    name: "",
    method: "",
    path: "",
    requestParams: {
      headers: [],
      query: [],
      body: []
    },
    responseSchema: {
      success: [],
      error: []
    },
    requiresAuth: true
  });

  const [activeTab, setActiveTab] = useState("headers");
  const [activeSection, setActiveSection] = useState<"request" | "response">("request");
  const [activeResponseTab, setActiveResponseTab] = useState<"success" | "error">("success");
  const [newParam, setNewParam] = useState<ParamField>({
    name: "",
    type: "string",
    required: false,
    description: ""
  });

  const paramTypes = [
    { key: "string", label: "字符串" },
    { key: "number", label: "数字" },
    { key: "boolean", label: "布尔值" },
    { key: "object", label: "对象" },
    { key: "array", label: "数组" },
    { key: "date", label: "日期" }
  ];

  const handleAddParam = () => {
    if (!newParam.name) return;

    if (activeSection === "request") {
      setApi({
        ...api,
        requestParams: {
          ...api.requestParams,
          [activeTab]: [...api.requestParams[activeTab as keyof typeof api.requestParams], newParam]
        }
      });
    } else {
      setApi({
        ...api,
        responseSchema: {
          ...api.responseSchema,
          [activeResponseTab]: [...api.responseSchema[activeResponseTab], newParam]
        }
      });
    }

    setNewParam({
      name: "",
      type: "string",
      required: false,
      description: ""
    });
    onOpenChange();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">创建服务接口</h3>

      <form className="space-y-6">
        <Input
          label="API名称"
          placeholder="输入API名称"
          variant="bordered"
          value={api.name}
          onChange={(e) => setApi({ ...api, name: e.target.value })}
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Select
          label="请求方法"
          placeholder="选择HTTP方法"
          variant="bordered"
          value={api.method}
          onChange={(e) => setApi({ ...api, method: e.target.value })}
          classNames={{
            label: "text-default-500",
            value: "text-white",
          }}
        >
          <SelectItem key="get" value="GET">GET</SelectItem>
          <SelectItem key="post" value="POST">POST</SelectItem>
          <SelectItem key="put" value="PUT">PUT</SelectItem>
          <SelectItem key="delete" value="DELETE">DELETE</SelectItem>
        </Select>

        <Input
          label="路径"
          placeholder="/api/v1/..."
          variant="bordered"
          value={api.path}
          onChange={(e) => setApi({ ...api, path: e.target.value })}
          classNames={{
            label: "text-default-500",
            input: "text-white",
          }}
        />

        <Card className="p-4 bg-default-100">
          <h4 className="text-white mb-4">请求参数</h4>
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={activeTab === "headers" ? "solid" : "light"}
              onPress={() => setActiveTab("headers")}
            >
              头部
            </Button>
            <Button
              size="sm"
              variant={activeTab === "query" ? "solid" : "light"}
              onPress={() => setActiveTab("query")}
            >
              请求参数
            </Button>
            <Button
              size="sm"
              variant={activeTab === "body" ? "solid" : "light"}
              onPress={() => setActiveTab("body")}
            >
              请求体
            </Button>
          </div>

          <div className="space-y-2">
            {api.requestParams[activeTab as keyof typeof api.requestParams].map((param, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-default-200 rounded">
                <div>
                  <span className="text-white">{param.name}</span>
                  <Chip size="sm" className="ml-2">{param.type}</Chip>
                  {param.required && <Chip color="danger" size="sm" className="ml-2">必填</Chip>}
                </div>
                <Button
                  size="sm"
                  isIconOnly
                  color="danger"
                  variant="light"
                  onPress={() => {
                    const newParams = [...api.requestParams[activeTab as keyof typeof api.requestParams]];
                    newParams.splice(index, 1);
                    setApi({
                      ...api,
                      requestParams: {
                        ...api.requestParams,
                        [activeTab]: newParams
                      }
                    });
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <Button
            size="sm"
            color="primary"
            variant="light"
            startContent={<PlusIcon />}
            className="mt-4"
            onPress={() => {
              setActiveSection("request");
              onOpen();
            }}
          >
            添加参数
          </Button>
        </Card>

        <Card className="p-4 bg-default-100">
          <h4 className="text-white mb-4">响应格式</h4>
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="solid"
              color={activeResponseTab === "success" ? "success" : "default"}
              onPress={() => setActiveResponseTab("success")}
            >
              成功响应
            </Button>
            <Button
              size="sm"
              variant="solid"
              color={activeResponseTab === "error" ? "danger" : "default"}
              onPress={() => setActiveResponseTab("error")}
            >
              错误响应
            </Button>
          </div>

          <div className="space-y-2">
            {api.responseSchema[activeResponseTab].map((param, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-default-200 rounded">
                <div>
                  <span className="text-white">{param.name}</span>
                  <Chip size="sm" className="ml-2">{param.type}</Chip>
                  {param.required && <Chip color="danger" size="sm" className="ml-2">必填</Chip>}
                </div>
                <Button
                  size="sm"
                  isIconOnly
                  color="danger"
                  variant="light"
                  onPress={() => {
                    const newParams = [...api.responseSchema[activeResponseTab]];
                    newParams.splice(index, 1);
                    setApi({
                      ...api,
                      responseSchema: {
                        ...api.responseSchema,
                        [activeResponseTab]: newParams
                      }
                    });
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <Button
            size="sm"
            color="primary"
            variant="light"
            startContent={<PlusIcon />}
            className="mt-4"
            onPress={() => {
              setActiveSection("response");
              onOpen();
            }}
          >
            添加响应字段
          </Button>
        </Card>

        <div className="flex justify-between items-center truncate">
          <span className="text-default-500">需要认证</span>
          <Switch
            defaultSelected
            value={api.requiresAuth}
            onChange={(e) => setApi({ ...api, requiresAuth: e.target.checked })}
          />
        </div>
      </form>

      <Button
        color="primary"
        className="mt-4"
        startContent={<PlusIcon className="w-4 h-4" />}
      >
        保存接口
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        className="dark"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {activeSection === "request" ? "添加请求参数" : "添加响应字段"}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="参数名称"
                  placeholder="输入参数名称"
                  value={newParam.name}
                  onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
                />
                <Select
                  label="参数类型"
                  placeholder="选择参数类型"
                  selectedKeys={[newParam.type]}
                  popoverProps={{
                    classNames: {
                      base: "dark",
                      content: "dark bg-[#18181b]"
                    }
                  }}
                  onChange={(e) => setNewParam({ ...newParam, type: e.target.value })}
                >
                  {paramTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
                <Switch
                  isSelected={newParam.required}
                  onValueChange={(checked) => setNewParam({ ...newParam, required: checked })}
                >
                  必填参数
                </Switch>
                <Textarea
                  label="参数描述"
                  placeholder="输入参数描述"
                  value={newParam.description}
                  onChange={(e) => setNewParam({ ...newParam, description: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={handleAddParam}>
                  添加
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 