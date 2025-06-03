import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateChartUrlOffline } from './build/utils/generate-offline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 解析 JSON 请求体
function parseJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// 发送 JSON 响应
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...corsHeaders
  });
  res.end(JSON.stringify(data));
}

// 发送 HTML 响应
function sendHTML(res, html) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    ...corsHeaders
  });
  res.end(html);
}

// 创建服务器
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

  try {
    // 处理 OPTIONS 请求（CORS 预检）
    if (req.method === 'OPTIONS') {
      res.writeHead(200, corsHeaders);
      res.end();
      return;
    }

    // 首页 - 演示页面
    if (pathname === '/' || pathname === '/demo') {
      try {
        const html = readFileSync(join(__dirname, 'demo.html'), 'utf-8');
        sendHTML(res, html);
      } catch (error) {
        res.writeHead(404, corsHeaders);
        res.end('Demo page not found');
      }
      return;
    }

    // 健康检查
    if (pathname === '/health') {
      sendJSON(res, {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'MCP Chart Server - Offline Demo'
      });
      return;
    }

    // 图表生成 API
    if (pathname === '/api/generate-chart' && req.method === 'POST') {
      try {
        const body = await parseJSON(req);
        const { type, data, width = 400, height = 300 } = body;

        if (!type) {
          sendJSON(res, { error: 'Chart type is required' }, 400);
          return;
        }

        if (!data || !Array.isArray(data)) {
          sendJSON(res, { error: 'Data array is required' }, 400);
          return;
        }

        const startTime = Date.now();
        const chartUrl = await generateChartUrlOffline(type, { data, width, height });
        const endTime = Date.now();

        sendJSON(res, {
          success: true,
          chartUrl,
          type,
          generationTime: endTime - startTime,
          dataPoints: data.length,
          size: { width, height }
        });

      } catch (error) {
        console.error('Chart generation error:', error);
        sendJSON(res, {
          success: false,
          error: error.message || 'Chart generation failed'
        }, 500);
      }
      return;
    }

    // 批量生成图表 API
    if (pathname === '/api/generate-charts' && req.method === 'POST') {
      try {
        const body = await parseJSON(req);
        const { charts } = body;

        if (!charts || !Array.isArray(charts)) {
          sendJSON(res, { error: 'Charts array is required' }, 400);
          return;
        }

        const startTime = Date.now();
        const results = [];

        for (const chart of charts) {
          const { type, data, width = 400, height = 300 } = chart;
          
          try {
            const chartStartTime = Date.now();
            const chartUrl = await generateChartUrlOffline(type, { data, width, height });
            const chartEndTime = Date.now();

            results.push({
              type,
              success: true,
              chartUrl,
              generationTime: chartEndTime - chartStartTime,
              dataPoints: data ? data.length : 0
            });
          } catch (error) {
            results.push({
              type,
              success: false,
              error: error.message
            });
          }
        }

        const endTime = Date.now();

        sendJSON(res, {
          success: true,
          results,
          totalTime: endTime - startTime,
          totalCharts: charts.length,
          successCount: results.filter(r => r.success).length
        });

      } catch (error) {
        console.error('Batch chart generation error:', error);
        sendJSON(res, {
          success: false,
          error: error.message || 'Batch chart generation failed'
        }, 500);
      }
      return;
    }

    // 获取支持的图表类型
    if (pathname === '/api/chart-types' && req.method === 'GET') {
      sendJSON(res, {
        chartTypes: [
          { type: 'line', name: '折线图', description: '显示数据趋势和变化' },
          { type: 'bar', name: '柱状图', description: '比较不同类别的数据' },
          { type: 'column', name: '柱状图', description: '比较不同类别的数据' },
          { type: 'pie', name: '饼图', description: '显示数据占比和分布' },
          { type: 'area', name: '面积图', description: '显示数据变化趋势和累积效果' },
          { type: 'histogram', name: '直方图', description: '显示数据分布频率' },
          { type: 'scatter', name: '散点图', description: '显示两个变量之间的关系' },
          { type: 'word-cloud', name: '词云图', description: '可视化文本数据的重要性' },
          { type: 'radar', name: '雷达图', description: '多维数据对比分析' },
          { type: 'treemap', name: '树状图', description: '层次化数据的面积展示' },
          { type: 'dual-axes', name: '双轴图', description: '同时展示两个不同量级的数据系列' },
          { type: 'mind-map', name: '思维导图', description: '展示概念之间的层次关系' },
          { type: 'network-graph', name: '网络图', description: '显示节点和连接关系' },
          { type: 'flow-diagram', name: '流程图', description: '展示步骤和流程' },
          { type: 'fishbone-diagram', name: '鱼骨图', description: '因果关系分析图' }
        ]
      });
      return;
    }

    // API 文档
    if (pathname === '/api' || pathname === '/api/') {
      const apiDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>MCP Chart Server API</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #1890ff; font-weight: bold; }
            pre { background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>🚀 MCP Chart Server API</h1>
          <p>完全离线的图表生成服务 API</p>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> /health</h3>
            <p>健康检查</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> /api/chart-types</h3>
            <p>获取支持的图表类型列表</p>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">POST</span> /api/generate-chart</h3>
            <p>生成单个图表</p>
            <pre>{
  "type": "line",
  "data": [{"time": 2020, "value": 100}],
  "width": 400,
  "height": 300
}</pre>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">POST</span> /api/generate-charts</h3>
            <p>批量生成图表</p>
            <pre>{
  "charts": [
    {"type": "line", "data": [...]},
    {"type": "bar", "data": [...]}
  ]
}</pre>
          </div>
          
          <div class="endpoint">
            <h3><span class="method">GET</span> /demo</h3>
            <p>查看演示页面</p>
          </div>
        </body>
        </html>
      `;
      sendHTML(res, apiDoc);
      return;
    }

    // 404 - 未找到
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Path ${pathname} not found`,
      availableEndpoints: [
        'GET /',
        'GET /demo',
        'GET /health',
        'GET /api',
        'GET /api/chart-types',
        'POST /api/generate-chart',
        'POST /api/generate-charts'
      ]
    }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }));
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 MCP Chart Server Demo running at:`);
  console.log(`   📊 Demo Page: http://localhost:${PORT}/demo`);
  console.log(`   📚 API Docs:  http://localhost:${PORT}/api`);
  console.log(`   ❤️  Health:    http://localhost:${PORT}/health`);
  console.log(`\n✨ Features:`);
  console.log(`   • 15 chart types supported`);
  console.log(`   • Completely offline`);
  console.log(`   • SVG-based charts`);
  console.log(`   • RESTful API`);
  console.log(`\n🔧 Press Ctrl+C to stop`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 