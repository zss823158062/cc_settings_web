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
  // 清理空对象和空字符串
  const cleanConfig = (obj: any, parentKey?: string): any => {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.length > 0 ? obj : undefined;

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // 跳过空值
      if (value === null || value === undefined || value === '') continue;

      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanConfig(value, key);
        // 只有当清理后的对象不为空时才添加
        if (cleanedValue !== undefined && Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else if (Array.isArray(value)) {
        const cleanedValue = cleanConfig(value, key);
        if (cleanedValue !== undefined && cleanedValue.length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        // 非对象非数组的值直接添加
        cleaned[key] = value;
      }
    }

    // 特殊处理：如果是 statusLine 或 fileSuggestion 对象，且只有 type 字段没有 command，则返回 undefined
    if ((parentKey === 'statusLine' || parentKey === 'fileSuggestion') &&
        cleaned.type && !cleaned.command) {
      return undefined;
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  };

  const cleaned = cleanConfig(config);
  if (pretty) {
    return JSON.stringify(cleaned, null, 2);
  }
  return JSON.stringify(cleaned);
}

/**
 * 将配置对象转换为 TOML 字符串
 * @param config - Codex 配置对象
 * @returns TOML 格式字符串
 */
export function stringifyTOML(config: CodexConfig): string {
  // 清理空值和空对象
  const cleanConfig = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.length > 0 ? obj : undefined;

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // 跳过空值
      if (value === null || value === undefined || value === '') continue;

      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanConfig(value);
        // 只有当清理后的对象不为空时才添加
        if (cleanedValue !== undefined && Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else if (Array.isArray(value)) {
        const cleanedValue = cleanConfig(value);
        if (cleanedValue !== undefined && cleanedValue.length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        // 非对象非数组的值直接添加
        cleaned[key] = value;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  };

  const cleaned = cleanConfig(config) || {};
  return TOML.stringify(cleaned as unknown as TOML.JsonMap);
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
