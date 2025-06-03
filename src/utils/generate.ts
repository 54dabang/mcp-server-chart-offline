import { generateChartUrlOffline } from "./generate-offline";

/**
 * Generate a chart URL using offline chart generation.
 * @param type The type of chart to generate
 * @param options Chart options
 * @returns {Promise<string>} The generated chart URL.
 * @throws {Error} If the chart generation fails.
 */
export async function generateChartUrl(
  type: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  options: Record<string, any>,
): Promise<string> {
  // 直接使用离线模式生成图表
  return await generateChartUrlOffline(type, options);
}
