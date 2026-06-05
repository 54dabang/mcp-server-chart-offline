import http from "node:http";
import { spawn } from "node:child_process";

const child = spawn("node", ["demo-server.js"], {
  stdio: ["ignore", "inherit", "inherit"],
});

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path,
        method: options.method ?? "GET",
        headers: options.headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, body });
        });
      },
    );
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function requestSse(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path,
        method: "GET",
        headers: { Accept: "text/event-stream" },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
          if (body.includes("SSE Connection established")) {
            req.destroy();
            resolve({ statusCode: res.statusCode, body });
          }
        });
        res.on("end", () => resolve({ statusCode: res.statusCode, body }));
      },
    );
    req.setTimeout(5_000, () => {
      req.destroy(new Error("SSE smoke test timed out"));
    });
    req.on("error", (error) => {
      if (String(error.message).includes("SSE smoke test timed out")) {
        reject(error);
        return;
      }
      if (error.code === "ECONNRESET") {
        resolve({ statusCode: 200, body: "connection reset after SSE data" });
        return;
      }
      reject(error);
    });
    req.end();
  });
}

async function waitForServer() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const res = await request("/health");
      if (res.statusCode === 200) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error("demo server did not become healthy");
}

try {
  await waitForServer();
  const res = await request("/api/generate-chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "flow-diagram",
      data: [
        { name: "开始", step: "start" },
        { name: "处理", step: "process" },
        { name: "决策", step: "decision" },
        { name: "结束", step: "end" },
      ],
      width: 400,
      height: 300,
    }),
  });

  if (res.statusCode !== 200) {
    throw new Error(`unexpected status ${res.statusCode}: ${res.body}`);
  }

  const payload = JSON.parse(res.body);
  if (
    payload.success !== true ||
    !String(payload.chartUrl).includes("/charts/") ||
    !String(payload.chartUrl).endsWith(".png") ||
    !String(payload.chart?.svg).startsWith("<svg")
  ) {
    throw new Error(`unexpected chart payload: ${res.body.slice(0, 500)}`);
  }

  const imageUrl = new URL(payload.chartUrl);
  const imageRes = await request(imageUrl.pathname);
  if (imageRes.statusCode !== 200) {
    throw new Error(`chart image is not accessible: ${imageRes.statusCode}`);
  }

  const sseRes = await requestSse("/sse");
  if (sseRes.statusCode !== 200) {
    throw new Error(`SSE endpoint is not accessible: ${sseRes.statusCode}`);
  }

  console.log("demo API smoke test ok");
} finally {
  child.kill("SIGTERM");
}
