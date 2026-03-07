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
  /** API 密钥，格式：sk-ant- 开头 */
  apiKey: string;
  /** 模型名称，如 claude-sonnet-4, claude-opus-4 */
  model: string;
  workspace: {
    /** 是否自动保存 */
    autoSave: boolean;
    /** 忽略的文件模式列表，如 ["node_modules", ".git"] */
    ignorePatterns: string[];
  };
  editor: {
    /** Tab 缩进大小，正整数，通常 2 或 4 */
    tabSize: number;
    /** 保存时是否格式化 */
    formatOnSave: boolean;
  };
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
