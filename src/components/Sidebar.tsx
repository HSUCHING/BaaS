"use client";
import React, { useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  LinkIcon,
  QueueListIcon,
  UserCircleIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  DocumentIcon,
  CogIcon,
  ArrowsUpDownIcon,
  MoonIcon,
  CubeTransparentIcon
} from "@heroicons/react/24/outline";
import Logo from "./Logo";

const menuItems = [
  { icon: HomeIcon, label: "主页", key: "home" },
  { icon: ChartBarIcon, label: "可视化", key: "visualization" },
  { icon: LinkIcon, label: "子链列表", key: "chain-center" },
  { icon: UserGroupIcon, label: "组织管理", key: "orgnization-center" },
  { icon: SquaresPlusIcon, label: "节点管理", key: "node-center" },
  { icon: QueueListIcon, label: "排序节点管理", key: "ordernode-center" },
  { icon: ArrowPathIcon, label: "通道管理", key: "channel-center" },
  { icon: DocumentIcon, label: "智能合约管理", key: "contract-center" },
  { icon: ArrowsUpDownIcon, label: "接口管理", key: "api-center" },
  { icon: UserCircleIcon, label: "用户管理", key: "user-center" },
  { icon: CubeTransparentIcon, label: "场景赋能管理", key: "scene-center" },
];

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  setCurrentPage: (page: string) => void;
}


export default function Sidebar({ isExpanded, setIsExpanded, setCurrentPage }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (key: string) => {
    setActiveItem(key)
    setCurrentPage(key)  // 更新当前页面
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen backdrop-blur-xs shadow-card transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="w-full pt-9">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-8 hover:text-gold transition-colors duration-200 focus:outline-none focus:ring-0"
        >
          <Logo isExpanded={isExpanded} />
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const isActive = activeItem === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              title={item.label}
              className={`
                w-full 
                flex 
                items-center 
                px-4 
                py-3 
                transition-all 
                duration-200
                hover:bg-[#19191B]
                ${isActive ? "text-gold" : "text-secondary"}
              `}
            >
              <item.icon
                className={`min-w-6 w-6 h-6 ${isActive ? "text-gold" : ""}`}
              />
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-8 w-full">
        <button
          className={`
            w-full 
            flex 
            items-center 
            px-4 
            py-3 
            transition-all 
            duration-200
            hover:bg-[#2C2C2E]
            text-secondary
          `}
        >
          <CogIcon className="min-w-6 w-6 h-6" />
          <span
            className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
            }`}
          >
            设置
          </span>
        </button>
        <button
          className={`
            w-full 
            flex 
            items-center 
            px-4 
            py-3 
            transition-all 
            duration-200
            hover:bg-[#2C2C2E]
            text-secondary
          `}
        >
          <MoonIcon className="min-w-6 w-6 h-6" />
          <span
            className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
            }`}
          >
            深色模式
          </span>
        </button>
      </div>
    </div>
  );
}
