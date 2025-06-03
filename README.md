# 🚀 MCP Server Chart - 完全离线版本

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

一个完全离线的 Model Context Protocol (MCP) 图表生成服务器，支持 15 种图表类型，无需网络连接即可生成高质量的 SVG 图表。

## ✨ 主要特性

- 🌐 **完全离线** - 无需任何网络连接
- 📊 **15种图表类型** - 涵盖基础图表、统计图表、高级图表和关系图表
- ⚡ **即时响应** - 平均生成时间 < 1ms
- 🪶 **轻量级** - 纯 SVG 生成，无外部依赖
- 🔌 **MCP 兼容** - 完全兼容 Model Context Protocol
- 🛡️ **数据安全** - 所有数据本地处理，不上传云端
- 🎨 **高质量输出** - Base64 编码的 SVG data URL

## 📊 支持的图表类型

### 基础图表
- 📈 **折线图** (line) - 显示数据趋势和变化
- 📊 **柱状图** (bar/column) - 比较不同类别的数据
- 🥧 **饼图** (pie) - 显示数据占比和分布
- 📈 **面积图** (area) - 显示数据变化趋势和累积效果

### 统计图表
- 📊 **直方图** (histogram) - 显示数据分布频率
- ⚪ **散点图** (scatter) - 显示两个变量之间的关系

### 高级图表
- ☁️ **词云图** (word-cloud) - 可视化文本数据的重要性
- 🎯 **雷达图** (radar) - 多维数据对比分析
- 🗂️ **树状图** (treemap) - 层次化数据的面积展示
- 📊 **双轴图** (dual-axes) - 同时展示两个不同量级的数据系列

### 关系图表
- 🧠 **思维导图** (mind-map) - 展示概念之间的层次关系
- 🕸️ **网络图** (network-graph) - 显示节点和连接关系
- 🔄 **流程图** (flow-diagram) - 展示步骤和流程
- 🐟 **鱼骨图** (fishbone-diagram) - 因果关系分析图

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 运行方式

#### 1. MCP 服务器模式

```bash
# 默认 stdio 模式
node build/index.js

# SSE 模式（可通过 HTTP 访问）
node build/index.js --transport sse --port 1122

# Streamable 模式
node build/index.js --transport streamable --port 1122
```

#### 2. 演示服务器模式

```bash
# 启动演示服务器
node demo-server.js
```

然后访问：
- 📊 演示页面: http://localhost:3000/demo
- 📚 API 文档: http://localhost:3000/api
- ❤️ 健康检查: http://localhost:3000/health

### MCP 客户端配置

在您的 MCP 客户端配置文件中添加：

```json
{
  "mcpServers": {
    "mcp-server-chart-offline": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-chart/build/index.js"
      ],
      "cwd": "/path/to/mcp-server-chart"
    }
  }
}
```

## 📋 使用示例

### 基础图表

#### 折线图
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

#### 柱状图
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

#### 饼图
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

### 高级图表

#### 词云图
```javascript
{
  "type": "word-cloud",
  "data": [
    { "text": "JavaScript", "value": 50 },
    { "text": "Python", "value": 40 },
    { "text": "React", "value": 35 }
  ]
}
```

#### 雷达图
```javascript
{
  "type": "radar",
  "data": [
    { "category": "技能A", "value": 80 },
    { "category": "技能B", "value": 70 },
    { "category": "技能C", "value": 90 }
  ]
}
```

### 关系图表

#### 流程图
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

## 🔧 API 接口

### REST API

#### 生成单个图表
```http
POST /api/generate-chart
Content-Type: application/json

{
  "type": "line",
  "data": [{"time": 2020, "value": 100}],
  "width": 400,
  "height": 300
}
```

#### 批量生成图表
```http
POST /api/generate-charts
Content-Type: application/json

{
  "charts": [
    {"type": "line", "data": [...]},
    {"type": "bar", "data": [...]}
  ]
}
```

#### 获取支持的图表类型
```http
GET /api/chart-types
```

### MCP 工具

项目提供以下 MCP 工具：

- `generate_line_chart` - 生成折线图
- `generate_column_chart` - 生成柱状图
- `generate_area_chart` - 生成面积图
- `generate_pie_chart` - 生成饼图
- `generate_bar_chart` - 生成条形图
- `generate_histogram_chart` - 生成直方图
- `generate_scatter_chart` - 生成散点图
- `generate_word_cloud_chart` - 生成词云图
- `generate_radar_chart` - 生成雷达图
- `generate_treemap_chart` - 生成树状图
- `generate_dual_axes_chart` - 生成双轴图
- `generate_mind_map` - 生成思维导图
- `generate_network_graph` - 生成网络图
- `generate_flow_diagram` - 生成流程图
- `generate_fishbone_diagram` - 生成鱼骨图

## 🧪 测试

### 快速测试
```bash
node simple-test.js
```

### 全面测试
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
```

## 📦 部署

### 无网络环境部署

1. **准备部署包**
```bash
# 在有网络的环境中
git clone <repository>
cd mcp-server-chart
npm install
npm run build

# 打包整个项目目录
tar -czf mcp-server-chart-offline.tar.gz .
```

2. **在目标环境部署**
```bash
# 解压到目标环境
tar -xzf mcp-server-chart-offline.tar.gz
cd mcp-server-chart

# 直接运行（不需要 npm install）
node build/index.js
```

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY build/ ./build/
COPY demo.html ./
COPY demo-server.js ./

EXPOSE 3000
CMD ["node", "demo-server.js"]
```

## 🎯 性能指标

| 指标 | 数值 |
|------|------|
| 支持图表类型 | 15 种 |
| 平均生成时间 | < 1ms |
| 平均输出大小 | ~1.3KB |
| 内存占用 | < 50MB |
| 网络依赖 | 0 |
| 启动时间 | < 2s |

## 🔍 技术架构

### 核心组件

- **图表生成器** (`src/utils/generate-offline.ts`) - 纯 JavaScript SVG 生成
- **MCP 服务器** (`src/server.ts`) - Model Context Protocol 实现
- **工具定义** (`src/index.ts`) - MCP 工具注册和处理
- **演示服务器** (`demo-server.js`) - HTTP API 和演示页面

### 数据流程

1. **接收请求** - MCP 客户端或 HTTP 请求
2. **数据验证** - 检查图表类型和数据格式
3. **SVG 生成** - 根据类型生成对应的 SVG 图表
4. **Base64 编码** - 转换为 data URL 格式
5. **返回结果** - 可直接使用的图片 URL

## 🛠️ 开发

### 项目结构

```
mcp-server-chart/
├── src/
│   ├── index.ts              # MCP 工具定义
│   ├── server.ts             # MCP 服务器实现
│   └── utils/
│       ├── constants.ts      # 图表类型映射
│       ├── generate.ts       # 主生成函数
│       ├── generate-offline.ts # 离线生成实现
│       └── ...
├── build/                    # 编译输出
├── demo.html                 # 演示页面
├── demo-server.js           # 演示服务器
├── test-all-charts.js       # 测试脚本
├── OFFLINE_USAGE.md         # 离线使用文档
└── package.json
```

### 添加新图表类型

1. 在 `src/utils/constants.ts` 中添加映射
2. 在 `src/utils/generate-offline.ts` 中实现生成函数
3. 在 `src/index.ts` 中注册 MCP 工具
4. 添加测试用例

### 构建命令

```bash
npm run build      # 编译 TypeScript
npm run start      # 启动 MCP 服务器
npm run test       # 运行测试
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [AntV](https://antv.antgroup.com/) - 原始图表库灵感
- [Model Context Protocol](https://modelcontextprotocol.io/) - 协议规范
- 所有贡献者和用户

---

**🎉 现在您可以在完全无网络的环境下使用所有 15 种图表类型的 MCP 图表生成服务了！**

如有问题或建议，请提交 [Issue](https://github.com/your-repo/mcp-server-chart/issues)。
