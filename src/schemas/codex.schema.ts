/**
 * Codex 配置的 Zod 验证 Schema
 */
import { z } from 'zod';

export const codexSchema = z.object({
  // 核心配置
  model: z.string().optional(),
  approval_policy: z.enum(['on-request', 'untrusted', 'never']).optional(),
  sandbox_mode: z.enum(['workspace-write', 'read-only', 'danger-full-access']).optional(),
  web_search: z.enum(['cached', 'live', 'disabled']).optional(),
  model_reasoning_effort: z.enum(['high', 'medium', 'low']).optional(),
  personality: z.enum(['friendly', 'pragmatic', 'none']).optional(),
  log_dir: z.string().optional(),
  review_model: z.string().optional(),
  service_tier: z.enum(['free', 'pro', 'team']).optional(),
  commit_attribution: z.string().optional(),
  developer_instructions: z.string().optional(),
  compact_prompt: z.boolean().optional(),
  background_terminal_max_timeout: z.number().int().positive().optional(),
  tool_output_token_limit: z.number().int().positive().optional(),
  model_auto_compact_token_limit: z.number().int().positive().optional(),
  check_for_update_on_startup: z.boolean().optional(),
  hide_agent_reasoning: z.boolean().optional(),
  plan_mode_reasoning_effort: z.enum(['high', 'medium', 'low']).optional(),
  model_reasoning_summary: z.boolean().optional(),

  // 模型配置
  model_provider: z.string().optional(),
  model_verbosity: z.enum(['low', 'medium', 'high']).optional(),
  model_context_window: z.number().int().positive().optional(),

  // 安全配置
  allow_login_shell: z.boolean().optional(),

  // Shell 环境策略
  shell_environment_policy: z
    .object({
      inherit: z.enum(['none', 'core']).optional(),
      exclude: z.array(z.string()).optional(),
      include_only: z.array(z.string()).optional(),
    })
    .optional(),

  // 项目配置
  project_root_markers: z.array(z.string()).optional(),
  project_doc_max_bytes: z.number().int().positive().optional(),

  // UI 配置
  tui: z
    .object({
      notifications: z.boolean().optional(),
      animations: z.boolean().optional(),
      alternate_screen: z.boolean().optional(),
    })
    .optional(),

  file_opener: z.enum(['vscode', 'cursor', 'windsurf']).optional(),

  // 历史配置
  history: z
    .object({
      persistence: z.enum(['none', 'local']).optional(),
      max_bytes: z.number().int().positive().optional(),
      retention_days: z.number().int().positive().optional(),
    })
    .optional(),

  // 工具配置
  tools: z
    .object({
      disabled: z.array(z.string()).optional(),
      timeout: z.number().int().positive().optional(),
    })
    .optional(),

  // 沙箱工作区写入配置
  sandbox_workspace_write: z
    .object({
      allowed_paths: z.array(z.string()).optional(),
      denied_paths: z.array(z.string()).optional(),
    })
    .optional(),

  // 记忆配置
  memories: z
    .object({
      enabled: z.boolean().optional(),
      directory: z.string().optional(),
    })
    .optional(),

  // 遥测配置
  otel: z
    .object({
      exporter: z.enum(['none', 'otlp-http', 'otlp-grpc']).optional(),
      log_user_prompt: z.boolean().optional(),
      endpoint: z.string().optional(),
      sampling_rate: z.number().min(0).max(1).optional(),
      service_name: z.string().optional(),
      enable_tracing: z.boolean().optional(),
      enable_metrics: z.boolean().optional(),
    })
    .optional(),

  analytics: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),

  feedback: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),

  // Windows 特定配置
  windows: z
    .object({
      sandbox: z.enum(['elevated', 'unelevated']).optional(),
    })
    .optional(),

  // 功能标志
  features: z
    .object({
      shell_snapshot: z.boolean().optional(),
      multi_agent: z.boolean().optional(),
      unified_exec: z.boolean().optional(),
      auto_memory: z.boolean().optional(),
      context_compression: z.boolean().optional(),
      streaming_output: z.boolean().optional(),
      code_review: z.boolean().optional(),
      git_integration: z.boolean().optional(),
    })
    .optional(),

  // 权限配置
  permissions: z
    .object({
      network: z
        .object({
          allowed_domains: z.array(z.string()).optional(),
          blocked_domains: z.array(z.string()).optional(),
          allow_all: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),

  // 代理配置
  agents: z
    .object({
      max_concurrent: z.number().int().positive().optional(),
      timeout: z.number().int().positive().optional(),
      enabled_types: z.array(z.string()).optional(),
      communication_mode: z.enum(['direct', 'queue', 'broadcast']).optional(),
    })
    .optional(),

  // 模型提供商配置
  model_providers: z
    .record(
      z.object({
        base_url: z.string().optional(),
        name: z.string().optional(),
        requires_openai_auth: z.boolean().optional(),
        wire_api: z.string().optional(),
        api_key: z.string().optional(),
        models: z.array(z.string()).optional(),
        timeout: z.number().int().positive().optional(),
      })
    )
    .optional(),

  // MCP 服务器配置
  mcp_servers: z
    .record(
      z.object({
        command: z.string().optional(),
        args: z.array(z.string()).optional(),
        env: z.record(z.string()).optional(),
        enabled: z.boolean().optional(),
      })
    )
    .optional(),

  // 插件服务器配置
  plugin_servers: z
    .record(
      z.object({
        command: z.string().optional(),
        args: z.array(z.string()).optional(),
        env: z.record(z.string()).optional(),
        enabled: z.boolean().optional(),
      })
    )
    .optional(),
});

export type CodexFormData = z.infer<typeof codexSchema>;
