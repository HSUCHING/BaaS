import React, { useState } from "react";
import { Card, Button, Input, Checkbox, Select, SelectItem } from "@nextui-org/react";
import {
  PlusIcon
} from "@/components/icons";

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

export default function OrganizationSelector() {
  const [selectedOrgs, setSelectedOrgs] = useState<number[]>([]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">选择参与组织</h3>

      <div className="grid grid-cols-2 gap-4">
        {ORGANIZATION_TYPES.map((org) => (
          <Card
            key={org.id}
            className="bg-default-100"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white">{org.name}</h4>
                  <p className="text-sm text-default-500">{org.description}</p>
                </div>
                <Checkbox
                  isSelected={selectedOrgs.includes(org.id)}
                  onChange={(isSelected) => {
                    if (isSelected) {
                      setSelectedOrgs([...selectedOrgs, org.id]);
                    } else {
                      setSelectedOrgs(selectedOrgs.filter(id => id !== org.id));
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        color="primary"
        className="mt-4"
        startContent={<PlusIcon className="w-4 h-4" />}
      >
        添加新组织
      </Button>
    </div>
  );
} 