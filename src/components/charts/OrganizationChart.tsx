import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { organizationData, getOrganizations } from './data/organizationData';

const gradients = [
  {
    id: 'gradient1',
    color: '#00ADFA',
    lightColor: '#33BFFB'
  },
  {
    id: 'gradient2',
    color: '#7B7EF7',
    lightColor: '#9598FF'
  },
  {
    id: 'gradient3',
    color: '#D37BDD',
    lightColor: '#E191E7'
  },
  {
    id: 'gradient4',
    color: '#9D7EF8',
    lightColor: '#B79AFF'
  },
  {
    id: 'gradient5',
    color: '#F4BE6A',
    lightColor: '#FFD388'
  },
  {
    id: 'gradient6',
    color: '#E67373',
    lightColor: '#FF8E8E'
  }
];

export const OrganizationChart: React.FC = () => {
  const organizations = getOrganizations();

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={organizationData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          {gradients.map((grad) => (
            <linearGradient
              key={grad.id}
              id={grad.id}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={grad.lightColor}
                stopOpacity={0.9}
              />
              <stop
                offset="95%"
                stopColor={grad.color}
                stopOpacity={0.9}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="#ffffff60"
          tick={{ fill: "#ffffff80", fontSize: 12 }}
          axisLine={{ stroke: "#ffffff20" }}
        />
        <YAxis
          stroke="#ffffff60"
          tick={{ fill: "#ffffff80", fontSize: 12 }}
          axisLine={{ stroke: "#ffffff20" }}
          label={{
            value: "场景数量",
            angle: -90,
            position: "insideLeft",
            fill: "#ffffff80",
            fontSize: 12,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
          labelStyle={{ 
            color: "#ffffff", 
            marginBottom: "4px",
            fontWeight: "500"
          }}
          itemStyle={{ 
            color: "#ffffff", 
            opacity: 0.8,
            fontSize: "12px"
          }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: "12px" }}
        />
        {organizations.map((org, index) => (
          <Bar
            key={org}
            dataKey={org}
            stackId="a"
            fill={`url(#gradient${index + 1})`}
            name={org}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}; 