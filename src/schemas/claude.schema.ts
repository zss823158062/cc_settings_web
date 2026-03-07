/**
 * Claude Code 配置的 Zod 验证 Schema
 */
import { z } from 'zod';

export const claudeSchema = z.object({
  apiKey: z
    .string()
    .min(1, '此字段为必填项')
    .min(20, 'API Key 长度必须大于 20')
    .startsWith('sk-ant-', 'API Key 必须以 sk-ant- 开头'),
  model: z.string().min(1, '此字段为必填项'),
  workspace: z.object({
    autoSave: z.boolean(),
    ignorePatterns: z.array(z.string()).default([]),
  }),
  editor: z.object({
    tabSize: z
      .number()
      .int('Tab 缩进大小必须是整数')
      .positive('Tab 缩进大小必须是正整数')
      .min(1, 'Tab 缩进大小至少为 1')
      .max(8, 'Tab 缩进大小不能超过 8'),
    formatOnSave: z.boolean(),
  }),
});

export type ClaudeFormData = z.infer<typeof claudeSchema>;
