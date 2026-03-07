/**
 * 模板管理模块
 * 提供配置模板的获取和应用功能
 */

import type { ToolType, ConfigValues } from '@/types/config';
import type { ConfigTemplate } from '@/types/template';

/**
 * 获取指定工具的所有模板
 * @param tool - 工具类型
 * @returns 模板列表
 */
export function getTemplatesByTool(_tool: ToolType): ConfigTemplate[] {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}

/**
 * 根据模板 ID 获取模板
 * @param templateId - 模板 ID
 * @returns 模板对象，不存在返回 null
 */
export function getTemplateById(_templateId: string): ConfigTemplate | null {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}

/**
 * 应用模板到表单
 * @param templateId - 模板 ID
 * @returns 模板的配置值，不存在返回 null
 */
export function applyTemplate(_templateId: string): ConfigValues | null {
  // TODO: 由 BE-3 实现
  throw new Error('Not implemented');
}
