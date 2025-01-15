import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";

interface Step {
  id: number;
  title: string;
  subtitle?: string;
  status: "complete" | "current" | "pending";
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  children: React.ReactNode;
  onComplete?: () => void;
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  children,
  onComplete,
}: StepperProps) {
  // 计算每个步骤的状态
  const getStepStatus = (stepId: number): "complete" | "current" | "pending" => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="flex gap-8 min-h-[600px]">
      {/* 左侧步骤导航 */}
      <div className="w-64 shrink-0">
        <div className="relative flex flex-col gap-1">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="relative">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  className={cn(
                    "flex items-start gap-4 w-full p-4 rounded-lg transition-all",
                    "hover:bg-default-100",
                    status === "current" && "bg-default-100"
                  )}
                >
                  {/* 步骤序号圆圈 */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      "border-2 text-sm font-medium",
                      status === "complete" &&
                        "bg-green-500/20 border-green-500 text-green-500",
                      status === "current" &&
                        "bg-blue-500/20 border-blue-500 text-blue-500",
                      status === "pending" &&
                        "bg-default-100 border-default-200 text-default-500"
                    )}
                  >
                    {status === "complete" ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* 步骤文本 */}
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        status === "complete" && "text-green-500",
                        status === "current" && "text-white",
                        status === "pending" && "text-default-500"
                      )}
                    >
                      {step.title}
                    </span>
                    {step.subtitle && (
                      <span className="text-xs text-default-500">
                        {step.subtitle}
                      </span>
                    )}
                  </div>
                </button>

                {/* 连接线 - 根据状态更新颜色 */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-8 top-[48px] ml-[-1px] w-0.5 h-[2.5em] -translate-x-1/2 z-10",
                      status === "complete" 
                        ? "bg-green-500" // 已完成的步骤连接线使用绿色
                        : "bg-default-200" // 未完成的步骤保持原来的颜色
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="relative flex-1 p-6 bg-default-50 rounded-lg">
        {/* 内容区域 - 添加最大高度和滚动 */}
        <div className="flex-1 max-h-[calc(100vh-240px)] overflow-y-auto mb-20">
          {children}
        </div>

        {/* 底部导航按钮 */}
        <div className="absolute bottom-0 right-0 left-0 p-6 bg-default-50">
          <div className="flex justify-between items-center">
            <Button
              variant="flat"
              color="default"
              onPress={() => onStepClick?.(currentStep - 1)}
              isDisabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
              startContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              }
            >
              上一步
            </Button>

            <Button
              color="primary"
              onPress={() => {
                if (currentStep === steps.length) {
                  onComplete?.();
                } else {
                  // 否则继续下一步
                  onStepClick?.(currentStep + 1);
                }
              }}
              endContent={
                currentStep < steps.length ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )
              }
            >
              {currentStep < steps.length ? "下一步" : "完成"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
