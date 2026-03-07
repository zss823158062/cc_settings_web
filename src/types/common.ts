/**
 * 通用类型定义
 * 定义文件操作、导入导出等通用类型
 */

import type { ConfigValues } from './config';

/** 文件导出选项 */
export interface ExportOptions {
  /** 文件名，不含扩展名 */
  filename: string;
  /** 文件格式：json | toml */
  format: 'json' | 'toml';
  /** 配置内容 */
  content: string;
}

/** 文件导入结果 */
export interface ImportResult {
  /** 是否成功 */
  success: boolean;
  /** 解析后的配置值（成功时） */
  data?: ConfigValues;
  /** 错误信息（失败时） */
  error?: string;
}
