/**
 * 配置相关类型定义
 * 定义 Codex、Claude Code、Gemini CLI 的配置结构
 */

/** 工具类型枚举 */
export type ToolType = 'codex' | 'claude' | 'gemini';

/** Codex 配置结构（对应 TOML 格式） */
export interface CodexConfig {
  api: {
    /** API 密钥，格式：sk- 开头，长度 > 20 */
    key: string;
    /** API 基础 URL，默认 https://api.openai.com/v1 */
    base_url: string;
  };
  model: {
    /** 模型名称，如 gpt-4, gpt-3.5-turbo */
    name: string;
    /** 温度参数，范围 0-2，控制随机性 */
    temperature: number;
    /** 最大 token 数，正整数，< 100000 */
    max_tokens: number;
  };
  behavior: {
    /** 是否自动保存，布尔值 */
    auto_save: boolean;
    /** 超时时间（秒），正整数，建议 30-120 */
    timeout: number;
  };
}

/** Claude Code 配置结构（对应 JSON 格式） */
export interface ClaudeConfig {
  /** 清理周期（天），默认 720 */
  cleanupPeriodDays?: number;
  /** 环境变量配置 */
  env?: Record<string, string>;
  /** 归属信息 */
  attribution?: {
    commit?: string;
    pr?: string;
  };
  /** 权限配置 */
  permissions?: {
    allow?: string[];
    defaultMode?: string;
  };
  /** Hooks 配置（复杂嵌套结构） */
  hooks?: Record<string, any>;
  /** 启用的插件 */
  enabledPlugins?: Record<string, any>;
  /** 输出样式 */
  outputStyle?: string;
  /** 语言设置 */
  language?: string;
  /** 是否启用 Spinner 提示 */
  spinnerTipsEnabled?: boolean;
  /** 是否始终启用思考模式 */
  alwaysThinkingEnabled?: boolean;
  /** 是否跳过危险模式权限提示 */
  skipDangerousModePermissionPrompt?: boolean;
  /** 是否显示回合时长 */
  showTurnDuration?: boolean;
}

/** Gemini CLI 配置结构（对应 JSON 格式） */
export interface GeminiConfig {
  /** API 密钥，格式：AIza 开头 */
  apiKey: string;
  /** 项目 ID，字符串 */
  projectId: string;
  /** 区域，如 us-central1, asia-east1 */
  region: string;
  /** 模型名称，如 gemini-pro, gemini-ultra */
  model: string;
  safetySettings: {
    /** 骚扰内容过滤级别：BLOCK_NONE | BLOCK_LOW_AND_ABOVE | BLOCK_MEDIUM_AND_ABOVE | BLOCK_HIGH */
    harassment: string;
    /** 仇恨言论过滤级别 */
    hateSpeech: string;
  };
}

/** 统一配置值类型（用于表单状态） */
export type ConfigValues = CodexConfig | ClaudeConfig | GeminiConfig;
