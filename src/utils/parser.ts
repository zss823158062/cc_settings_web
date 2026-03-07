/**
 * 配置解析和生成模块
 * 提供 JSON/TOML 格式的配置文件解析和生成功能
 */

import * as TOML from '@iarna/toml';
import type { CodexConfig, ClaudeConfig, GeminiConfig, ToolType, ConfigValues } from '@/types/config';

/**
 * 将配置对象转换为 JSON 字符串
 * @param config - 配置对象
 * @param pretty - 是否格式化输出，默认 true
 * @returns 格式化的 JSON 字符串
 */
export function stringifyJSON(config: ClaudeConfig | GeminiConfig, pretty: boolean = true): string {
  if (pretty) {
    return JSON.stringify(config, null, 2);
  }
  return JSON.stringify(config);
}

/**
 * 将配置对象转换为 TOML 字符串
 * @param config - Codex 配置对象
 * @returns TOML 格式字符串
 */
export function stringifyTOML(config: CodexConfig): string {
  return TOML.stringify(config as unknown as TOML.JsonMap);
}

/**
 * 解析 JSON 字符串为配置对象
 * @param content - JSON 字符串
 * @returns 解析后的配置对象
 * @throws 格式错误时抛出异常
 */
export function parseJSON<T = ClaudeConfig | GeminiConfig>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`JSON 格式错误: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 解析 TOML 字符串为配置对象
 * @param content - TOML 字符串
 * @returns 解析后的 Codex 配置对象
 * @throws 格式错误时抛出异常
 */
export function parseTOML(content: string): CodexConfig {
  try {
    return TOML.parse(content) as unknown as CodexConfig;
  } catch (error) {
    throw new Error(`TOML 格式错误: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 根据工具类型生成配置字符串
 * @param tool - 工具类型
 * @param config - 配置对象
 * @returns 配置文件字符串（JSON 或 TOML）
 */
export function generateConfigString(tool: ToolType, config: ConfigValues): string {
  if (tool === 'codex') {
    return stringifyTOML(config as CodexConfig);
  } else {
    return stringifyJSON(config as ClaudeConfig | GeminiConfig);
  }
}
