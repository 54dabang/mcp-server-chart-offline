# 📊 MCP Chart Server - 绘图功能与参数解析完整指南

## 🎯 概述

本文档详细描述了 MCP Chart Server 支持的所有绘图功能、参数定义、数据格式要求和使用示例。

## 📁 项目结构

```
src/
├── charts/                 # 图表类型定义
│   ├── index.ts            # 所有图表类型导出
│   ├── base.ts             # 基础参数定义
│   ├── bar.ts              # 柱状图
│   ├── line.ts             # 折线图
│   ├── pie.ts              # 饼图
│   ├── area.ts             # 面积图
│   ├── scatter.ts          # 散点图
│   ├── histogram.ts        # 直方图
│   ├── word-cloud.ts       # 词云图
│   ├── radar.ts            # 雷达图
│   ├── treemap.ts          # 树状图
│   ├── dual-axes.ts        # 双轴图
│   ├── mind-map.ts         # 思维导图
│   ├── network-graph.ts    # 网络图
│   ├── flow-diagram.ts     # 流程图
│   └── fishbone-diagram.ts # 鱼骨图
├── utils/
│   ├── generate-offline.ts # 离线图表生成函数
│   ├── generate.ts         # 主生成入口
│   └── constants.ts        # 工具名称映射
└── server.ts               # MCP服务器处理逻辑
```

## 🔧 基础参数定义

所有图表类型都支持以下基础参数（定义在 `src/charts/base.ts`）：

### 通用参数
- **theme**: `"default" | "academy"` (默认: `"default"`) - 图表主题
- **width**: `number` (默认: `600`) - 图表宽度（像素）
- **height**: `number` (默认: `400`) - 图表高度（像素）
- **title**: `string` (默认: `""`) - 图表标题
- **axisXTitle**: `string` (默认: `""`) - X轴标题
- **axisYTitle**: `string` (默认: `""`) - Y轴标题

## 📊 图表类型详细说明

### 1. 📈 折线图 (Line Chart)

**工具名称**: `generate_line_chart`
**文件位置**: `src/charts/line.ts`
**生成函数**: `generateLineChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    time: string,    // 时间点（必需）
    value: number    // 数值（必需）
  }>,
  stack?: boolean,   // 是否堆叠（默认: false）
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "time": "2020", "value": 100 },
    { "time": "2021", "value": 120 },
    { "time": "2022", "value": 150 }
  ],
  "title": "年度增长趋势",
  "axisXTitle": "年份",
  "axisYTitle": "数值"
}
```

#### 数据字段映射
- `d.time` → 时间轴数据
- `d.value` → 数值数据

---

### 2. 📊 柱状图 (Bar Chart)

**工具名称**: `generate_bar_chart`
**文件位置**: `src/charts/bar.ts`
**生成函数**: `generateBarChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    category: string,  // 分类名称（必需）
    value: number,     // 数值（必需）
    group?: string     // 分组名称（可选）
  }>,
  group?: boolean,     // 分组模式（默认: false）
  stack?: boolean,     // 堆叠模式（默认: true）
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "category": "产品A", "value": 100 },
    { "category": "产品B", "value": 120 },
    { "category": "产品C", "value": 80 }
  ],
  "title": "产品销售对比"
}
```

#### 数据字段映射
- `d.category` 或 `d.name` → 分类标签
- `d.value` → 数值数据
- `d.group` → 分组信息

---

### 3. 🥧 饼图 (Pie Chart)

**工具名称**: `generate_pie_chart`
**文件位置**: `src/charts/pie.ts`
**生成函数**: `generatePieChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    category: string,  // 分类名称（必需）
    value: number      // 数值（必需）
  }>,
  innerRadius?: number, // 内半径（0-1，默认: 0）
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "category": "苹果", "value": 40 },
    { "category": "橙子", "value": 30 },
    { "category": "香蕉", "value": 30 }
  ],
  "title": "水果销售占比",
  "innerRadius": 0.3
}
```

#### 数据字段映射
- `d.category` → 分类标签
- `d.value` → 数值数据

---

### 4. 📈 面积图 (Area Chart)

**工具名称**: `generate_area_chart`
**文件位置**: `src/charts/area.ts`
**生成函数**: `generateAreaChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    time: string,    // 时间点（必需）
    value: number    // 数值（必需）
  }>,
  stack?: boolean,   // 是否堆叠（默认: false）
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "time": "Q1", "value": 100 },
    { "time": "Q2", "value": 120 },
    { "time": "Q3", "value": 150 },
    { "time": "Q4", "value": 180 }
  ],
  "title": "季度累积增长"
}
```

#### 数据字段映射
- `d.time` → 时间轴数据
- `d.value` 或 `d.y` → 数值数据

---

### 5. ⚪ 散点图 (Scatter Chart)

**工具名称**: `generate_scatter_chart`
**文件位置**: `src/charts/scatter.ts`
**生成函数**: `generateScatterChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    x: number,       // X坐标（必需）
    y: number        // Y坐标（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "x": 10, "y": 20 },
    { "x": 15, "y": 25 },
    { "x": 20, "y": 30 },
    { "x": 25, "y": 35 }
  ],
  "title": "相关性分析",
  "axisXTitle": "变量X",
  "axisYTitle": "变量Y"
}
```

#### 数据字段映射
- `d.x` → X轴坐标
- `d.y` → Y轴坐标

---

### 6. 📊 直方图 (Histogram)

**工具名称**: `generate_histogram_chart`
**文件位置**: `src/charts/histogram.ts`
**生成函数**: `generateHistogramChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    value: number,     // 数值（必需）
    frequency?: number // 频率（可选）
  }>,
  binWidth?: number,   // 分组宽度
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "frequency": 10 },
    { "frequency": 20 },
    { "frequency": 15 },
    { "frequency": 25 }
  ],
  "title": "数据分布直方图"
}
```

#### 数据字段映射
- `d.frequency` 或 `d.value` → 频率数据

---

### 7. ☁️ 词云图 (Word Cloud)

**工具名称**: `generate_word_cloud_chart`
**文件位置**: `src/charts/word-cloud.ts`
**生成函数**: `generateWordCloudChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    text: string,    // 文本内容（必需）
    value: number    // 权重值（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "text": "JavaScript", "value": 50 },
    { "text": "Python", "value": 40 },
    { "text": "React", "value": 35 },
    { "text": "Node.js", "value": 30 }
  ],
  "title": "技术热度词云"
}
```

#### 数据字段映射
- `d.text` 或 `d.word` → 文本内容
- `d.value` → 权重值

---

### 8. 🎯 雷达图 (Radar Chart)

**工具名称**: `generate_radar_chart`
**文件位置**: `src/charts/radar.ts`
**生成函数**: `generateRadarChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    category: string,  // 维度名称（必需）
    value: number      // 数值（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "category": "技能A", "value": 80 },
    { "category": "技能B", "value": 70 },
    { "category": "技能C", "value": 90 },
    { "category": "技能D", "value": 60 }
  ],
  "title": "能力雷达图"
}
```

#### 数据字段映射
- `d.category` → 维度标签
- `d.value` → 数值数据

---

### 9. 🗂️ 树状图 (Treemap)

**工具名称**: `generate_treemap_chart`
**文件位置**: `src/charts/treemap.ts`
**生成函数**: `generateTreemapChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    name: string,      // 名称（必需）
    value: number      // 数值（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "name": "区域A", "value": 100 },
    { "name": "区域B", "value": 80 },
    { "name": "区域C", "value": 60 },
    { "name": "区域D", "value": 40 }
  ],
  "title": "区域占比树状图"
}
```

#### 数据字段映射
- `d.name` 或 `d.category` → 名称标签
- `d.value` → 数值数据

---

### 10. 📊 双轴图 (Dual Axes Chart)

**工具名称**: `generate_dual_axes_chart`
**文件位置**: `src/charts/dual-axes.ts`
**生成函数**: `generateDualAxesChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  categories: string[],        // 分类数组（必需）
  series: Array<{
    type: "column" | "line",   // 系列类型（必需）
    data: number[],            // 数据数组（必需）
    axisYTitle?: string        // Y轴标题（可选）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "categories": ["Q1", "Q2", "Q3", "Q4"],
  "series": [
    {
      "type": "column",
      "data": [100, 120, 110, 130],
      "axisYTitle": "销售额"
    },
    {
      "type": "line", 
      "data": [0.1, 0.12, 0.11, 0.13],
      "axisYTitle": "增长率"
    }
  ],
  "title": "销售额与增长率对比"
}
```

#### 数据字段映射
- `d.value1` 或 `d.value` → 第一个系列数据
- `d.value2` → 第二个系列数据

---

### 11. 🧠 思维导图 (Mind Map)

**工具名称**: `generate_mind_map`
**文件位置**: `src/charts/mind-map.ts`
**生成函数**: `generateMindMapChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    name: string       // 节点名称（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "name": "想法1" },
    { "name": "想法2" },
    { "name": "想法3" },
    { "name": "想法4" }
  ],
  "title": "项目思维导图"
}
```

#### 数据字段映射
- `d.name` 或 `d.text` → 节点名称

---

### 12. 🕸️ 网络图 (Network Graph)

**工具名称**: `generate_network_graph`
**文件位置**: `src/charts/network-graph.ts`
**生成函数**: `generateNetworkGraphChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  nodes: Array<{
    name: string       // 节点名称（必需）
  }>,
  edges: Array<{
    source: string,    // 源节点（必需）
    target: string,    // 目标节点（必需）
    name?: string      // 边名称（可选）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "nodes": [
    { "name": "节点A" },
    { "name": "节点B" },
    { "name": "节点C" }
  ],
  "edges": [
    { "source": "节点A", "target": "节点B" },
    { "source": "节点B", "target": "节点C" }
  ],
  "title": "关系网络图"
}
```

#### 数据字段映射
- `d.name` 或 `d.id` → 节点名称

---

### 13. 🔄 流程图 (Flow Diagram)

**工具名称**: `generate_flow_diagram`
**文件位置**: `src/charts/flow-diagram.ts`
**生成函数**: `generateFlowDiagramChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    name: string,      // 步骤名称（必需）
    step?: string      // 步骤类型（可选）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "name": "开始", "step": "start" },
    { "name": "处理", "step": "process" },
    { "name": "决策", "step": "decision" },
    { "name": "结束", "step": "end" }
  ],
  "title": "业务流程图"
}
```

#### 数据字段映射
- `d.name` → 步骤名称
- `d.step` → 步骤类型

---

### 14. 🐟 鱼骨图 (Fishbone Diagram)

**工具名称**: `generate_fishbone_diagram`
**文件位置**: `src/charts/fishbone-diagram.ts`
**生成函数**: `generateFishboneDiagramChart()` in `src/utils/generate-offline.ts`

#### 参数说明
```typescript
{
  data: Array<{
    cause: string      // 原因描述（必需）
  }>,
  // ...基础参数
}
```

#### 使用示例
```json
{
  "data": [
    { "cause": "人员因素" },
    { "cause": "设备因素" },
    { "cause": "材料因素" },
    { "cause": "方法因素" },
    { "cause": "环境因素" }
  ],
  "title": "问题根因分析"
}
```

#### 数据字段映射
- `d.cause` 或 `d.name` → 原因描述

---

## 🔄 参数处理流程

### 1. 参数验证流程
```
用户输入 → Zod Schema验证 → 参数标准化 → 图表生成
```

### 2. 数据字段映射规则
- **优先级**: 明确字段名 > 通用字段名 > 索引
- **容错处理**: 支持多种字段名变体
- **默认值**: 提供合理的默认值

### 3. 错误处理
- **数据为空**: 返回"No data available"提示
- **字段缺失**: 使用默认值或索引
- **类型错误**: Zod验证阶段捕获

## 📋 输出格式

所有图表生成后都返回统一的JSON格式：

```json
{
  "type": "图表类型",
  "description": "图表描述",
  "svg": "完整的SVG代码",
  "dataPoints": "数据点数量",
  "size": "宽度x高度",
  "status": "success|error"
}
```

## 🚀 使用建议

### 1. 数据准备
- 确保数据格式符合对应图表类型的要求
- 数值字段使用number类型，不要使用字符串
- 分类字段使用有意义的名称

### 2. 参数设置
- 根据数据量调整图表尺寸
- 设置有意义的标题和轴标题
- 选择合适的主题样式

### 3. 性能优化
- 大数据集考虑数据采样
- 合理设置图表尺寸
- 避免过于复杂的数据结构

### 4. 错误排查
- 检查数据格式是否正确
- 验证必需字段是否存在
- 确认数值类型是否正确

## 📚 相关文档

- [BAR_CHART_PARAMS.md](./BAR_CHART_PARAMS.md) - 柱状图详细参数说明
- [OFFLINE_USAGE.md](./OFFLINE_USAGE.md) - 离线使用指南
- [README.md](./README.md) - 项目总体说明
- [SOLUTION_SUMMARY.md](./SOLUTION_SUMMARY.md) - 问题解决方案总结

---

**🎉 现在您可以根据这个指南使用所有15种图表类型的完整功能了！** 