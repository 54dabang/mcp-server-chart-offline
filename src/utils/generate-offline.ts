/**
 * 离线图表生成函数 - 生成简单的SVG图表并转换为base64
 */

// 简单的SVG图表生成器
function generateSVGChart(type: string, options: Record<string, any>): string {
  const { data = [], width = 400, height = 300 } = options;
  
  // SVG基础模板
  const svgStart = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  const svgEnd = `</svg>`;
  
  // 背景
  const background = `<rect width="100%" height="100%" fill="white"/>`;
  
  // 根据图表类型生成不同的SVG内容
  let chartContent = '';
  
  switch (type) {
    case 'line':
      chartContent = generateLineChart(data, width, height);
      break;
    case 'bar':
    case 'column':
      chartContent = generateBarChart(data, width, height);
      break;
    case 'pie':
      chartContent = generatePieChart(data, width, height);
      break;
    case 'area':
      chartContent = generateAreaChart(data, width, height);
      break;
    case 'histogram':
      chartContent = generateHistogramChart(data, width, height);
      break;
    case 'scatter':
      chartContent = generateScatterChart(data, width, height);
      break;
    case 'word-cloud':
      chartContent = generateWordCloudChart(data, width, height);
      break;
    case 'radar':
      chartContent = generateRadarChart(data, width, height);
      break;
    case 'treemap':
      chartContent = generateTreemapChart(data, width, height);
      break;
    case 'dual-axes':
      chartContent = generateDualAxesChart(data, width, height);
      break;
    case 'mind-map':
      chartContent = generateMindMapChart(data, width, height);
      break;
    case 'network-graph':
      chartContent = generateNetworkGraphChart(data, width, height);
      break;
    case 'flow-diagram':
      chartContent = generateFlowDiagramChart(data, width, height);
      break;
    case 'fishbone-diagram':
      chartContent = generateFishboneDiagramChart(data, width, height);
      break;
    default:
      chartContent = generateLineChart(data, width, height);
  }
  
  return svgStart + background + chartContent + svgEnd;
}

function generateLineChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // 找到数据范围
  const xValues = data.map(d => d.time || d.x || 0);
  const yValues = data.map(d => d.value || d.y || 0);
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  // 生成路径点
  const points = data.map((d, i) => {
    const x = padding + (chartWidth * i) / (data.length - 1);
    const y = padding + chartHeight - ((d.value || d.y || 0) - yMin) / (yMax - yMin) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  return `
    <polyline points="${points}" fill="none" stroke="#1890ff" stroke-width="2"/>
    ${data.map((d, i) => {
      const x = padding + (chartWidth * i) / (data.length - 1);
      const y = padding + chartHeight - ((d.value || d.y || 0) - yMin) / (yMax - yMin) * chartHeight;
      return `<circle cx="${x}" cy="${y}" r="3" fill="#1890ff"/>`;
    }).join('')}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Line Chart</text>
  `;
}

function generateBarChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const maxValue = Math.max(...data.map(d => d.value || 0));
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;
  
  const bars = data.map((d, i) => {
    const barHeight = ((d.value || 0) / maxValue) * chartHeight;
    const x = padding + i * (barWidth + barSpacing);
    const y = padding + chartHeight - barHeight;
    
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#52c41a"/>
      <text x="${x + barWidth/2}" y="${padding + chartHeight + 20}" text-anchor="middle" font-size="12">${d.category || d.name || i}</text>
    `;
  }).join('');
  
  return `
    ${bars}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Bar Chart</text>
  `;
}

function generatePieChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;
  
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  let currentAngle = 0;
  
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
  
  const slices = data.map((d, i) => {
    const sliceAngle = (d.value || 0) / total * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle += sliceAngle;
    
    return `<path d="${pathData}" fill="${colors[i % colors.length]}"/>`;
  }).join('');
  
  return `
    ${slices}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Pie Chart</text>
  `;
}

function generateAreaChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const yValues = data.map(d => d.value || d.y || 0);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  // 生成路径点
  const topPoints = data.map((d, i) => {
    const x = padding + (chartWidth * i) / (data.length - 1);
    const y = padding + chartHeight - ((d.value || d.y || 0) - yMin) / (yMax - yMin) * chartHeight;
    return `${x},${y}`;
  });
  
  const bottomPoints = [
    `${padding + chartWidth},${padding + chartHeight}`,
    `${padding},${padding + chartHeight}`
  ];
  
  const allPoints = topPoints.concat(bottomPoints).join(' ');
  
  return `
    <polygon points="${allPoints}" fill="#1890ff" fill-opacity="0.3" stroke="#1890ff" stroke-width="2"/>
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Area Chart</text>
  `;
}

function generateHistogramChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const maxValue = Math.max(...data.map(d => d.frequency || d.value || 0));
  const barWidth = chartWidth / data.length;
  
  const bars = data.map((d, i) => {
    const barHeight = ((d.frequency || d.value || 0) / maxValue) * chartHeight;
    const x = padding + i * barWidth;
    const y = padding + chartHeight - barHeight;
    
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#722ed1" stroke="white" stroke-width="1"/>
    `;
  }).join('');
  
  return `
    ${bars}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Histogram</text>
  `;
}

function generateScatterChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xValues = data.map(d => d.x || 0);
  const yValues = data.map(d => d.y || 0);
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const points = data.map((d, i) => {
    const x = padding + ((d.x || 0) - xMin) / (xMax - xMin) * chartWidth;
    const y = padding + chartHeight - ((d.y || 0) - yMin) / (yMax - yMin) * chartHeight;
    return `<circle cx="${x}" cy="${y}" r="4" fill="#fa8c16"/>`;
  }).join('');
  
  return `
    ${points}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Scatter Chart</text>
  `;
}

function generateWordCloudChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
  
  const words = data.map((d, i) => {
    const fontSize = Math.max(12, Math.min(32, (d.value || 10) / 2));
    const angle = (Math.random() - 0.5) * 60; // Random angle between -30 and 30 degrees
    const x = centerX + (Math.random() - 0.5) * width * 0.6;
    const y = centerY + (Math.random() - 0.5) * height * 0.6;
    
    return `
      <text x="${x}" y="${y}" 
            font-size="${fontSize}" 
            fill="${colors[i % colors.length]}" 
            text-anchor="middle" 
            transform="rotate(${angle} ${x} ${y})">
        ${d.text || d.word || d.name || `Word${i}`}
      </text>
    `;
  }).join('');
  
  return `
    ${words}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Word Cloud</text>
  `;
}

function generateRadarChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;
  
  const angleStep = (2 * Math.PI) / data.length;
  
  // 绘制网格
  const gridLines = [];
  for (let i = 0; i < data.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    gridLines.push(`<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#ddd" stroke-width="1"/>`);
  }
  
  // 绘制数据点
  const maxValue = Math.max(...data.map(d => d.value || 0));
  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = ((d.value || 0) / maxValue) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
  
  return `
    ${gridLines.join('')}
    <polygon points="${points}" fill="#1890ff" fill-opacity="0.3" stroke="#1890ff" stroke-width="2"/>
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Radar Chart</text>
  `;
}

function generateTreemapChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 20;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
  
  let currentX = padding;
  let currentY = padding;
  let rowHeight = 0;
  
  const rects = data.map((d, i) => {
    const area = ((d.value || 0) / total) * chartWidth * chartHeight;
    const rectWidth = Math.sqrt(area * 2);
    const rectHeight = area / rectWidth;
    
    if (currentX + rectWidth > width - padding) {
      currentX = padding;
      currentY += rowHeight + 5;
      rowHeight = 0;
    }
    
    const rect = `
      <rect x="${currentX}" y="${currentY}" width="${rectWidth}" height="${rectHeight}" 
            fill="${colors[i % colors.length]}" stroke="white" stroke-width="2"/>
      <text x="${currentX + rectWidth/2}" y="${currentY + rectHeight/2}" 
            text-anchor="middle" font-size="12" fill="white">
        ${d.name || d.category || `Item${i}`}
      </text>
    `;
    
    currentX += rectWidth + 5;
    rowHeight = Math.max(rowHeight, rectHeight);
    
    return rect;
  }).join('');
  
  return `
    ${rects}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Treemap Chart</text>
  `;
}

function generateDualAxesChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // 假设数据包含两个系列
  const series1 = data.map(d => d.value1 || d.value || 0);
  const series2 = data.map(d => d.value2 || d.value || 0);
  
  const max1 = Math.max(...series1);
  const max2 = Math.max(...series2);
  
  // 绘制第一个系列（柱状图）
  const barWidth = chartWidth / data.length * 0.4;
  const bars = data.map((d, i) => {
    const barHeight = ((d.value1 || d.value || 0) / max1) * chartHeight;
    const x = padding + i * (chartWidth / data.length);
    const y = padding + chartHeight - barHeight;
    
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#52c41a"/>`;
  }).join('');
  
  // 绘制第二个系列（折线图）
  const points = data.map((d, i) => {
    const x = padding + i * (chartWidth / data.length) + barWidth / 2;
    const y = padding + chartHeight - ((d.value2 || d.value || 0) / max2) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  return `
    ${bars}
    <polyline points="${points}" fill="none" stroke="#1890ff" stroke-width="2"/>
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Dual Axes Chart</text>
  `;
}

function generateMindMapChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 4;
  
  // 中心节点
  const centerNode = `
    <circle cx="${centerX}" cy="${centerY}" r="30" fill="#1890ff"/>
    <text x="${centerX}" y="${centerY}" text-anchor="middle" fill="white" font-size="12">Center</text>
  `;
  
  // 子节点
  const angleStep = (2 * Math.PI) / data.length;
  const nodes = data.map((d, i) => {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return `
      <line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#ddd" stroke-width="2"/>
      <circle cx="${x}" cy="${y}" r="20" fill="#52c41a"/>
      <text x="${x}" y="${y}" text-anchor="middle" fill="white" font-size="10">
        ${d.name || d.text || `Node${i}`}
      </text>
    `;
  }).join('');
  
  return `
    ${nodes}
    ${centerNode}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Mind Map</text>
  `;
}

function generateNetworkGraphChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // 随机分布节点
  const nodes = data.map((d, i) => {
    const x = padding + Math.random() * chartWidth;
    const y = padding + Math.random() * chartHeight;
    return { x, y, name: d.name || d.id || `Node${i}` };
  });
  
  // 生成一些连接线
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    if (Math.random() > 0.5) {
      edges.push(`<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[i+1].x}" y2="${nodes[i+1].y}" stroke="#ddd" stroke-width="1"/>`);
    }
  }
  
  const nodeElements = nodes.map(node => `
    <circle cx="${node.x}" cy="${node.y}" r="8" fill="#1890ff"/>
    <text x="${node.x}" y="${node.y - 15}" text-anchor="middle" font-size="10">${node.name}</text>
  `).join('');
  
  return `
    ${edges.join('')}
    ${nodeElements}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Network Graph</text>
  `;
}

function generateFlowDiagramChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const padding = 50;
  const stepWidth = (width - 2 * padding) / data.length;
  const stepHeight = 60;
  const startY = height / 2 - stepHeight / 2;
  
  const steps = data.map((d, i) => {
    const x = padding + i * stepWidth;
    const centerX = x + stepWidth / 2;
    
    const arrow = i < data.length - 1 ? 
      `<path d="M ${x + stepWidth - 20} ${startY + stepHeight/2} L ${x + stepWidth} ${startY + stepHeight/2} L ${x + stepWidth - 10} ${startY + stepHeight/2 - 5} M ${x + stepWidth} ${startY + stepHeight/2} L ${x + stepWidth - 10} ${startY + stepHeight/2 + 5}" stroke="#666" stroke-width="2" fill="none"/>` : '';
    
    return `
      <rect x="${x + 10}" y="${startY}" width="${stepWidth - 40}" height="${stepHeight}" fill="#52c41a" rx="5"/>
      <text x="${centerX}" y="${startY + stepHeight/2}" text-anchor="middle" fill="white" font-size="12">
        ${d.name || d.step || `Step${i+1}`}
      </text>
      ${arrow}
    `;
  }).join('');
  
  return `
    ${steps}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Flow Diagram</text>
  `;
}

function generateFishboneDiagramChart(data: any[], width: number, height: number): string {
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  const centerY = height / 2;
  const startX = 50;
  const endX = width - 100;
  
  // 主干
  const mainLine = `<line x1="${startX}" y1="${centerY}" x2="${endX}" y2="${centerY}" stroke="#333" stroke-width="3"/>`;
  
  // 鱼头
  const fishHead = `
    <path d="M ${endX} ${centerY} L ${endX + 30} ${centerY - 15} L ${endX + 50} ${centerY} L ${endX + 30} ${centerY + 15} Z" fill="#1890ff"/>
    <text x="${endX + 60}" y="${centerY}" text-anchor="start" font-size="12">Problem</text>
  `;
  
  // 分支
  const branchLength = (endX - startX) / data.length;
  const branches = data.map((d, i) => {
    const x = startX + (i + 1) * branchLength;
    const isUpper = i % 2 === 0;
    const branchY = isUpper ? centerY - 40 : centerY + 40;
    const textY = isUpper ? branchY - 10 : branchY + 20;
    
    return `
      <line x1="${x}" y1="${centerY}" x2="${x + 40}" y2="${branchY}" stroke="#666" stroke-width="2"/>
      <text x="${x + 45}" y="${textY}" text-anchor="start" font-size="10">
        ${d.cause || d.name || `Cause${i+1}`}
      </text>
    `;
  }).join('');
  
  return `
    ${mainLine}
    ${branches}
    ${fishHead}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Fishbone Diagram</text>
  `;
}

/**
 * 离线生成图表 (返回SVG代码和描述)
 */
export async function generateChartUrlOffline(
  type: string,
  options: Record<string, any>,
): Promise<string> {
  try {
    // 生成SVG
    const svg = generateSVGChart(type, options);
    
    // 返回格式化的结果，包含SVG代码和描述
    const result = {
      type: type,
      description: getChartDescription(type),
      svg: svg,
      dataPoints: options.data ? options.data.length : 0,
      size: `${options.width || 400}x${options.height || 300}`,
      status: 'success'
    };
    
    // 返回JSON格式的结果，便于在对话中显示
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error generating offline chart:', error);
    
    // 返回错误信息
    const errorResult = {
      type: type,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      description: '图表生成失败'
    };
    
    return JSON.stringify(errorResult, null, 2);
  }
}

// 获取图表类型描述
function getChartDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'line': '折线图 - 显示数据趋势和变化',
    'bar': '柱状图 - 比较不同类别的数据',
    'column': '柱状图 - 比较不同类别的数据',
    'pie': '饼图 - 显示数据占比和分布',
    'area': '面积图 - 显示数据变化趋势和累积效果',
    'histogram': '直方图 - 显示数据分布频率',
    'scatter': '散点图 - 显示两个变量之间的关系',
    'word-cloud': '词云图 - 可视化文本数据的重要性',
    'radar': '雷达图 - 多维数据对比分析',
    'treemap': '树状图 - 层次化数据的面积展示',
    'dual-axes': '双轴图 - 同时展示两个不同量级的数据系列',
    'mind-map': '思维导图 - 展示概念之间的层次关系',
    'network-graph': '网络图 - 显示节点和连接关系',
    'flow-diagram': '流程图 - 展示步骤和流程',
    'fishbone-diagram': '鱼骨图 - 因果关系分析图'
  };
  
  return descriptions[type] || `${type}图表`;
} 