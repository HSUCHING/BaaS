export interface OrganizationData {
  month: string;
  [key: string]: number | string;
}

export const organizationData: OrganizationData[] = [
  {
    month: "1月",
    "发改委": 12,
    "公安局": 8,
    "交通局": 15,
    "环保局": 10,
    "城管局": 6,
    "应急管理局": 9,
  },
  {
    month: "2月",
    "发改委": 15,
    "公安局": 10,
    "交通局": 12,
    "环保局": 8,
    "城管局": 7,
    "应急管理局": 11,
  },
  {
    month: "3月",
    "发改委": 18,
    "公安局": 12,
    "交通局": 14,
    "环保局": 11,
    "城管局": 9,
    "应急管理局": 13,
  },
  {
    month: "4月",
    "发改委": 20,
    "公安局": 15,
    "交通局": 16,
    "环保局": 13,
    "城管局": 8,
    "应急管理局": 12,
  },
  {
    month: "5月",
    "发改委": 22,
    "公安局": 18,
    "交通局": 19,
    "环保局": 15,
    "城管局": 10,
    "应急管理局": 14,
  },
  {
    month: "6月",
    "发改委": 25,
    "公安局": 20,
    "交通局": 22,
    "环保局": 17,
    "城管局": 12,
    "应急管理局": 16,
  },
  {
    month: "7月",
    "发改委": 28,
    "公安局": 22,
    "交通局": 24,
    "环保局": 19,
    "城管局": 14,
    "应急管理局": 18,
  },
  {
    month: "8月",
    "发改委": 30,
    "公安局": 25,
    "交通局": 26,
    "环保局": 21,
    "城管局": 16,
    "应急管理局": 20,
  },
  {
    month: "9月",
    "发改委": 32,
    "公安局": 28,
    "交通局": 28,
    "环保局": 23,
    "城管局": 18,
    "应急管理局": 22,
  },
  {
    month: "10月",
    "发改委": 35,
    "公安局": 30,
    "交通局": 30,
    "环保局": 25,
    "城管局": 20,
    "应急管理局": 24,
  },
  {
    month: "11月",
    "发改委": 38,
    "公安局": 32,
    "交通局": 32,
    "环保局": 27,
    "城管局": 22,
    "应急管理局": 26,
  },
  {
    month: "12月",
    "发改委": 40,
    "公安局": 35,
    "交通局": 35,
    "环保局": 30,
    "城管局": 25,
    "应急管理局": 28,
  }
];

export const getOrganizations = () => {
  const firstMonth = organizationData[0];
  return Object.keys(firstMonth).filter(key => key !== 'month');
}; 