/**
 * Codex 配置的 Zod 验证 Schema
 * 对应 TOML 格式配置
 */

import { z } from 'zod';

/**
 * Codex 配置 Schema
 * 验证规则：
 * - api.key: sk- 开头，长度 > 20
 * - api.base_url: 有效的 HTTP/HTTPS URL
 * - model.temperature: 0-2 之间
 * - model.max_tokens: 正整数，< 100000
 * - behavior.timeout: 正整数，建议 30-120
 */
export const codexConfigSchema = z.object({
  api: z.object({
    key: z
      .string()
      .min(1, '此字段为必填项')
      .min(20, 'API Key 长度必须大于 20')
      .startsWith('sk-', 'API Key 必须以 sk- 开头'),
    base_url: z
      .string()
      .min(1, '此字段为必填项')
      .url('必须是有效的 HTTP/HTTPS URL')
      .default('https://api.openai.com/v1'),
  }),
  model: z.object({
    name: z
      .string()
      .min(1, '此字段为必填项'),
    temperature: z
      .number()
      .min(0, '温度参数必须在 0-2 之间')
      .max(2, '温度参数必须在 0-2 之间'),
    max_tokens: z
      .number()
      .int('最大 token 数必须是整数')
      .positive('最大 token 数必须是正整数')
      .max(100000, '最大 token 数必须小于 100000'),
  }),
  behavior: z.object({
    auto_save: z.boolean(),
    timeout: z
      .number()
      .int('超时时间必须是整数')
      .positive('超时时间必须是正整数')
      .min(30, '超时时间建议在 30-120 秒之间')
      .max(120, '超时时间建议在 30-120 秒之间'),
  }),
});

export type CodexConfigInput = z.infer<typeof codexConfigSchema>;
