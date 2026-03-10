/**
 * 配置模板常量定义
 * 提供各工具的预设配置模板
 */

import type { ConfigTemplate } from '@/types/template';
import type { CodexConfig, ClaudeConfig, GeminiConfig } from '@/types/config';

/** Codex 开发环境模板 */
const codexDevTemplate: ConfigTemplate = {
  id: 'codex-dev',
  name: '开发环境',
  description: '适合开发调试，启用多代理和实验性功能',
  tool: 'codex',
  values: {
    model: 'gpt-5.4',
    approval_policy: 'on-request',
    sandbox_mode: 'workspace-write',
    web_search: 'cached',
    personality: 'friendly',
    allow_login_shell: false,
    project_root_markers: ['.git'],
    service_tier: 'pro',
    check_for_update_on_startup: true,
    features: {
      shell_snapshot: true,
      multi_agent: true,
      unified_exec: true,
      auto_memory: true,
      context_compression: true,
      streaming_output: true,
      code_review: true,
      git_integration: true,
    },
    tui: {
      notifications: true,
      animations: true,
      alternate_screen: true,
    },
    history: {
      persistence: 'local',
      retention_days: 30,
    },
    otel: {
      exporter: 'otlp-http',
      endpoint: 'http://localhost:4318',
      sampling_rate: 1.0,
      service_name: 'codex-dev',
      enable_tracing: true,
      enable_metrics: true,
      log_user_prompt: false,
    },
    analytics: {
      enabled: true,
    },
    feedback: {
      enabled: true,
    },
    agents: {
      max_concurrent: 5,
      timeout: 300,
      communication_mode: 'direct',
    },
    permissions: {
      network: {
        allow_all: true,
      },
    },
    model_providers: {
      'local-llm': {
        base_url: 'http://127.0.0.1:11434',
        name: 'local-llm',
        requires_openai_auth: false,
        wire_api: 'responses',
      },
    },
  } as CodexConfig,
};

/** Codex 生产环境模板 */
const codexProdTemplate: ConfigTemplate = {
  id: 'codex-prod',
  name: '生产环境',
  description: '适合生产使用，禁用实验性功能，严格审批',
  tool: 'codex',
  values: {
    model: 'gpt-5.4',
    approval_policy: 'on-request',
    sandbox_mode: 'workspace-write',
    web_search: 'disabled',
    personality: 'pragmatic',
    allow_login_shell: false,
    project_root_markers: ['.git'],
    service_tier: 'team',
    compact_prompt: true,
    hide_agent_reasoning: true,
    features: {
      shell_snapshot: false,
      multi_agent: false,
      unified_exec: false,
      auto_memory: false,
      context_compression: true,
      streaming_output: true,
      code_review: true,
      git_integration: true,
    },
    history: {
      persistence: 'local',
      retention_days: 90,
    },
    otel: {
      exporter: 'otlp-http',
      endpoint: 'http://localhost:4318',
      sampling_rate: 0.1,
      service_name: 'codex-prod',
      enable_tracing: true,
      enable_metrics: true,
      log_user_prompt: false,
    },
    analytics: {
      enabled: false,
    },
    agents: {
      max_concurrent: 3,
      timeout: 600,
      communication_mode: 'queue',
    },
    permissions: {
      network: {
        allow_all: false,
        allowed_domains: ['github.com', 'gitlab.com'],
      },
    },
  } as CodexConfig,
};

/** Codex 安全模式模板 */
const codexSecureTemplate: ConfigTemplate = {
  id: 'codex-secure',
  name: '安全模式',
  description: '适合安全敏感场景，只读沙箱，不信任审批',
  tool: 'codex',
  values: {
    model: 'gpt-5.4',
    approval_policy: 'untrusted',
    sandbox_mode: 'read-only',
    web_search: 'disabled',
    personality: 'pragmatic',
    allow_login_shell: false,
    project_root_markers: ['.git'],
    service_tier: 'free',
    compact_prompt: true,
    shell_environment_policy: {
      inherit: 'none',
      include_only: ['PATH', 'HOME'],
    },
    features: {
      shell_snapshot: false,
      multi_agent: false,
      unified_exec: false,
      auto_memory: false,
      context_compression: false,
      streaming_output: false,
      code_review: false,
      git_integration: false,
    },
    tools: {
      disabled: ['Bash'],
    },
    sandbox_workspace_write: {
      denied_paths: ['/etc', '/usr', '/bin'],
    },
    history: {
      persistence: 'none',
    },
    otel: {
      exporter: 'none',
      log_user_prompt: false,
      enable_tracing: false,
      enable_metrics: false,
    },
    analytics: {
      enabled: false,
    },
    feedback: {
      enabled: false,
    },
    agents: {
      max_concurrent: 1,
      timeout: 120,
      communication_mode: 'direct',
    },
    permissions: {
      network: {
        allow_all: false,
        blocked_domains: ['*'],
      },
    },
  } as CodexConfig,
};

/** Claude Code 开发环境模板 */
const claudeDevTemplate: ConfigTemplate = {
  id: 'claude-dev',
  name: '开发环境',
  description: '适合开发调试，启用思考模式，显示回合时长',
  tool: 'claude',
  values: {
    cleanupPeriodDays: 720,
    env: {
      ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      ANTHROPIC_BASE_URL: 'http://127.0.0.1:18100',
      CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: '95',
      CLAUDE_CODE_ATTRIBUTION_HEADER: '0',
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
      CLAUDE_CODE_PROXY_RESOLVES_HOSTS: '1',
      DISABLE_INSTALLATION_CHECKS: '1',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      MAX_THINKING_TOKENS: '31999',
    },
    attribution: {
      commit: '',
      pr: '',
    },
    permissions: {
      allow: ['Bash(find:*)', 'Bash(grep:*)', 'Bash(tree:*)', 'Bash(jq:*)'],
      defaultMode: 'default',
    },
    hooks: {},
    enabledPlugins: {},
    outputStyle: 'Structural Thinking',
    language: 'Chinese',
    spinnerTipsEnabled: false,
    alwaysThinkingEnabled: true,
    skipDangerousModePermissionPrompt: true,
    showTurnDuration: true,
  } as ClaudeConfig,
};

/** Claude Code 生产环境模板 */
const claudeProdTemplate: ConfigTemplate = {
  id: 'claude-prod',
  name: '生产环境',
  description: '适合生产使用，关闭调试功能，严格权限控制',
  tool: 'claude',
  values: {
    cleanupPeriodDays: 720,
    env: {
      ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      ANTHROPIC_BASE_URL: 'http://127.0.0.1:18100',
      CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: '95',
      CLAUDE_CODE_ATTRIBUTION_HEADER: '0',
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
      CLAUDE_CODE_PROXY_RESOLVES_HOSTS: '1',
      DISABLE_INSTALLATION_CHECKS: '1',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    attribution: {
      commit: '',
      pr: '',
    },
    permissions: {
      allow: ['Bash(find:*)', 'Bash(grep:*)'],
      defaultMode: 'default',
    },
    hooks: {},
    enabledPlugins: {},
    outputStyle: 'Structural Thinking',
    language: 'Chinese',
    spinnerTipsEnabled: false,
    alwaysThinkingEnabled: false,
    skipDangerousModePermissionPrompt: false,
    showTurnDuration: false,
  } as ClaudeConfig,
};

/** Claude Code 安全模式模板 */
const claudeSecureTemplate: ConfigTemplate = {
  id: 'claude-secure',
  name: '安全模式',
  description: '适合安全敏感场景，最小权限，禁用危险操作',
  tool: 'claude',
  values: {
    cleanupPeriodDays: 720,
    env: {
      ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      ANTHROPIC_BASE_URL: 'http://127.0.0.1:18100',
      CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: '95',
      CLAUDE_CODE_ATTRIBUTION_HEADER: '0',
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
      DISABLE_INSTALLATION_CHECKS: '1',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    },
    attribution: {
      commit: '',
      pr: '',
    },
    permissions: {
      allow: [],
      defaultMode: 'default',
    },
    hooks: {},
    enabledPlugins: {},
    outputStyle: 'Structural Thinking',
    language: 'Chinese',
    spinnerTipsEnabled: false,
    alwaysThinkingEnabled: false,
    skipDangerousModePermissionPrompt: false,
    showTurnDuration: false,
  } as ClaudeConfig,
};

/** Gemini CLI 开发环境模板 */
const geminiDevTemplate: ConfigTemplate = {
  id: 'gemini-dev',
  name: '开发环境',
  description: '适合开发调试，较宽松的安全设置',
  tool: 'gemini',
  values: {
    apiKey: '',
    projectId: 'my-project',
    region: 'us-central1',
    model: 'gemini-pro',
    safetySettings: {
      harassment: 'BLOCK_MEDIUM_AND_ABOVE',
      hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  } as GeminiConfig,
};

/** Gemini CLI 生产环境模板 */
const geminiProdTemplate: ConfigTemplate = {
  id: 'gemini-prod',
  name: '生产环境',
  description: '适合生产使用，使用更强大的模型',
  tool: 'gemini',
  values: {
    apiKey: '',
    projectId: 'my-project',
    region: 'us-central1',
    model: 'gemini-ultra',
    safetySettings: {
      harassment: 'BLOCK_MEDIUM_AND_ABOVE',
      hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  } as GeminiConfig,
};

/** Gemini CLI 安全模式模板 */
const geminiSecureTemplate: ConfigTemplate = {
  id: 'gemini-secure',
  name: '安全模式',
  description: '适合安全敏感场景，严格的内容过滤',
  tool: 'gemini',
  values: {
    apiKey: '',
    projectId: 'my-project',
    region: 'us-central1',
    model: 'gemini-pro',
    safetySettings: {
      harassment: 'BLOCK_LOW_AND_ABOVE',
      hateSpeech: 'BLOCK_LOW_AND_ABOVE',
    },
  } as GeminiConfig,
};

/** 所有模板列表 */
export const ALL_TEMPLATES: ConfigTemplate[] = [
  codexDevTemplate,
  codexProdTemplate,
  codexSecureTemplate,
  claudeDevTemplate,
  claudeProdTemplate,
  claudeSecureTemplate,
  geminiDevTemplate,
  geminiProdTemplate,
  geminiSecureTemplate,
];
