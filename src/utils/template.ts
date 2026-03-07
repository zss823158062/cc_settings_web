/**
 * 模板管理模块
 * 提供配置模板的获取和应用功能
 */

import type { ToolType, ConfigValues } from '@/types/config';
import type { ConfigTemplate } from '@/types/template';
import { ALL_TEMPLATES } from '@/constants/templates';

/**
 * 获取指定工具的所有模板
 * @param tool - 工具类型
 * @returns 模板列表
 */
export function getTemplatesByTool(tool: ToolType): ConfigTemplate[] {
  return ALL_TEMPLATES.filter((template) => template.tool === tool);
}

/**
 * 根据模板 ID 获取模板
 * @param templateId - 模板 ID
 * @returns 模板对象，不存在返回 null
 */
export function getTemplateById(templateId: string): ConfigTemplate | null {
  const template = ALL_TEMPLATES.find((t) => t.id === templateId);
  return template || null;
}

/**
 * 应用模板到表单
 * @param templateId - 模板 ID
 * @returns 模板的配置值，不存在返回 null
 */
export function applyTemplate(templateId: string): ConfigValues | null {
  const template = getTemplateById(templateId);
  if (!template) {
    return null;
  }
  // 返回模板值的深拷贝，避免修改原始模板
  return JSON.parse(JSON.stringify(template.values)) as ConfigValues;
}
