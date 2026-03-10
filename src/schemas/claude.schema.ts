/**
 * Claude Code 配置的 Zod 验证 Schema
 * 对应真实的 Claude Code settings.json 结构
 */
import { z } from 'zod';

export const claudeSchema = z.object({
  // 基础配置
  apiKeyHelper: z.string().optional(),
  cleanupPeriodDays: z.number().int().positive().optional(),
  companyAnnouncements: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
  env_array: z.array(z.object({ key: z.string(), value: z.string() })).optional(),

  // 归属配置
  attribution: z
    .object({
      commit: z.string().optional(),
      pr: z.string().optional(),
    })
    .optional(),
  includeCoAuthoredBy: z.boolean().optional(),

  // 权限配置
  permissions: z
    .object({
      allow: z.array(z.string()).optional(),
      ask: z.array(z.string()).optional(),
      deny: z.array(z.string()).optional(),
      additionalDirectories: z.array(z.string()).optional(),
      defaultMode: z.string().optional(),
      disableBypassPermissionsMode: z.string().optional(),
    })
    .optional(),

  // Hooks 和 MCP 配置
  hooks: z.record(z.any()).optional(),
  disableAllHooks: z.boolean().optional(),
  allowManagedHooksOnly: z.boolean().optional(),
  allowedHttpHookUrls: z.array(z.string()).optional(),
  httpHookAllowedEnvVars: z.array(z.string()).optional(),
  allowManagedPermissionRulesOnly: z.boolean().optional(),
  allowManagedMcpServersOnly: z.boolean().optional(),

  // 模型配置
  model: z.string().optional(),
  availableModels: z.array(z.string()).optional(),

  // 监控和遥测
  otelHeadersHelper: z.string().optional(),

  // UI 配置
  statusLine: z
    .object({
      type: z.literal('command').optional(),
      command: z.string().optional(),
    })
    .optional(),
  fileSuggestion: z
    .object({
      type: z.literal('command').optional(),
      command: z.string().optional(),
    })
    .optional(),
  respectGitignore: z.boolean().optional(),
  outputStyle: z.string().optional(),
  language: z.string().optional(),
  spinnerTipsEnabled: z.boolean().optional(),
  spinnerTipsOverride: z
    .object({
      excludeDefault: z.boolean().optional(),
      tips: z.array(z.string()).optional(),
    })
    .optional(),
  spinnerVerbs: z
    .object({
      mode: z.enum(['replace', 'append']).optional(),
      verbs: z.array(z.string()).optional(),
    })
    .optional(),
  terminalProgressBarEnabled: z.boolean().optional(),
  prefersReducedMotion: z.boolean().optional(),
  showTurnDuration: z.boolean().optional(),

  // 认证和登录
  forceLoginMethod: z.enum(['claudeai', 'console']).optional(),
  forceLoginOrgUUID: z.string().optional(),

  // MCP 配置
  enableAllProjectMcpServers: z.boolean().optional(),
  enabledMcpjsonServers: z.array(z.string()).optional(),
  disabledMcpjsonServers: z.array(z.string()).optional(),
  allowedMcpServers: z.array(z.object({ serverName: z.string() })).optional(),
  deniedMcpServers: z.array(z.object({ serverName: z.string() })).optional(),

  // Plugin Marketplace 配置
  strictKnownMarketplaces: z
    .array(z.object({ source: z.string(), repo: z.string() }))
    .optional(),
  blockedMarketplaces: z
    .array(z.object({ source: z.string(), repo: z.string() }))
    .optional(),

  // AWS 配置
  awsAuthRefresh: z.string().optional(),
  awsCredentialExport: z.string().optional(),

  // 高级功能
  alwaysThinkingEnabled: z.boolean().optional(),
  plansDirectory: z.string().optional(),
  fastModePerSessionOptIn: z.boolean().optional(),
  teammateMode: z.enum(['auto', 'in-process', 'tmux']).optional(),
  autoUpdatesChannel: z.enum(['stable', 'latest']).optional(),

  // 已弃用或向后兼容
  enabledPlugins: z.record(z.any()).optional(),
  skipDangerousModePermissionPrompt: z.boolean().optional(),
});

export type ClaudeFormData = z.infer<typeof claudeSchema>;
