/**
 * Claude Code 配置的 Zod 验证 Schema
 * 对应真实的 Claude Code settings.json 结构
 */

import { z } from 'zod';

/**
 * Claude Code 配置 Schema
 * 验证规则：
 * - cleanupPeriodDays: 正整数
 * - env: 字符串键值对
 * - permissions.allow: 字符串数组
 * - hooks: 复杂嵌套结构
 */
export const claudeConfigSchema = z.object({
  cleanupPeriodDays: z.number().int().positive().optional(),
  env: z.record(z.string()).optional(),
  attribution: z
    .object({
      commit: z.string().optional(),
      pr: z.string().optional(),
    })
    .optional(),
  permissions: z
    .object({
      allow: z.array(z.string()).optional(),
      defaultMode: z.string().optional(),
    })
    .optional(),
  hooks: z.record(z.any()).optional(),
  enabledPlugins: z.record(z.any()).optional(),
  outputStyle: z.string().optional(),
  language: z.string().optional(),
  spinnerTipsEnabled: z.boolean().optional(),
  alwaysThinkingEnabled: z.boolean().optional(),
  skipDangerousModePermissionPrompt: z.boolean().optional(),
  showTurnDuration: z.boolean().optional(),
});

export type ClaudeConfigInput = z.infer<typeof claudeConfigSchema>;
