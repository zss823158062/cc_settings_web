/**
 * Gemini CLI 配置的 Zod 验证 Schema
 * 对应 JSON 格式配置
 */

import { z } from 'zod';

/**
 * 安全过滤级别枚举
 */
const safetyLevelEnum = z.enum([
  'BLOCK_NONE',
  'BLOCK_LOW_AND_ABOVE',
  'BLOCK_MEDIUM_AND_ABOVE',
  'BLOCK_HIGH',
]);

/**
 * Gemini CLI 配置 Schema
 * 验证规则：
 * - apiKey: AIza 开头
 * - projectId: 非空字符串
 * - region: 非空字符串
 * - model: 非空字符串
 * - safetySettings: 使用预定义的枚举值
 */
export const geminiConfigSchema = z.object({
  apiKey: z
    .string()
    .min(1, '此字段为必填项')
    .startsWith('AIza', 'API Key 必须以 AIza 开头'),
  projectId: z
    .string()
    .min(1, '此字段为必填项'),
  region: z
    .string()
    .min(1, '此字段为必填项'),
  model: z
    .string()
    .min(1, '此字段为必填项'),
  safetySettings: z.object({
    harassment: safetyLevelEnum,
    hateSpeech: safetyLevelEnum,
  }),
});

export type GeminiConfigInput = z.infer<typeof geminiConfigSchema>;
