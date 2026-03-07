/**
 * 验证工具模块
 * 提供 API Key、URL、数值范围等验证功能
 */

import type { ToolType } from '@/types/config';
import type { FormField } from '@/types/form';

/**
 * 验证 API Key 格式
 * @param key - API Key 字符串
 * @param tool - 工具类型（不同工具有不同的格式要求）
 * @returns 验证结果，{ valid: boolean, error?: string }
 */
export function validateApiKey(key: string, tool: ToolType): { valid: boolean; error?: string } {
  if (!key || key.trim().length === 0) {
    return { valid: false, error: 'API Key 不能为空' };
  }

  const trimmedKey = key.trim();

  // 根据不同工具验证格式
  switch (tool) {
    case 'codex':
      // Codex 使用 OpenAI API Key，格式：sk- 开头，长度 > 20
      if (!trimmedKey.startsWith('sk-')) {
        return { valid: false, error: 'Codex API Key 必须以 sk- 开头' };
      }
      if (trimmedKey.length <= 20) {
        return { valid: false, error: 'API Key 长度必须大于 20 个字符' };
      }
      break;

    case 'claude':
      // Claude Code 使用 Anthropic API Key，格式：sk-ant- 开头
      if (!trimmedKey.startsWith('sk-ant-')) {
        return { valid: false, error: 'Claude API Key 必须以 sk-ant- 开头' };
      }
      if (trimmedKey.length <= 20) {
        return { valid: false, error: 'API Key 长度必须大于 20 个字符' };
      }
      break;

    case 'gemini':
      // Gemini CLI 使用 Google API Key，格式：AIza 开头
      if (!trimmedKey.startsWith('AIza')) {
        return { valid: false, error: 'Gemini API Key 必须以 AIza 开头' };
      }
      if (trimmedKey.length < 20) {
        return { valid: false, error: 'API Key 长度必须至少 20 个字符' };
      }
      break;

    default:
      return { valid: false, error: '不支持的工具类型' };
  }

  return { valid: true };
}

/**
 * 验证 URL 格式
 * @param url - URL 字符串
 * @returns 是否为有效的 HTTP/HTTPS URL
 */
export function validateURL(url: string): boolean {
  if (!url || url.trim().length === 0) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 验证数值范围
 * @param value - 数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function validateNumberRange(value: number, min: number, max: number): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }
  return value >= min && value <= max;
}

/**
 * 获取字段的验证错误信息
 * @param fieldName - 字段名
 * @param value - 字段值
 * @param field - 字段定义
 * @returns 错误信息，无错误返回 null
 */
export function getFieldError(fieldName: string, value: any, field: FormField): string | null {
  // 检查必填字段
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return '此字段为必填项';
    }
    // 数组类型必填检查
    if (field.type === 'array' && Array.isArray(value) && value.length === 0) {
      return '此字段至少需要一个值';
    }
  }

  // 如果值为空且非必填，跳过其他验证
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // 根据字段类型进行验证
  switch (field.type) {
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return '请输入有效的数字';
      }
      // 检查特定字段的范围
      if (fieldName.includes('temperature')) {
        if (!validateNumberRange(value, 0, 2)) {
          return '温度参数必须在 0-2 之间';
        }
      } else if (fieldName.includes('max_tokens')) {
        if (!validateNumberRange(value, 1, 100000)) {
          return '最大 token 数必须在 1-100000 之间';
        }
      } else if (fieldName.includes('timeout')) {
        if (!validateNumberRange(value, 1, 600)) {
          return '超时时间必须在 1-600 秒之间';
        }
      } else if (fieldName.includes('tabSize')) {
        if (!validateNumberRange(value, 1, 8)) {
          return 'Tab 缩进大小必须在 1-8 之间';
        }
      }
      break;

    case 'text':
      if (typeof value !== 'string') {
        return '请输入有效的文本';
      }
      // 检查 URL 字段
      if (fieldName.includes('url') || fieldName.includes('base_url')) {
        if (!validateURL(value)) {
          return '请输入有效的 HTTP/HTTPS 地址';
        }
      }
      break;

    case 'array':
      if (!Array.isArray(value)) {
        return '此字段必须是数组';
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return '此字段必须是布尔值';
      }
      break;
  }

  return null;
}
