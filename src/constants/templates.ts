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
  description: '适合开发调试，温度较高，自动保存，超时时间较长',
  tool: 'codex',
  values: {
    api: {
      key: '',
      base_url: 'https://api.openai.com/v1',
    },
    model: {
      name: 'gpt-4',
      temperature: 0.8,
      max_tokens: 2048,
    },
    behavior: {
      auto_save: true,
      timeout: 60,
    },
  } as CodexConfig,
};

/** Codex 生产环境模板 */
const codexProdTemplate: ConfigTemplate = {
  id: 'codex-prod',
  name: '生产环境',
  description: '适合生产使用，温度较低，关闭自动保存，超时时间适中',
  tool: 'codex',
  values: {
    api: {
      key: '',
      base_url: 'https://api.openai.com/v1',
    },
    model: {
      name: 'gpt-4',
      temperature: 0.3,
      max_tokens: 2048,
    },
    behavior: {
      auto_save: false,
      timeout: 30,
    },
  } as CodexConfig,
};

/** Codex 安全模式模板 */
const codexSecureTemplate: ConfigTemplate = {
  id: 'codex-secure',
  name: '安全模式',
  description: '适合安全敏感场景，温度极低，token 限制严格',
  tool: 'codex',
  values: {
    api: {
      key: '',
      base_url: 'https://api.openai.com/v1',
    },
    model: {
      name: 'gpt-3.5-turbo',
      temperature: 0.1,
      max_tokens: 1024,
    },
    behavior: {
      auto_save: false,
      timeout: 30,
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
