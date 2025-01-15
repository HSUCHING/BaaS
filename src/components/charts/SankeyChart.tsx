import React, { useEffect, useRef, useCallback, useMemo } from 'react';
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
  width = 1200, 
  height = 800,
  data 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();
  const tooltipRef = useRef<any>();
  const sankeyLayoutRef = useRef<any>();
  
  // 优化数据处理函数
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);

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

  // 优化颜色比例尺
  const color = useMemo(() => {
    return d3.scaleOrdinal()
      .range(colorScheme.map(c => d3.color(c)?.brighter(0.2)?.toString() || c));
  }, []);

  // 将 createParticles 移到组件顶层
  const createParticles = useCallback((svg: any, pathLinks: any) => {
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

      // 减少粒子数量到 4 个
      const particles = d3.range(4).map(() => ({
        offset: Math.random() * pathLength,
        element: svg.append("circle")
          .attr("r", 2)
          .attr("fill", pathColor)
          .attr("opacity", 0.7)
      }));

      let lastTime = 0;
      function moveParticles(timestamp: number) {
        if (timestamp - lastTime > 16) {
          particles.forEach(particle => {
            particle.offset = (particle.offset + 0.5) % pathLength;
            const point = pathNode.getPointAtLength(particle.offset);
            particle.element.attr("transform", `translate(${point.x}, ${point.y})`);
          });
          lastTime = timestamp;
        }
        animationRef.current = requestAnimationFrame(moveParticles);
      }

      moveParticles(0);
    });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // 清除现有内容
    d3.select(svgRef.current).selectAll("*").remove();

    // 创建tooltip
    tooltipRef.current = d3.select("body")
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

    // 创建sankey布局
    sankeyLayoutRef.current = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [width - margin.left - margin.right, height - margin.top - margin.bottom]]);

    // 生成sankey数据
    const { nodes, links } = sankeyLayoutRef.current(processedData);

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
        tooltipRef.current
          .style("visibility", "visible")
          .html(`
            <strong>${d.name}</strong><br/>
            流量总值: <strong>${d.value}</strong>
          `);
      })
      .on("mousemove", function(event: any) {
        tooltipRef.current
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        tooltipRef.current.style("visibility", "hidden");
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
        tooltipRef.current
          .style("visibility", "visible")
          .html(`
            <strong>${d.source.name} → ${d.target.name}</strong><br/>
            流量值: <strong>${d.value}</strong>
          `);
      })
      .on("mousemove", function(event: any) {
        tooltipRef.current
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        tooltipRef.current.style("visibility", "hidden");
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

    // 在 useEffect 中调用 createParticles
    requestAnimationFrame(() => createParticles(svg, pathLinks));

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      tooltipRef.current.remove();
      d3.select(svgRef.current).selectAll("circle").remove();
    };
  }, [data, width, height, createParticles, processedData]);



  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}; 