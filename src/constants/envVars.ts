/**
 * Claude Code 环境变量配置
 * 包含所有官方环境变量及其中文描述
 */

export const ENV_VAR_OPTIONS = [
  // API 和认证
  { value: 'ANTHROPIC_API_KEY', label: 'ANTHROPIC_API_KEY - API 密钥（用于 Claude SDK）' },
  { value: 'ANTHROPIC_AUTH_TOKEN', label: 'ANTHROPIC_AUTH_TOKEN - 认证令牌（Bearer 前缀）' },
  { value: 'ANTHROPIC_CUSTOM_HEADERS', label: 'ANTHROPIC_CUSTOM_HEADERS - 自定义请求标头' },
  { value: 'ANTHROPIC_FOUNDRY_API_KEY', label: 'ANTHROPIC_FOUNDRY_API_KEY - Microsoft Foundry API 密钥' },
  { value: 'ANTHROPIC_FOUNDRY_BASE_URL', label: 'ANTHROPIC_FOUNDRY_BASE_URL - Foundry 资源完整 URL' },
  { value: 'ANTHROPIC_FOUNDRY_RESOURCE', label: 'ANTHROPIC_FOUNDRY_RESOURCE - Foundry 资源名称' },
  { value: 'AWS_BEARER_TOKEN_BEDROCK', label: 'AWS_BEARER_TOKEN_BEDROCK - Bedrock API 密钥' },

  // 模型配置
  { value: 'ANTHROPIC_MODEL', label: 'ANTHROPIC_MODEL - 要使用的模型名称' },
  { value: 'ANTHROPIC_DEFAULT_HAIKU_MODEL', label: 'ANTHROPIC_DEFAULT_HAIKU_MODEL - 默认 Haiku 模型' },
  { value: 'ANTHROPIC_DEFAULT_OPUS_MODEL', label: 'ANTHROPIC_DEFAULT_OPUS_MODEL - 默认 Opus 模型' },
  { value: 'ANTHROPIC_DEFAULT_SONNET_MODEL', label: 'ANTHROPIC_DEFAULT_SONNET_MODEL - 默认 Sonnet 模型' },
  { value: 'ANTHROPIC_SMALL_FAST_MODEL', label: 'ANTHROPIC_SMALL_FAST_MODEL - 后台任务用 Haiku 模型' },
  { value: 'ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION', label: 'ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION - Haiku 模型 AWS 区域' },
  { value: 'CLAUDE_CODE_SUBAGENT_MODEL', label: 'CLAUDE_CODE_SUBAGENT_MODEL - Subagent 使用的模型' },

  // Bash 配置
  { value: 'BASH_DEFAULT_TIMEOUT_MS', label: 'BASH_DEFAULT_TIMEOUT_MS - Bash 命令默认超时（毫秒）' },
  { value: 'BASH_MAX_OUTPUT_LENGTH', label: 'BASH_MAX_OUTPUT_LENGTH - Bash 输出最大字符数' },
  { value: 'BASH_MAX_TIMEOUT_MS', label: 'BASH_MAX_TIMEOUT_MS - Bash 命令最大超时（毫秒）' },
  { value: 'CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR', label: 'CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR - 保持项目工作目录' },

  // Claude Code 核心配置
  { value: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', label: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE - 自动压缩触发百分比（1-100）' },
  { value: 'CLAUDE_CODE_ACCOUNT_UUID', label: 'CLAUDE_CODE_ACCOUNT_UUID - 账户 UUID' },
  { value: 'CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD', label: 'CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD - 从额外目录加载 CLAUDE.md' },
  { value: 'CLAUDE_CODE_API_KEY_HELPER_TTL_MS', label: 'CLAUDE_CODE_API_KEY_HELPER_TTL_MS - 凭证刷新间隔（毫秒）' },
  { value: 'CLAUDE_CODE_CLIENT_CERT', label: 'CLAUDE_CODE_CLIENT_CERT - mTLS 客户端证书路径' },
  { value: 'CLAUDE_CODE_CLIENT_KEY', label: 'CLAUDE_CODE_CLIENT_KEY - mTLS 客户端私钥路径' },
  { value: 'CLAUDE_CODE_CLIENT_KEY_PASSPHRASE', label: 'CLAUDE_CODE_CLIENT_KEY_PASSPHRASE - 客户端私钥密码' },
  { value: 'CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING', label: 'CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING - 禁用自适应推理' },
  { value: 'CLAUDE_CODE_DISABLE_AUTO_MEMORY', label: 'CLAUDE_CODE_DISABLE_AUTO_MEMORY - 禁用自动内存' },
  { value: 'CLAUDE_CODE_DISABLE_BACKGROUND_TASKS', label: 'CLAUDE_CODE_DISABLE_BACKGROUND_TASKS - 禁用后台任务' },
  { value: 'CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS', label: 'CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS - 禁用实验性 Beta 标头' },
  { value: 'CLAUDE_CODE_DISABLE_FAST_MODE', label: 'CLAUDE_CODE_DISABLE_FAST_MODE - 禁用快速模式' },
  { value: 'CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY', label: 'CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY - 禁用会话质量调查' },
  { value: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', label: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC - 禁用非必要流量' },
  { value: 'CLAUDE_CODE_DISABLE_TERMINAL_TITLE', label: 'CLAUDE_CODE_DISABLE_TERMINAL_TITLE - 禁用终端标题更新' },
  { value: 'CLAUDE_CODE_EFFORT_LEVEL', label: 'CLAUDE_CODE_EFFORT_LEVEL - 努力级别（low/medium/high）' },
  { value: 'CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION', label: 'CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION - 启用提示建议' },
  { value: 'CLAUDE_CODE_ENABLE_TASKS', label: 'CLAUDE_CODE_ENABLE_TASKS - 启用任务跟踪系统' },
  { value: 'CLAUDE_CODE_ENABLE_TELEMETRY', label: 'CLAUDE_CODE_ENABLE_TELEMETRY - 启用 OpenTelemetry 数据收集' },
  { value: 'CLAUDE_CODE_EXIT_AFTER_STOP_DELAY', label: 'CLAUDE_CODE_EXIT_AFTER_STOP_DELAY - 空闲后自动退出延迟（毫秒）' },
  { value: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', label: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS - 启用 Agent Teams' },
  { value: 'CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS', label: 'CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS - 文件读取最大令牌数' },
  { value: 'CLAUDE_CODE_HIDE_ACCOUNT_INFO', label: 'CLAUDE_CODE_HIDE_ACCOUNT_INFO - 隐藏账户信息' },
  { value: 'CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL', label: 'CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL - 跳过 IDE 扩展自动安装' },
  { value: 'CLAUDE_CODE_MAX_OUTPUT_TOKENS', label: 'CLAUDE_CODE_MAX_OUTPUT_TOKENS - 最大输出令牌数（默认 32000）' },
  { value: 'CLAUDE_CODE_ORGANIZATION_UUID', label: 'CLAUDE_CODE_ORGANIZATION_UUID - 组织 UUID' },
  { value: 'CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS', label: 'CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS - OTel 标头刷新间隔' },
  { value: 'CLAUDE_CODE_PLAN_MODE_REQUIRED', label: 'CLAUDE_CODE_PLAN_MODE_REQUIRED - 需要计划批准（Agent Teams）' },
  { value: 'CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS', label: 'CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS - Plugin Git 操作超时' },
  { value: 'CLAUDE_CODE_PROXY_RESOLVES_HOSTS', label: 'CLAUDE_CODE_PROXY_RESOLVES_HOSTS - 代理执行 DNS 解析' },
  { value: 'CLAUDE_CODE_SHELL', label: 'CLAUDE_CODE_SHELL - 覆盖自动 Shell 检测' },
  { value: 'CLAUDE_CODE_SHELL_PREFIX', label: 'CLAUDE_CODE_SHELL_PREFIX - Bash 命令包装前缀' },
  { value: 'CLAUDE_CODE_SIMPLE', label: 'CLAUDE_CODE_SIMPLE - 使用最小系统提示' },
  { value: 'CLAUDE_CODE_SKIP_BEDROCK_AUTH', label: 'CLAUDE_CODE_SKIP_BEDROCK_AUTH - 跳过 Bedrock 认证' },
  { value: 'CLAUDE_CODE_SKIP_FOUNDRY_AUTH', label: 'CLAUDE_CODE_SKIP_FOUNDRY_AUTH - 跳过 Foundry 认证' },
  { value: 'CLAUDE_CODE_SKIP_VERTEX_AUTH', label: 'CLAUDE_CODE_SKIP_VERTEX_AUTH - 跳过 Vertex 认证' },
  { value: 'CLAUDE_CODE_TASK_LIST_ID', label: 'CLAUDE_CODE_TASK_LIST_ID - 跨会话共享任务列表 ID' },
  { value: 'CLAUDE_CODE_TEAM_NAME', label: 'CLAUDE_CODE_TEAM_NAME - Agent Team 名称' },
  { value: 'CLAUDE_CODE_TMPDIR', label: 'CLAUDE_CODE_TMPDIR - 临时文件目录' },
  { value: 'CLAUDE_CODE_USER_EMAIL', label: 'CLAUDE_CODE_USER_EMAIL - 用户电子邮件地址' },
  { value: 'CLAUDE_CODE_USE_BEDROCK', label: 'CLAUDE_CODE_USE_BEDROCK - 使用 Amazon Bedrock' },
  { value: 'CLAUDE_CODE_USE_FOUNDRY', label: 'CLAUDE_CODE_USE_FOUNDRY - 使用 Microsoft Foundry' },
  { value: 'CLAUDE_CODE_USE_VERTEX', label: 'CLAUDE_CODE_USE_VERTEX - 使用 Google Vertex AI' },
  { value: 'CLAUDE_CONFIG_DIR', label: 'CLAUDE_CONFIG_DIR - 配置和数据文件存储位置' },

  // 禁用选项
  { value: 'DISABLE_AUTOUPDATER', label: 'DISABLE_AUTOUPDATER - 禁用自动更新' },
  { value: 'DISABLE_BUG_COMMAND', label: 'DISABLE_BUG_COMMAND - 禁用 /bug 命令' },
  { value: 'DISABLE_COST_WARNINGS', label: 'DISABLE_COST_WARNINGS - 禁用成本警告' },
  { value: 'DISABLE_ERROR_REPORTING', label: 'DISABLE_ERROR_REPORTING - 禁用 Sentry 错误报告' },
  { value: 'DISABLE_INSTALLATION_CHECKS', label: 'DISABLE_INSTALLATION_CHECKS - 禁用安装警告' },
  { value: 'DISABLE_NON_ESSENTIAL_MODEL_CALLS', label: 'DISABLE_NON_ESSENTIAL_MODEL_CALLS - 禁用非关键模型调用' },
  { value: 'DISABLE_PROMPT_CACHING', label: 'DISABLE_PROMPT_CACHING - 禁用所有模型的提示缓存' },
  { value: 'DISABLE_PROMPT_CACHING_HAIKU', label: 'DISABLE_PROMPT_CACHING_HAIKU - 禁用 Haiku 提示缓存' },
  { value: 'DISABLE_PROMPT_CACHING_OPUS', label: 'DISABLE_PROMPT_CACHING_OPUS - 禁用 Opus 提示缓存' },
  { value: 'DISABLE_PROMPT_CACHING_SONNET', label: 'DISABLE_PROMPT_CACHING_SONNET - 禁用 Sonnet 提示缓存' },
  { value: 'DISABLE_TELEMETRY', label: 'DISABLE_TELEMETRY - 禁用 Statsig 遥测' },

  // MCP 配置
  { value: 'ENABLE_CLAUDEAI_MCP_SERVERS', label: 'ENABLE_CLAUDEAI_MCP_SERVERS - 启用 claude.ai MCP servers' },
  { value: 'ENABLE_TOOL_SEARCH', label: 'ENABLE_TOOL_SEARCH - 控制 MCP 工具搜索（auto/true/false）' },
  { value: 'MAX_MCP_OUTPUT_TOKENS', label: 'MAX_MCP_OUTPUT_TOKENS - MCP 工具响应最大令牌数' },
  { value: 'MCP_CLIENT_SECRET', label: 'MCP_CLIENT_SECRET - MCP OAuth 客户端密钥' },
  { value: 'MCP_OAUTH_CALLBACK_PORT', label: 'MCP_OAUTH_CALLBACK_PORT - OAuth 回调固定端口' },
  { value: 'MCP_TIMEOUT', label: 'MCP_TIMEOUT - MCP 服务器启动超时（毫秒）' },
  { value: 'MCP_TOOL_TIMEOUT', label: 'MCP_TOOL_TIMEOUT - MCP 工具执行超时（毫秒）' },

  // 思考和令牌
  { value: 'MAX_THINKING_TOKENS', label: 'MAX_THINKING_TOKENS - 扩展思考令牌预算（默认 31999）' },

  // 代理配置
  { value: 'HTTP_PROXY', label: 'HTTP_PROXY - HTTP 代理服务器' },
  { value: 'HTTPS_PROXY', label: 'HTTPS_PROXY - HTTPS 代理服务器' },
  { value: 'NO_PROXY', label: 'NO_PROXY - 绕过代理的域和 IP 列表' },

  // 其他
  { value: 'IS_DEMO', label: 'IS_DEMO - 启用演示模式（隐藏敏感信息）' },
  { value: 'FORCE_AUTOUPDATE_PLUGINS', label: 'FORCE_AUTOUPDATE_PLUGINS - 强制 Plugin 自动更新' },
  { value: 'SLASH_COMMAND_TOOL_CHAR_BUDGET', label: 'SLASH_COMMAND_TOOL_CHAR_BUDGET - Skill 元数据字符预算' },
  { value: 'USE_BUILTIN_RIPGREP', label: 'USE_BUILTIN_RIPGREP - 使用内置 ripgrep（默认 1）' },
];
