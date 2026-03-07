/**
 * Gemini CLI 配置的 Zod 验证 Schema
 */
import { z } from 'zod';

const safetyLevelEnum = z.enum([
  'BLOCK_NONE',
  'BLOCK_LOW_AND_ABOVE',
  'BLOCK_MEDIUM_AND_ABOVE',
  'BLOCK_HIGH',
]);

export const geminiSchema = z.object({
  apiKey: z
    .string()
    .min(1, '此字段为必填项')
    .startsWith('AIza', 'API Key 必须以 AIza 开头'),
  projectId: z.string().min(1, '此字段为必填项'),
  region: z.string().min(1, '此字段为必填项'),
  model: z.string().min(1, '此字段为必填项'),
  safetySettings: z.object({
    harassment: safetyLevelEnum,
    hateSpeech: safetyLevelEnum,
  }),
});

export type GeminiFormData = z.infer<typeof geminiSchema>;
