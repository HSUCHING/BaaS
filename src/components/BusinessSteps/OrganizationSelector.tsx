import React, { useState } from "react";
import { Card, Button, Input, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { PlusIcon } from "@/components/icons";

const ORGANIZATION_TYPES = [
  {
    id: 1,
    name: "政府机构",
    description: "适用于各级政府部门、事业单位等",
  },
  {
    id: 2,
    name: "企业",
    description: "适用于各类企业、公司等",
  },
  {
    id: 3,
    name: "金融机构",
    description: "适用于银行、保险、证券等金融机构",
  },
];

interface NewOrg {
  name: string;
  type: string;
  description: string;
}

export default function OrganizationSelector() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOrgs, setSelectedOrgs] = useState<number[]>([]);
  const [organizations, setOrganizations] = useState(ORGANIZATION_TYPES);
  const [newOrg, setNewOrg] = useState<NewOrg>({
    name: "",
    type: "",
    description: "",
  });


  const handleCheckboxChange = (orgId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOrgs([...selectedOrgs, orgId]);
    } else {
      setSelectedOrgs(selectedOrgs.filter(id => id !== orgId));
    }
  };

  const handleAddOrg = () => {
    if (newOrg.name && newOrg.type) {
      const newOrgId = organizations.length + 1;
      setOrganizations([
        ...organizations,
        {
          id: newOrgId,
          name: newOrg.name,
          description: newOrg.description || `${newOrg.type}类型组织`,
        },
      ]);
      setNewOrg({ name: "", type: "", description: "" });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">选择参与组织</h3>

      <div className="grid grid-cols-2 gap-4">
        {organizations.map((org) => (
          <Card key={org.id} className="bg-default-100">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white">{org.name}</h4>
                  <p className="text-sm text-default-500">{org.description}</p>
                </div>
                <Checkbox
                  isSelected={selectedOrgs.includes(org.id)}
                  onValueChange={(isSelected) => handleCheckboxChange(org.id, isSelected)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        color="primary"
        variant="solid"
        className="mt-4"
        startContent={<PlusIcon className="w-4 h-4" />}
        onPress={onOpen}
      >
        添加新组织
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        className="dark"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>添加新组织</ModalHeader>
              <ModalBody>
                <Input
                  label="组织名称"
                  placeholder="输入组织名称"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                />
                <Select
                  label="组织类型"
                  placeholder="选择组织类型"
                  selectedKeys={newOrg.type ? [newOrg.type] : []}
                  popoverProps={{
                    classNames: {
                      base: "dark",
                      content: "dark bg-[#18181b]"
                    }
                  }}
                  onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value })}
                >
                  <SelectItem key="government" value="政府机构">政府机构</SelectItem>
                  <SelectItem key="enterprise" value="企业">企业</SelectItem>
                  <SelectItem key="finance" value="金融机构">金融机构</SelectItem>
                </Select>
                <Input
                  label="组织描述"
                  placeholder="输入组织描述（选填）"
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={() => {
                  handleAddOrg();
                  onClose();
                }}>
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