/**
 * 配置相关类型定义
 * 定义 Codex、Claude Code、Gemini CLI 的配置结构
 */

/** 工具类型枚举 */
export type ToolType = 'codex' | 'claude' | 'gemini';

/** Codex 配置结构（对应 TOML 格式） */
export interface CodexConfig {
  // 核心配置
  /** 默认使用的模型，如 gpt-5.4 */
  model?: string;
  /** 审批策略：on-request, untrusted, never */
  approval_policy?: string;
  /** 沙箱模式：workspace-write, read-only, danger-full-access */
  sandbox_mode?: string;
  /** 网络搜索：cached, live, disabled */
  web_search?: string;
  /** 推理强度：high */
  model_reasoning_effort?: string;
  /** 个性化：friendly, pragmatic, none */
  personality?: string;
  /** 日志目录 */
  log_dir?: string;
  /** 审查模型 */
  review_model?: string;
  /** 服务层级：free, pro, team */
  service_tier?: string;
  /** 提交归属信息 */
  commit_attribution?: string;
  /** 开发者指令 */
  developer_instructions?: string;
  /** 紧凑提示 */
  compact_prompt?: boolean;
  /** 后台终端最大超时（秒） */
  background_terminal_max_timeout?: number;
  /** 工具输出令牌限制 */
  tool_output_token_limit?: number;
  /** 模型自动压缩令牌限制 */
  model_auto_compact_token_limit?: number;
  /** 启动时检查更新 */
  check_for_update_on_startup?: boolean;
  /** 隐藏代理推理 */
  hide_agent_reasoning?: boolean;
  /** 计划模式推理强度 */
  plan_mode_reasoning_effort?: string;
  /** 模型推理摘要 */
  model_reasoning_summary?: boolean;

  // 模型配置
  /** 模型提供商：proxy, ollama */
  model_provider?: string;
  /** 模型详细程度：low */
  model_verbosity?: string;
  /** 上下文窗口大小 */
  model_context_window?: number;

  // 安全配置
  /** 是否允许登录 shell */
  allow_login_shell?: boolean;

  // Shell 环境策略
  shell_environment_policy?: {
    /** 继承策略：none, core */
    inherit?: string;
    /** 排除的环境变量 */
    exclude?: string[];
    /** 仅包含的环境变量 */
    include_only?: string[];
  };

  // 项目配置
  /** 项目根标记 */
  project_root_markers?: string[];
  /** 项目文档最大字节数 */
  project_doc_max_bytes?: number;

  // UI 配置
  tui?: {
    /** 通知 */
    notifications?: boolean;
    /** 动画 */
    animations?: boolean;
    /** 备用屏幕 */
    alternate_screen?: boolean;
  };

  /** 文件打开器：vscode, cursor, windsurf */
  file_opener?: string;

  // 历史配置
  history?: {
    /** 持久化：none, local */
    persistence?: string;
    /** 最大字节数 */
    max_bytes?: number;
    /** 保留天数 */
    retention_days?: number;
  };

  // 工具配置
  tools?: {
    /** 禁用的工具列表 */
    disabled?: string[];
    /** 工具超时（秒） */
    timeout?: number;
  };

  // 沙箱工作区写入配置
  sandbox_workspace_write?: {
    /** 允许的路径 */
    allowed_paths?: string[];
    /** 禁止的路径 */
    denied_paths?: string[];
  };

  // 记忆配置
  memories?: {
    /** 是否启用记忆 */
    enabled?: boolean;
    /** 记忆目录 */
    directory?: string;
  };

  // 遥测配置
  otel?: {
    /** 导出器：none, otlp-http, otlp-grpc */
    exporter?: string;
    /** 记录用户提示 */
    log_user_prompt?: boolean;
    /** OTLP 端点 */
    endpoint?: string;
    /** 采样率 (0.0-1.0) */
    sampling_rate?: number;
    /** 服务名称 */
    service_name?: string;
    /** 是否启用追踪 */
    enable_tracing?: boolean;
    /** 是否启用指标 */
    enable_metrics?: boolean;
  };

  analytics?: {
    /** 是否启用分析 */
    enabled?: boolean;
  };

  feedback?: {
    /** 是否启用反馈 */
    enabled?: boolean;
  };

  // Windows 特定配置
  windows?: {
    /** 沙箱：elevated, unelevated */
    sandbox?: string;
  };

  // 功能标志
  features?: {
    shell_snapshot?: boolean;
    multi_agent?: boolean;
    unified_exec?: boolean;
    auto_memory?: boolean;
    context_compression?: boolean;
    streaming_output?: boolean;
    code_review?: boolean;
    git_integration?: boolean;
  };

  // 权限配置
  permissions?: {
    network?: {
      /** 允许的域名 */
      allowed_domains?: string[];
      /** 禁止的域名 */
      blocked_domains?: string[];
      /** 是否允许所有网络访问 */
      allow_all?: boolean;
    };
  };

  // 代理配置
  agents?: {
    /** 最大并发代理数 */
    max_concurrent?: number;
    /** 代理超时（秒） */
    timeout?: number;
    /** 启用的代理类型 */
    enabled_types?: string[];
    /** 代理通信模式 */
    communication_mode?: string;
  };

  // 模型提供商配置
  model_providers?: {
    [key: string]: {
      /** 基础 URL */
      base_url?: string;
      /** 提供商名称 */
      name?: string;
      /** 是否需要 OpenAI 认证 */
      requires_openai_auth?: boolean;
      /** Wire API 类型 */
      wire_api?: string;
      /** API 密钥 */
      api_key?: string;
      /** 模型列表 */
      models?: string[];
      /** 超时（秒） */
      timeout?: number;
    };
  };

  // MCP 服务器配置
  mcp_servers?: {
    [key: string]: {
      /** 命令 */
      command?: string;
      /** 参数 */
      args?: string[];
      /** 环境变量 */
      env?: Record<string, string>;
      /** 是否启用 */
      enabled?: boolean;
    };
  };

  // 插件服务器配置（别名）
  plugin_servers?: {
    [key: string]: {
      /** 命令 */
      command?: string;
      /** 参数 */
      args?: string[];
      /** 环境变量 */
      env?: Record<string, string>;
      /** 是否启用 */
      enabled?: boolean;
    };
  };
}

/** Claude Code 配置结构（对应 JSON 格式） */
export interface ClaudeConfig {
  // 基础配置
  /** API 密钥助手脚本 */
  apiKeyHelper?: string;
  /** 清理周期（天），默认 30 */
  cleanupPeriodDays?: number;
  /** 公司公告 */
  companyAnnouncements?: string[];
  /** 环境变量配置 */
  env?: Record<string, string>;

  // 归属配置
  /** 归属信息 */
  attribution?: {
    commit?: string;
    pr?: string;
  };
  /** 是否包含 co-authored-by（已弃用） */
  includeCoAuthoredBy?: boolean;

  // 权限配置
  /** 权限配置 */
  permissions?: {
    allow?: string[];
    ask?: string[];
    deny?: string[];
    additionalDirectories?: string[];
    defaultMode?: string;
    disableBypassPermissionsMode?: string;
  };

  // Hooks 和 MCP 配置
  /** Hooks 配置 */
  hooks?: Record<string, any>;
  /** 禁用所有 hooks */
  disableAllHooks?: boolean;
  /** 仅允许 managed hooks */
  allowManagedHooksOnly?: boolean;
  /** 允许的 HTTP hook URLs */
  allowedHttpHookUrls?: string[];
  /** HTTP hook 允许的环境变量 */
  httpHookAllowedEnvVars?: string[];
  /** 仅允许 managed 权限规则 */
  allowManagedPermissionRulesOnly?: boolean;
  /** 仅允许 managed MCP servers */
  allowManagedMcpServersOnly?: boolean;

  // 模型配置
  /** 覆盖默认模型 */
  model?: string;
  /** 可用模型列表 */
  availableModels?: string[];

  // 监控和遥测
  /** OpenTelemetry 标头助手 */
  otelHeadersHelper?: string;

  // UI 配置
  /** 状态行配置 */
  statusLine?: {
    type?: 'command';
    command?: string;
  };
  /** 文件建议配置 */
  fileSuggestion?: {
    type?: 'command';
    command?: string;
  };
  /** 是否尊重 gitignore */
  respectGitignore?: boolean;
  /** 输出样式 */
  outputStyle?: string;
  /** 语言设置 */
  language?: string;
  /** 是否启用 Spinner 提示 */
  spinnerTipsEnabled?: boolean;
  /** Spinner 提示覆盖 */
  spinnerTipsOverride?: {
    excludeDefault?: boolean;
    tips?: string[];
  };
  /** Spinner 动词配置 */
  spinnerVerbs?: {
    mode?: 'replace' | 'append';
    verbs?: string[];
  };
  /** 是否启用终端进度条 */
  terminalProgressBarEnabled?: boolean;
  /** 是否减少动画 */
  prefersReducedMotion?: boolean;
  /** 是否显示回合时长 */
  showTurnDuration?: boolean;

  // 认证和登录
  /** 强制登录方法 */
  forceLoginMethod?: 'claudeai' | 'console';
  /** 强制登录组织 UUID */
  forceLoginOrgUUID?: string;

  // MCP 配置
  /** 启用所有项目 MCP servers */
  enableAllProjectMcpServers?: boolean;
  /** 启用的 MCP servers */
  enabledMcpjsonServers?: string[];
  /** 禁用的 MCP servers */
  disabledMcpjsonServers?: string[];
  /** 允许的 MCP servers */
  allowedMcpServers?: Array<{ serverName: string }>;
  /** 拒绝的 MCP servers */
  deniedMcpServers?: Array<{ serverName: string }>;

  // Plugin Marketplace 配置
  /** 严格的已知 marketplaces */
  strictKnownMarketplaces?: Array<{ source: string; repo: string }>;
  /** 阻止的 marketplaces */
  blockedMarketplaces?: Array<{ source: string; repo: string }>;

  // AWS 配置
  /** AWS 认证刷新脚本 */
  awsAuthRefresh?: string;
  /** AWS 凭证导出脚本 */
  awsCredentialExport?: string;

  // 高级功能
  /** 是否始终启用思考模式 */
  alwaysThinkingEnabled?: boolean;
  /** 计划文件目录 */
  plansDirectory?: string;
  /** 快速模式每会话选择加入 */
  fastModePerSessionOptIn?: boolean;
  /** Teammate 模式 */
  teammateMode?: 'auto' | 'in-process' | 'tmux';
  /** 自动更新渠道 */
  autoUpdatesChannel?: 'stable' | 'latest';

  // 已弃用或向后兼容
  /** 启用的插件（已弃用） */
  enabledPlugins?: Record<string, any>;
  /** 是否跳过危险模式权限提示（已弃用） */
  skipDangerousModePermissionPrompt?: boolean;
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
