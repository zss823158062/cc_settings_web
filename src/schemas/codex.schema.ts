/**
 * Codex 配置的 Zod 验证 Schema
 */
import { z } from 'zod';

export const codexSchema = z.object({
  api: z.object({
    key: z
      .string()
      .min(1, '此字段为必填项')
      .min(20, 'API Key 长度必须大于 20')
      .startsWith('sk-', 'API Key 必须以 sk- 开头'),
    base_url: z
      .string()
      .min(1, '此字段为必填项')
      .url('请输入有效的 URL 地址')
      .startsWith('http', 'URL 必须以 http:// 或 https:// 开头'),
  }),
  model: z.object({
    name: z.string().min(1, '此字段为必填项'),
    temperature: z
      .number()
      .min(0, '温度参数必须在 0-2 之间')
      .max(2, '温度参数必须在 0-2 之间'),
    max_tokens: z
      .number()
      .int('最大 token 数必须是整数')
      .positive('最大 token 数必须是正整数')
      .max(100000, '最大 token 数不能超过 100000'),
  }),
  behavior: z.object({
    auto_save: z.boolean(),
    timeout: z
      .number()
      .int('超时时间必须是整数')
      .positive('超时时间必须是正整数')
      .min(1, '超时时间至少为 1 秒')
      .max(300, '超时时间不能超过 300 秒'),
  }),
});

export type CodexFormData = z.infer<typeof codexSchema>;
