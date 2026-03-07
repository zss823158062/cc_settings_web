/**
 * Claude Code 配置的 Zod 验证 Schema
 * 对应 JSON 格式配置
 */

import { z } from 'zod';

/**
 * Claude Code 配置 Schema
 * 验证规则：
 * - apiKey: sk-ant- 开头
 * - model: 非空字符串
 * - workspace.ignorePatterns: 字符串数组
 * - editor.tabSize: 正整数，通常 2 或 4
 */
export const claudeConfigSchema = z.object({
  apiKey: z
    .string()
    .min(1, '此字段为必填项')
    .startsWith('sk-ant-', 'API Key 必须以 sk-ant- 开头'),
  model: z
    .string()
    .min(1, '此字段为必填项'),
  workspace: z.object({
    autoSave: z.boolean(),
    ignorePatterns: z
      .array(z.string())
      .default([]),
  }),
  editor: z.object({
    tabSize: z
      .number()
      .int('Tab 缩进大小必须是整数')
      .positive('Tab 缩进大小必须是正整数')
      .min(1, 'Tab 缩进大小至少为 1')
      .max(8, 'Tab 缩进大小不应超过 8'),
    formatOnSave: z.boolean(),
  }),
});

export type ClaudeConfigInput = z.infer<typeof claudeConfigSchema>;
