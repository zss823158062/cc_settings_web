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
export function validateApiKey(_key: string, _tool: ToolType): { valid: boolean; error?: string } {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}

/**
 * 验证 URL 格式
 * @param url - URL 字符串
 * @returns 是否为有效的 HTTP/HTTPS URL
 */
export function validateURL(_url: string): boolean {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}

/**
 * 验证数值范围
 * @param value - 数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function validateNumberRange(_value: number, _min: number, _max: number): boolean {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}

/**
 * 获取字段的验证错误信息
 * @param fieldName - 字段名
 * @param value - 字段值
 * @param field - 字段定义
 * @returns 错误信息，无错误返回 null
 */
export function getFieldError(_fieldName: string, _value: any, _field: FormField): string | null {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}
