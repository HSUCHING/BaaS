"use client";
import { useState } from 'react';
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/pages/Dashboard'
import ChainCenter from '@/pages/ChainCenter'
import OrganizationCenter from '@/pages/OrganizationCenter'
import NodeCenter from '@/pages/NodeCenter';
import SortNodeCenter from '@/pages/SortNodeCenter';
import ChannelCenter from '@/pages/ChannelCenter';
import ContractCenter from '@/pages/ContractCenter';
import APICenter from '@/pages/APICenter';
import UserCenter from '@/pages/UserCenter';
import SceneCenter from '@/pages/SceneCenter';
import Homepage from '@/pages/Homepage';
// 导入天气图标样式
import '@/styles/weather-icons.css';

export default function Home() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home')
    // 渲染当前页面内容
    const renderContent = () => {
      switch(currentPage) {
        case 'chain-center':
          return <ChainCenter />
        case 'orgnization-center':
            return <OrganizationCenter />
        case 'node-center':
          return <NodeCenter />
        case 'ordernode-center':
            return <SortNodeCenter />
        case 'channel-center':
            return <ChannelCenter />
        case 'contract-center':
            return <ContractCenter />
        case 'api-center':
          return <APICenter />
        case 'user-center':
          return <UserCenter />
        case 'scene-center':
          return <SceneCenter />
        case 'home':
          return <Homepage />
        default:
          return <Dashboard />
      }
    }

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        setCurrentPage={setCurrentPage}  // 添加这个 prop
      />
      <main className={`dark transition-all duration-300 ${
        isSidebarExpanded ? "ml-64" : "ml-16"
      }`}>
        <Header />
        {renderContent()}
      </main>
    </div>
  )
}
