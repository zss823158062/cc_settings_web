/**
 * 表单字段定义
 * 包含 Codex、Claude Code、Gemini CLI 的表单字段配置
 */

import type { FormField } from '../types/form';

/**
 * Codex 表单字段定义
 */
export const codexFields: FormField[] = [
  {
    name: 'api.key',
    label: 'API Key',
    type: 'text',
    required: true,
    defaultValue: '',
    placeholder: 'sk-...',
    helpText: 'OpenAI API 密钥，格式：sk- 开头，长度 > 20',
  },
  {
    name: 'api.base_url',
    label: 'API Base URL',
    type: 'text',
    required: true,
    defaultValue: 'https://api.openai.com/v1',
    placeholder: 'https://api.openai.com/v1',
    helpText: 'API 基础 URL，默认为 OpenAI 官方地址',
  },
  {
    name: 'model.name',
    label: '模型名称',
    type: 'text',
    required: true,
    defaultValue: 'gpt-4',
    placeholder: 'gpt-4',
    helpText: '使用的模型名称，如 gpt-4, gpt-3.5-turbo',
  },
  {
    name: 'model.temperature',
    label: '温度参数',
    type: 'number',
    required: true,
    defaultValue: 0.7,
    placeholder: '0.7',
    helpText: '控制随机性，范围 0-2，值越高越随机',
  },
  {
    name: 'model.max_tokens',
    label: '最大 Token 数',
    type: 'number',
    required: true,
    defaultValue: 2048,
    placeholder: '2048',
    helpText: '单次请求的最大 token 数，正整数，< 100000',
  },
  {
    name: 'behavior.auto_save',
    label: '自动保存',
    type: 'boolean',
    required: true,
    defaultValue: true,
    helpText: '是否自动保存配置',
  },
  {
    name: 'behavior.timeout',
    label: '超时时间（秒）',
    type: 'number',
    required: true,
    defaultValue: 60,
    placeholder: '60',
    helpText: '请求超时时间，建议 30-120 秒',
  },
];

/**
 * Claude Code 表单字段定义
 */
export const claudeFields: FormField[] = [
  {
    name: 'apiKey',
    label: 'API Key',
    type: 'text',
    required: true,
    defaultValue: '',
    placeholder: 'sk-ant-...',
    helpText: 'Claude API 密钥，格式：sk-ant- 开头',
  },
  {
    name: 'model',
    label: '模型名称',
    type: 'text',
    required: true,
    defaultValue: 'claude-sonnet-4',
    placeholder: 'claude-sonnet-4',
    helpText: '使用的模型名称，如 claude-sonnet-4, claude-opus-4',
  },
  {
    name: 'workspace.autoSave',
    label: '自动保存',
    type: 'boolean',
    required: true,
    defaultValue: true,
    helpText: '是否自动保存工作区',
  },
  {
    name: 'workspace.ignorePatterns',
    label: '忽略的文件模式',
    type: 'array',
    required: false,
    defaultValue: ['node_modules', '.git'],
    placeholder: 'node_modules',
    helpText: '忽略的文件或目录模式列表',
  },
  {
    name: 'editor.tabSize',
    label: 'Tab 缩进大小',
    type: 'number',
    required: true,
    defaultValue: 2,
    placeholder: '2',
    helpText: 'Tab 缩进大小，通常为 2 或 4',
  },
  {
    name: 'editor.formatOnSave',
    label: '保存时格式化',
    type: 'boolean',
    required: true,
    defaultValue: true,
    helpText: '保存文件时是否自动格式化',
  },
];

/**
 * Gemini CLI 表单字段定义
 */
export const geminiFields: FormField[] = [
  {
    name: 'apiKey',
    label: 'API Key',
    type: 'text',
    required: true,
    defaultValue: '',
    placeholder: 'AIza...',
    helpText: 'Gemini API 密钥，格式：AIza 开头',
  },
  {
    name: 'projectId',
    label: '项目 ID',
    type: 'text',
    required: true,
    defaultValue: '',
    placeholder: 'my-project',
    helpText: 'Google Cloud 项目 ID',
  },
  {
    name: 'region',
    label: '区域',
    type: 'text',
    required: true,
    defaultValue: 'us-central1',
    placeholder: 'us-central1',
    helpText: '服务区域，如 us-central1, asia-east1',
  },
  {
    name: 'model',
    label: '模型名称',
    type: 'text',
    required: true,
    defaultValue: 'gemini-pro',
    placeholder: 'gemini-pro',
    helpText: '使用的模型名称，如 gemini-pro, gemini-ultra',
  },
  {
    name: 'safetySettings.harassment',
    label: '骚扰内容过滤级别',
    type: 'select',
    required: true,
    defaultValue: 'BLOCK_MEDIUM_AND_ABOVE',
    helpText: '骚扰内容的过滤级别',
    options: [
      { label: '不过滤', value: 'BLOCK_NONE' },
      { label: '低级及以上', value: 'BLOCK_LOW_AND_ABOVE' },
      { label: '中级及以上', value: 'BLOCK_MEDIUM_AND_ABOVE' },
      { label: '仅高级', value: 'BLOCK_HIGH' },
    ],
  },
  {
    name: 'safetySettings.hateSpeech',
    label: '仇恨言论过滤级别',
    type: 'select',
    required: true,
    defaultValue: 'BLOCK_MEDIUM_AND_ABOVE',
    helpText: '仇恨言论的过滤级别',
    options: [
      { label: '不过滤', value: 'BLOCK_NONE' },
      { label: '低级及以上', value: 'BLOCK_LOW_AND_ABOVE' },
      { label: '中级及以上', value: 'BLOCK_MEDIUM_AND_ABOVE' },
      { label: '仅高级', value: 'BLOCK_HIGH' },
    ],
  },
];
