/**
 * Claude Code 配置的 Zod 验证 Schema
 * 对应真实的 Claude Code settings.json 结构
 */
import { z } from 'zod';

export const claudeSchema = z.object({
  cleanupPeriodDays: z.number().int().positive().optional(),
  env: z.record(z.string()).optional(),
  env_array: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
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

export type ClaudeFormData = z.infer<typeof claudeSchema>;
