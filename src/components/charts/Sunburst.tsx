import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cityGovernanceData } from './data/cityGovernanceData';

interface SunburstProps {
  width?: number;
  height?: number;
}

export const Sunburst: React.FC<SunburstProps> = ({ width = 928, height = 928 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const radius = width / 6;
    
    // 使用更清新明亮的颜色方案
    const colorScheme = [
      '#36CFC9',  // 清新青色
      '#73D13D',  // 明亮绿色
      '#40A9FF',  // 天空蓝
      '#9254DE',  // 淡紫色
      '#FFA940',  // 温暖橙色
      '#FF7A45',  // 珊瑚色
      '#FF4D4F',  // 玫瑰红
      '#FFB72B',  // 金黄色
      '#4FAAFF',  // 海洋蓝
      '#36B37E',  // 薄荷绿
    ];
    
    // 创建颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(cityGovernanceData.children.map(d => d.name))
      .range(colorScheme);
    
    // Create hierarchy
    const hierarchy = d3.hierarchy(cityGovernanceData)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));
    
    // Create partition layout
    const root = d3.partition()
      .size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
    
    root.each((d: any) => d.current = d);
    
    // Create arc generator
    const arc = d3.arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d: any) => d.y0 * radius)
      .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1));
    
    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, width])
      .style("font", "10px sans-serif");

    // 1. 首先创建渐变定义
    const gradient = svg.append("defs")
      .append("radialGradient")
      .attr("id", "aurora-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("cx", "0")
      .attr("cy", "0")
      .attr("r", radius);

    // 添加渐变色停止点，使用 rgba 来控制透明度
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(79, 172, 254, 0.8)");  // 降低透明度的蓝色

    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "rgba(0, 242, 254, 0.7)");  // 降低透明度的青色

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(168, 237, 234, 0.7)");  // 降低透明度的淡青色

    // 2. 创建路径
    const path = svg.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        let current: any = d;
        while (current.depth > 1) current = current.parent;
        return color(current.data.name);
      })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.7 : 0.6) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
      .attr("d", d => arc(d.current));

    // 添加事件处理
    path.on("mouseover", function(event, d: any) {
        // 显示中央文本，使用节点的 value 值
        updateCenterText(d.data.name, d.value, true);
      })
      .on("mouseout", function() {
        // 隐藏中央文本
        updateCenterText("", 0, false);
      })
      .on("click", function(event, d: any) {
        // 点击时显示文本并触发缩放
        updateCenterText(d.data.name, d.value, true);
        clicked(event, d);
      });

    // Add click handlers for paths with children
    path.filter(d => d.children)
      .style("cursor", "pointer");
    
    // Add tooltips
    const format = d3.format(",d");
    path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
    // Add labels
    const label = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .attr("fill", "#ffffff")
      .text(d => d.data.name);
    
    // 3. 创建中心圆
    const parent = svg.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "url(#aurora-gradient)")
      .attr("pointer-events", "all")
      .on("click", clicked);

    // 4. 最后创建文本组，确保在最上层
    const centerTextGroup = svg.append("g")
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .raise();  // 确保文本组在最上层

    // 添加场景名称文本
    const nameText = centerTextGroup.append("text")
      .attr("dy", "-0.5em")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .style("font-weight", "500");

    // 添加数值文本
    const valueText = centerTextGroup.append("text")
      .attr("dy", "1em")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .style("font-weight", "500");

    // 更新中央文本的函数
    const updateCenterText = (name: string, value: number, show: boolean = true) => {
      centerTextGroup.style("opacity", show ? 1 : 0);
      nameText.text(`${name}场景`);
      valueText.text(`${value}个`);
    };
    
    // Click handler for zoom
    function clicked(event: any, p: any) {
      parent.datum(p.parent || root);
      
      root.each((d: any) => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });
      
      const t = svg.transition().duration(event.altKey ? 7500 : 750);
      
      path.transition(t)
        .tween("data", (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t: any) => d.current = i(t);
        })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.7 : 0.6) : 0)
        .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
        .attrTween("d", (d: any) => () => arc(d.current));
      
      label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", (d: any) => () => labelTransform(d.current));
    }
    
    // Helper functions
    function arcVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
    
    function labelVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }
    
    function labelTransform(d: any) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * width / 6;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

  }, [width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} width={`${width+30}`} height={`${height+30}`}></svg>
    </div>
  );
}; 