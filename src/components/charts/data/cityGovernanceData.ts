export const cityGovernanceData = {
  name: "城市治理",
  children: [
    {
      name: "智慧政务",
      children: [
        {
          name: "行政审批",
          children: [
            { name: "企业注册", value: 20 },
            { name: "证照办理", value: 15 },
            { name: "项目审批", value: 25 }
          ]
        },
        {
          name: "公共服务",
          children: [
            { name: "社会保障", value: 30 },
            { name: "医疗卫生", value: 25 },
            { name: "教育服务", value: 20 }
          ]
        }
      ]
    },
    {
      name: "城市管理",
      children: [
        {
          name: "环境监测",
          children: [
            { name: "空气质量", value: 15 },
            { name: "水质监测", value: 12 },
            { name: "噪声监测", value: 8 }
          ]
        },
        {
          name: "市政设施",
          children: [
            { name: "道路维护", value: 18 },
            { name: "排水系统", value: 15 },
            { name: "照明设施", value: 10 }
          ]
        }
      ]
    },
    {
      name: "公共安全",
      children: [
        {
          name: "应急管理",
          children: [
            { name: "灾害预警", value: 22 },
            { name: "应急响应", value: 18 },
            { name: "救援调度", value: 15 }
          ]
        },
        {
          name: "治安防控",
          children: [
            { name: "视频监控", value: 20 },
            { name: "警情分析", value: 16 },
            { name: "社区防控", value: 14 }
          ]
        }
      ]
    },
    {
      name: "交通出行",
      children: [
        {
          name: "公共交通",
          children: [
            { name: "公交运营", value: 25 },
            { name: "地铁管理", value: 30 },
            { name: "共享出行", value: 15 }
          ]
        },
        {
          name: "交通管理",
          children: [
            { name: "信号控制", value: 20 },
            { name: "停车管理", value: 18 },
            { name: "车流监测", value: 16 }
          ]
        }
      ]
    }
  ]
}; 