/**
 * 模板相关类型定义
 * 定义配置模板结构
 */

import type { ToolType, ConfigValues } from './config';

/** 配置模板 */
export interface ConfigTemplate {
  /** 模板唯一标识，格式：{tool}-{scenario}，如 codex-dev */
  id: string;
  /** 模板显示名称 */
  name: string;
  /** 模板描述，说明适用场景 */
  description: string;
  /** 适用的工具类型 */
  tool: ToolType;
  /** 预设的配置值 */
  values: ConfigValues;
}
