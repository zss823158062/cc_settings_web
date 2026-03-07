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
 * 基于真实的 Claude Code settings.json 结构
 */
export const claudeFields: FormField[] = [
  // 基础配置
  {
    name: 'cleanupPeriodDays',
    label: '清理周期（天）',
    type: 'number',
    required: false,
    defaultValue: 720,
    placeholder: '720',
    helpText: '自动清理旧数据的周期，单位：天',
  },
  {
    name: 'outputStyle',
    label: '输出样式',
    type: 'text',
    required: false,
    defaultValue: 'Structural Thinking',
    placeholder: 'Structural Thinking',
    helpText: '输出样式，如 Structural Thinking',
  },
  {
    name: 'language',
    label: '语言',
    type: 'text',
    required: false,
    defaultValue: 'Chinese',
    placeholder: 'Chinese',
    helpText: '界面语言设置',
  },
  // UI 设置
  {
    name: 'spinnerTipsEnabled',
    label: '启用 Spinner 提示',
    type: 'boolean',
    required: false,
    defaultValue: false,
    helpText: '是否显示加载动画提示',
  },
  {
    name: 'alwaysThinkingEnabled',
    label: '始终启用思考模式',
    type: 'boolean',
    required: false,
    defaultValue: false,
    helpText: '是否始终启用思考模式',
  },
  {
    name: 'skipDangerousModePermissionPrompt',
    label: '跳过危险模式权限提示',
    type: 'boolean',
    required: false,
    defaultValue: true,
    helpText: '是否跳过危险操作的权限确认',
  },
  {
    name: 'showTurnDuration',
    label: '显示回合时长',
    type: 'boolean',
    required: false,
    defaultValue: false,
    helpText: '是否显示每个回合的执行时长',
  },
  // 环境变量（使用 object 类型，需要特殊处理）
  {
    name: 'env',
    label: '环境变量',
    type: 'object',
    required: false,
    defaultValue: {},
    helpText: '环境变量键值对配置',
  },
  // 权限配置
  {
    name: 'permissions.allow',
    label: '允许的权限',
    type: 'array',
    required: false,
    defaultValue: [],
    placeholder: 'Bash(find:*)',
    helpText: '允许执行的命令模式列表',
  },
  {
    name: 'permissions.defaultMode',
    label: '默认权限模式',
    type: 'text',
    required: false,
    defaultValue: 'default',
    placeholder: 'default',
    helpText: '默认权限模式',
  },
  // 归属信息
  {
    name: 'attribution.commit',
    label: 'Commit 归属',
    type: 'text',
    required: false,
    defaultValue: '',
    placeholder: '',
    helpText: 'Commit 归属信息',
  },
  {
    name: 'attribution.pr',
    label: 'PR 归属',
    type: 'text',
    required: false,
    defaultValue: '',
    placeholder: '',
    helpText: 'Pull Request 归属信息',
  },
  // Hooks 和 enabledPlugins 使用 JSON 编辑器
  {
    name: 'hooks',
    label: 'Hooks 配置',
    type: 'json',
    required: false,
    defaultValue: {},
    helpText: 'Hooks 配置（JSON 格式）',
  },
  {
    name: 'enabledPlugins',
    label: '启用的插件',
    type: 'json',
    required: false,
    defaultValue: {},
    helpText: '启用的插件配置（JSON 格式）',
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
