/**
 * 表单相关类型定义
 * 定义表单字段、验证错误等类型
 */

/** 表单字段定义 */
export interface FormField {
  /** 字段名称，对应配置对象的键路径，如 "api.key" */
  name: string;
  /** 显示标签，用户可见的字段名 */
  label: string;
  /** 字段类型：text | number | boolean | select | array */
  type: 'text' | 'number' | 'boolean' | 'select' | 'array';
  /** 是否必填 */
  required: boolean;
  /** 默认值 */
  defaultValue: any;
  /** 占位符文本 */
  placeholder?: string;
  /** 帮助提示文本 */
  helpText?: string;
  /** 选项列表（仅 select 类型） */
  options?: Array<{ label: string; value: string }>;
}

/** 验证错误类型 */
export type ValidationErrors = Record<string, string>;
