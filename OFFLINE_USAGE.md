# 🚀 MCP Server Chart - 完全离线版本

本项目已完全移除网络依赖，可以在无网络环境下正常运行。

## ✨ 主要特性

- ✅ **完全离线**：不需要任何网络连接
- ✅ **零依赖**：移除了 axios 等网络相关依赖
- ✅ **轻量级**：使用纯 SVG 生成图表
- ✅ **即时响应**：本地生成，无网络延迟
- ✅ **兼容性**：与原有 MCP 协议完全兼容
- ✅ **全覆盖**：支持所有15种图表类型

## 📊 支持的图表类型

### 基础图表
- **折线图** (line) - 显示数据趋势和变化
- **柱状图** (bar/column) - 比较不同类别的数据
- **饼图** (pie) - 显示数据占比和分布
- **面积图** (area) - 显示数据变化趋势和累积效果

### 统计图表
- **直方图** (histogram) - 显示数据分布频率
- **散点图** (scatter) - 显示两个变量之间的关系

### 高级图表
- **词云图** (word-cloud) - 可视化文本数据的重要性
- **雷达图** (radar) - 多维数据对比分析
- **树状图** (treemap) - 层次化数据的面积展示
- **双轴图** (dual-axes) - 同时展示两个不同量级的数据系列

### 关系图表
- **思维导图** (mind-map) - 展示概念之间的层次关系
- **网络图** (network-graph) - 显示节点和连接关系
- **流程图** (flow-diagram) - 展示步骤和流程
- **鱼骨图** (fishbone-diagram) - 因果关系分析图

## 🚀 快速开始

### 1. 构建项目

```bash
npm install
npm run build
```

### 2. 运行服务器

```bash
# 默认 stdio 模式
node build/index.js

# SSE 模式（可通过 HTTP 访问）
node build/index.js --transport sse --port 1122

# Streamable 模式
node build/index.js --transport streamable --port 1122
```

### 3. 配置 MCP 客户端

在您的 MCP 客户端配置文件中添加：

```json
{
  "mcpServers": {
    "mcp-server-chart-offline": {
      "command": "node",
      "args": [
        "E:\\研一\\deepseek\\mcp\\mcp-server-chart\\build\\index.js"
      ],
      "cwd": "E:\\研一\\deepseek\\mcp\\mcp-server-chart"
    }
  }
}
```

## 📋 API 使用示例

### 基础图表示例

#### 生成折线图
```javascript
{
  "type": "line",
  "data": [
    { "time": 2020, "value": 100 },
    { "time": 2021, "value": 120 },
    { "time": 2022, "value": 150 },
    { "time": 2023, "value": 180 }
  ]
}
```

#### 生成柱状图
```javascript
{
  "type": "bar",
  "data": [
    { "category": "产品A", "value": 100 },
    { "category": "产品B", "value": 120 },
    { "category": "产品C", "value": 80 }
  ]
}
```

#### 生成饼图
```javascript
{
  "type": "pie",
  "data": [
    { "category": "苹果", "value": 40 },
    { "category": "橙子", "value": 30 },
    { "category": "香蕉", "value": 30 }
  ]
}
```

### 高级图表示例

#### 生成散点图
```javascript
{
  "type": "scatter",
  "data": [
    { "x": 10, "y": 20 },
    { "x": 15, "y": 25 },
    { "x": 20, "y": 30 },
    { "x": 25, "y": 35 }
  ]
}
```

#### 生成词云图
```javascript
{
  "type": "word-cloud",
  "data": [
    { "text": "JavaScript", "value": 50 },
    { "text": "Python", "value": 40 },
    { "text": "React", "value": 35 },
    { "text": "Node.js", "value": 30 }
  ]
}
```

#### 生成雷达图
```javascript
{
  "type": "radar",
  "data": [
    { "category": "技能A", "value": 80 },
    { "category": "技能B", "value": 70 },
    { "category": "技能C", "value": 90 },
    { "category": "技能D", "value": 60 }
  ]
}
```

#### 生成双轴图
```javascript
{
  "type": "dual-axes",
  "data": [
    { "category": "Q1", "value1": 100, "value2": 80 },
    { "category": "Q2", "value1": 120, "value2": 90 },
    { "category": "Q3", "value1": 110, "value2": 85 }
  ]
}
```

### 关系图表示例

#### 生成思维导图
```javascript
{
  "type": "mind-map",
  "data": [
    { "name": "想法1" },
    { "name": "想法2" },
    { "name": "想法3" },
    { "name": "想法4" }
  ]
}
```

#### 生成流程图
```javascript
{
  "type": "flow-diagram",
  "data": [
    { "name": "开始", "step": "start" },
    { "name": "处理", "step": "process" },
    { "name": "决策", "step": "decision" },
    { "name": "结束", "step": "end" }
  ]
}
```

#### 生成鱼骨图
```javascript
{
  "type": "fishbone-diagram",
  "data": [
    { "cause": "人员因素" },
    { "cause": "设备因素" },
    { "cause": "材料因素" },
    { "cause": "方法因素" }
  ]
}
```

## 🔧 自定义配置

### 图表尺寸
```javascript
{
  "type": "line",
  "data": [...],
  "width": 800,
  "height": 600
}
```

## 📦 部署到无网络环境

### 1. 准备部署包

```bash
# 在有网络的环境中
git clone <repository>
cd mcp-server-chart
npm install
npm run build

# 打包整个项目目录
tar -czf mcp-server-chart-offline.tar.gz .
```

### 2. 在目标环境部署

```bash
# 解压到目标环境
tar -xzf mcp-server-chart-offline.tar.gz
cd mcp-server-chart

# 直接运行（不需要 npm install）
node build/index.js
```

## 🧪 测试功能

### 快速测试
运行简单测试脚本：
```bash
node simple-test.js
```

### 全面测试
运行所有图表类型测试：
```bash
node test-all-charts.js
```

预期输出：
```
🚀 Testing all chart types in offline mode...

📊 Testing line chart...
   ✅ Success! Length: 798, Time: 0ms
📊 Testing bar chart...
   ✅ Success! Length: 1098, Time: 0ms
...

📈 Test Summary:
================
✅ Successful: 14/14
❌ Failed: 0/14

📊 Performance Stats:
   Average generation time: 0.14ms
   Average result size: 1323 characters

🎉 All tests completed!
```

## 🔍 技术实现

### 图表生成流程

1. **接收请求** - MCP 客户端发送图表生成请求
2. **数据处理** - 解析图表类型和数据
3. **SVG 生成** - 使用纯 JavaScript 生成 SVG 图表
4. **格式化输出** - 返回包含SVG代码和描述信息的JSON格式
5. **返回结果** - 便于在对话界面中显示和使用

### 输出格式

所有图表都以JSON格式返回，包含以下信息：

```json
{
  "type": "bar",
  "description": "柱状图 - 比较不同类别的数据",
  "svg": "<svg width=\"400\" height=\"300\" xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
  "dataPoints": 3,
  "size": "400x300",
  "status": "success"
}
```

**字段说明：**
- `type`: 图表类型
- `description`: 图表描述信息
- `svg`: 完整的SVG代码
- `dataPoints`: 数据点数量
- `size`: 图表尺寸
- `status`: 生成状态（success/error）

### 使用SVG代码

生成的SVG代码可以：
- 直接保存为 `.svg` 文件在浏览器中打开
- 复制到在线SVG查看器中预览
- 嵌入到HTML页面中显示
- 转换为其他图片格式（PNG、JPG等）

## 🎯 优势对比

| 特性 | 在线版本 | 离线版本 |
|------|----------|----------|
| 网络依赖 | ✅ 需要 | ❌ 不需要 |
| 响应速度 | 🐌 网络延迟 | ⚡ 即时响应 |
| 图表类型 | 🎨 15+ 种 | 📊 15 种全支持 |
| 图表质量 | 🎨 专业级 | 📊 简洁实用 |
| 部署复杂度 | 🔧 需配置服务 | 🚀 开箱即用 |
| 资源占用 | 💾 依赖外部服务 | 🪶 轻量级 |
| 数据安全 | ⚠️ 数据上传云端 | 🔒 完全本地处理 |

## 🛠️ 故障排除

### 常见问题

1. **图表不显示**
   - 检查数据格式是否正确
   - 确认图表类型是否支持
   - 验证数据字段名称（如 value、category、x、y 等）

2. **构建失败**
   - 运行 `npm install` 重新安装依赖
   - 检查 Node.js 版本（需要 >= 18）

3. **MCP 客户端连接失败**
   - 检查路径配置是否正确
   - 确认 build 目录存在
   - 验证文件权限

4. **特定图表类型错误**
   - 检查数据结构是否符合该图表类型的要求
   - 参考上面的示例数据格式

### 调试模式

启用详细日志：

```bash
DEBUG=* node build/index.js
```

### 数据格式要求

不同图表类型对数据格式有特定要求：

- **折线图/面积图**: `{ time/x: number, value/y: number }`
- **柱状图**: `{ category/name: string, value: number }`
- **饼图**: `{ category/name: string, value: number }`
- **散点图**: `{ x: number, y: number }`
- **词云图**: `{ text/word: string, value: number }`
- **雷达图**: `{ category: string, value: number }`
- **双轴图**: `{ category: string, value1: number, value2: number }`

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**🎉 现在您可以在完全无网络的环境下使用所有15种图表类型的 MCP 图表生成服务了！** 