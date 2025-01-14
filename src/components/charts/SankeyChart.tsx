import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

interface SankeyProps {
  width?: number;
  height?: number;
  data: any;
}

// 数据处理函数优化
const processData = (rawData: SankeyDataItem[]) => {
  // 1. 收集所有唯一节点
  const nodeSet = new Set<string>();
  rawData.forEach(d => {
    nodeSet.add(d.数据来源);
    nodeSet.add(d.数据治理);
    nodeSet.add(d.场景类型);
    nodeSet.add(d.最终流向);
  });

  // 2. 创建节点数组
  const nodes = Array.from(nodeSet).map(name => ({
    name,
    category: name.includes('部') || name.includes('会') || name.includes('局') ? '政府部门' :
             name.includes('上链') ? '数据状态' :
             name.includes('服务') || name.includes('监管') ? '场景' : '领域'
  }));

  // 3. 创建连接关系
  const links = [];
  rawData.forEach(d => {
    // 第一层连接：数据来源 -> 数据治理
    links.push({
      source: nodes.findIndex(n => n.name === d.数据来源),
      target: nodes.findIndex(n => n.name === d.数据治理),
      value: d.流量值
    });
    
    // 第二层连接：数据治理 -> 场景类型
    links.push({
      source: nodes.findIndex(n => n.name === d.数据治理),
      target: nodes.findIndex(n => n.name === d.场景类型),
      value: d.流量值
    });
    
    // 第三层连接：场景类型 -> 最终流向
    links.push({
      source: nodes.findIndex(n => n.name === d.场景类型),
      target: nodes.findIndex(n => n.name === d.最终流向),
      value: d.流量值
    });
  });

  return { nodes, links };
};

export const SankeyChart: React.FC<SankeyProps> = ({ 
  width = 1400, 
  height = 800,
  data 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const processedData = processData(data);

    // 清除现有内容
    d3.select(svgRef.current).selectAll("*").remove();

    // 创建tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "sankey-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.85)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("opacity", "0.8");

    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 优化的颜色方案
    const colorScheme = [
        '#1890FF', // 蓝色
        '#FFB72B', // 金色
        '#52C41A', // 绿色
        '#722ED1', // 紫色
        '#13C2C2', // 青色
        '#FA8C16', // 橙色
        '#EB2F96', // 粉色
        '#2F54EB'  // 深蓝
      ];


    // 创建颜色比例尺
    const color = d3.scaleOrdinal()
      .range(colorScheme.map(c => d3.color(c)?.brighter(0.2)?.toString() || c));

    // 创建sankey布局
    const sankeyLayout = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [width - margin.left - margin.right, height - margin.top - margin.bottom]]);

    // 生成sankey数据
    const { nodes, links } = sankeyLayout(processedData);

    // 创建节点
    svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x0!)
      .attr("y", d => d.y0!)
      .attr("height", d => d.y1! - d.y0!)
      .attr("width", d => d.x1! - d.x0!)
      .attr("fill", (d: any) => color(d.name))
      .attr("opacity", 0.8)
      .on("mouseover", function(event: any, d: any) {
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${d.name}</strong><br/>
            流量总值: <strong>${d.value}</strong>
          `);
      })
      .on("mousemove", function(event: any) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    // 创建连接
    const pathLinks = svg.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke", (d: any) => color(d.source.name))
      .attr("stroke-width", (d: any) => Math.max(4, d.width))
      .attr("opacity", 0.5)
      .attr("fill", "none")
      .on("mouseover", function(event: any, d: any) {
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${d.source.name} → ${d.target.name}</strong><br/>
            流量值: <strong>${d.value}</strong>
          `);
      })
      .on("mousemove", function(event: any) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    // 添加节点标签
    svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
      .attr("y", d => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
      .text((d: any) => d.name)
      .attr("fill", "#fff")
      .attr("font-size", "12px");

    // 简化的粒子动画，只针对上链数据
    const createParticles = () => {
      const upchainPaths = pathLinks.filter((d: any) => 
        d.source.name === "上链数据" || d.target.name === "上链数据"
      );

      upchainPaths.each(function(d: any) {
        const path = d3.select(this);
        const pathData = d3Sankey.sankeyLinkHorizontal()(d);
        path.attr("d", pathData);
        
        const pathNode = path.node() as SVGPathElement;
        const pathLength = pathNode.getTotalLength();
        const pathColor = path.attr("stroke");

        // 增加粒子数量到 8 个
        const particles = d3.range(6).map(() => ({
          offset: Math.random() * pathLength,  // 随机初始位置
          element: svg.append("circle")
            .attr("r", 2)
            .attr("fill", pathColor)
            .attr("opacity", 0.7)
        }));

        // 使用 RAF 进行动画
        function moveParticles() {
          particles.forEach(particle => {
            particle.offset = (particle.offset + 0.5) % pathLength;
            const point = pathNode.getPointAtLength(particle.offset);
            particle.element.attr("transform", `translate(${point.x}, ${point.y})`);
          });
          animationRef.current = requestAnimationFrame(moveParticles);
        }

        moveParticles();
      });
    };

    // 确保在路径完全渲染后再创建粒子
    requestAnimationFrame(createParticles);

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      tooltip.remove();  // 确保清理 tooltip
      d3.select(svgRef.current).selectAll("circle").remove();
    };
  }, [data, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}; 