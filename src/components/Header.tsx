'use client'
import { MagnifyingGlassIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger, Chip } from '@nextui-org/react'
import { MessageIcon } from '@/components/icons'

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="pt-8 px-6 pb-2 bg-[#1C1C1E]">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center gap-2 bg-[#2C2C2E] rounded-lg px-3 py-2 w-[280px]">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Active Tasks..." 
            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none w-full"
          />
          <MicrophoneIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          <Popover 
            isOpen={isNotificationOpen}
            onOpenChange={setIsNotificationOpen}
            placement="bottom-end"
          >
            <PopoverTrigger>
              <div className="relative cursor-pointer">
                <BellIcon className="w-6 h-6 text-gray-400 hover:text-gray-300 transition-colors" />
                <Chip
                  size="sm"
                  color="primary"
                  variant="dot"
                  className="absolute -top-[5px] -right-[20px] min-w-unit-4 h-unit-4 border-none"
                >
                  5
                </Chip>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[360px] p-0 bg-[#1C1C1E] shadow-xl">
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-white">消息通知</h3>
                  <Button
                    size="sm"
                    variant="light"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    全部已读
                  </Button>
                </div>
              </div>
              <div className="max-h-[480px] message-scroll overflow-y-auto">
                <div className="space-y-3 p-6">
                  {[
                    { title: "系统升级通知", desc: "系统将于今晚进行例行维护更新", time: "5分钟前", type: "primary" },
                    { title: "节点异常警告", desc: "检测到3个节点响应超时，请及时检查", time: "30分钟前", type: "warning" },
                    { title: "新合约部署成功", desc: "智能合约 #2389 已成功部署到主网", time: "2小时前", type: "success" },
                    { title: "性能监控提醒", desc: "系统负载已超过预警阈值", time: "4小时前", type: "warning" },
                    { title: "安全更新提示", desc: "发现新的安全补丁可用", time: "6小时前", type: "primary" }
                  ].map((msg, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#2C2C2E] transition-colors cursor-pointer"
                    >
                      <MessageIcon className={`w-5 h-5 mt-1 text-${msg.type}-500 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1">{msg.title}</p>
                        <p className="text-sm text-gray-400 mb-1 line-clamp-2">{msg.desc}</p>
                        <p className="text-xs text-gray-500">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-700">
                <Button
                  size="sm"
                  variant="flat"
                  className="w-full text-sm text-white bg-[#2C2C2E] hover:bg-[#3C3C3E]"
                >
                  查看全部消息
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <button className="p-2 hover:bg-[#2C2C2E] rouned-full transition-colors">
            <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
          </button>
          <div className="select-none cursor-pointer">
            <img 
              src="/img/profile.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 