# 📊 柱状图参数详细说明

## 🎯 概述

柱状图用于比较不同类别的数据，通过柱子的高度来直观显示数值差异。

## 📁 相关文件位置

### 1. 参数定义文件
- **主要定义**: `src/charts/bar.ts` - 柱状图的完整参数schema定义
- **基础参数**: `src/charts/base.ts` - 通用参数定义（宽度、高度、主题等）
- **类型映射**: `src/utils/constants.ts` - 工具名称到图表类型的映射

### 2. 生成函数文件
- **生成逻辑**: `src/utils/generate-offline.ts` 中的 `generateBarChart()` 函数
- **主入口**: `src/utils/generate.ts` 中的 `generateChartUrl()` 函数

### 3. 服务器处理文件
- **工具处理**: `src/server.ts` - MCP工具调用处理逻辑

## 📋 参数详细说明

### 必需参数

#### 1. data (必需)
- **类型**: `Array<Object>`
- **描述**: 柱状图的数据数组，不能为空
- **数据结构**:
  ```typescript
  {
    category: string,    // 分类名称（必需）
    value: number,       // 数值（必需）
    group?: string       // 分组名称（可选，用于分组或堆叠）
  }
  ```
- **示例**:
  ```json
  [
    { "category": "产品A", "value": 100 },
    { "category": "产品B", "value": 120 },
    { "category": "产品C", "value": 80 }
  ]
  ```

### 可选参数

#### 2. group (可选)
- **类型**: `boolean`
- **默认值**: `false`
- **描述**: 是否启用分组模式
- **说明**: 
  - 当为 `true` 时，需要数据中包含 `group` 字段
  - 与 `stack` 参数互斥（group为true时，stack应为false）

#### 3. stack (可选)
- **类型**: `boolean`
- **默认值**: `true`
- **描述**: 是否启用堆叠模式
- **说明**: 
  - 当为 `true` 时，需要数据中包含 `group` 字段
  - 与 `group` 参数互斥（stack为true时，group应为false）

#### 4. theme (可选)
- **类型**: `"default" | "academy"`
- **默认值**: `"default"`
- **描述**: 图表主题样式

#### 5. width (可选)
- **类型**: `number`
- **默认值**: `600`
- **描述**: 图表宽度（像素）

#### 6. height (可选)
- **类型**: `number`
- **默认值**: `400`
- **描述**: 图表高度（像素）

#### 7. title (可选)
- **类型**: `string`
- **默认值**: `""`
- **描述**: 图表标题

#### 8. axisXTitle (可选)
- **类型**: `string`
- **默认值**: `""`
- **描述**: X轴标题

#### 9. axisYTitle (可选)
- **类型**: `string`
- **默认值**: `""`
- **描述**: Y轴标题

## 🔧 函数调用示例

### 基础柱状图
```json
{
  "data": [
    { "category": "一月", "value": 100 },
    { "category": "二月", "value": 120 },
    { "category": "三月", "value": 80 },
    { "category": "四月", "value": 150 }
  ],
  "title": "月度销售额",
  "axisXTitle": "月份",
  "axisYTitle": "销售额（万元）",
  "width": 500,
  "height": 300
}
```

### 分组柱状图
```json
{
  "data": [
    { "category": "Q1", "value": 100, "group": "产品A" },
    { "category": "Q1", "value": 80, "group": "产品B" },
    { "category": "Q2", "value": 120, "group": "产品A" },
    { "category": "Q2", "value": 90, "group": "产品B" }
  ],
  "group": true,
  "stack": false,
  "title": "季度产品对比"
}
```

### 堆叠柱状图
```json
{
  "data": [
    { "category": "Q1", "value": 100, "group": "线上" },
    { "category": "Q1", "value": 80, "group": "线下" },
    { "category": "Q2", "value": 120, "group": "线上" },
    { "category": "Q2", "value": 90, "group": "线下" }
  ],
  "group": false,
  "stack": true,
  "title": "渠道销售堆叠图"
}
```

## 🎨 生成函数内部处理

### generateBarChart() 函数位置
**文件**: `src/utils/generate-offline.ts` (第102-125行)

### 参数获取逻辑
```typescript
function generateBarChart(data: any[], width: number, height: number): string {
  // 1. 数据验证
  if (!data || data.length === 0) {
    return `<text x="50%" y="50%" text-anchor="middle" fill="red">No data available</text>`;
  }
  
  // 2. 布局计算
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // 3. 数据处理
  const maxValue = Math.max(...data.map(d => d.value || 0));
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;
  
  // 4. 生成SVG元素
  const bars = data.map((d, i) => {
    const barHeight = ((d.value || 0) / maxValue) * chartHeight;
    const x = padding + i * (barWidth + barSpacing);
    const y = padding + chartHeight - barHeight;
    
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#52c41a"/>
      <text x="${x + barWidth/2}" y="${padding + chartHeight + 20}" text-anchor="middle" font-size="12">
        ${d.category || d.name || i}
      </text>
    `;
  }).join('');
  
  return `${bars}<text x="${width/2}" y="30" text-anchor="middle" font-size="16" font-weight="bold">Bar Chart</text>`;
}
```

### 参数字段映射
- `d.value` - 获取数值数据
- `d.category` 或 `d.name` - 获取分类标签
- `d.group` - 获取分组信息（用于分组/堆叠图表）

## ⚠️ 注意事项

1. **数据格式**: 确保每个数据项都包含 `category` 和 `value` 字段
2. **数值类型**: `value` 必须是数字类型，不能是字符串
3. **分组模式**: 使用分组或堆叠时，确保数据包含 `group` 字段
4. **参数互斥**: `group` 和 `stack` 不能同时为 `true`
5. **数组非空**: `data` 数组不能为空

## 🚀 MCP工具调用

### 工具名称
`generate_bar_chart`

### 完整调用示例
```json
{
  "name": "generate_bar_chart",
  "arguments": {
    "data": [
      { "category": "产品A", "value": 100 },
      { "category": "产品B", "value": 120 },
      { "category": "产品C", "value": 80 }
    ],
    "title": "产品销售对比",
    "width": 500,
    "height": 300
  }
}
```

### 返回格式
```json
{
  "type": "bar",
  "description": "柱状图 - 比较不同类别的数据",
  "svg": "<svg width=\"500\" height=\"300\" xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
  "dataPoints": 3,
  "size": "500x300",
  "status": "success"
}
``` 