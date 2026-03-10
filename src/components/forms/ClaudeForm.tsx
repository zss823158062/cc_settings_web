/**
 * Claude Code 配置表单组件
 * 基于真实的 Claude Code settings.json 结构
 */
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { claudeSchema, ClaudeFormData } from '@/schemas/claude.schema';
import { ClaudeConfig } from '@/types/config';
import { ArrayField } from './ArrayField';
import { KeyValueField } from './KeyValueField';
import { JsonField } from './JsonField';
import { INPUT_STYLES } from '@/styles/formStyles';
import { ENV_VAR_OPTIONS } from '@/constants/envVars';

interface ClaudeFormProps {
  defaultValues?: Partial<ClaudeConfig>;
  onChange?: (values: ClaudeConfig) => void;
  onSubmit?: (values: ClaudeConfig) => void;
}

const defaultClaudeValues: ClaudeConfig = {
  cleanupPeriodDays: 30,
  env: {},
  attribution: {
    commit: '',
    pr: '',
  },
  permissions: {
    allow: [],
    ask: [],
    deny: [],
    additionalDirectories: [],
    defaultMode: 'default',
  },
  hooks: {},
  statusLine: {
    type: 'command',
    command: '',
  },
  fileSuggestion: {
    type: 'command',
    command: '',
  },
  outputStyle: 'Structural Thinking',
  language: 'Chinese',
  spinnerTipsEnabled: true,
  terminalProgressBarEnabled: true,
  respectGitignore: true,
  showTurnDuration: false,
  alwaysThinkingEnabled: false,
  autoUpdatesChannel: 'latest',
};

const ClaudeFormComponent: React.FC<ClaudeFormProps> = ({
  defaultValues,
  onChange,
  onSubmit,
}) => {
  // 将 env 对象转换为 env_array 数组用于表单
  const transformDefaultValues = (values: Partial<ClaudeConfig>) => {
    const transformed: any = { ...defaultClaudeValues, ...values };
    if (transformed.env && typeof transformed.env === 'object') {
      transformed.env_array = Object.entries(transformed.env).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    } else {
      transformed.env_array = [];
    }
    return transformed;
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ClaudeFormData>({
    resolver: zodResolver(claudeSchema),
    defaultValues: transformDefaultValues(defaultValues || {}),
    mode: 'onChange',
  });

  // 使用 useRef 存储防抖定时器
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // 使用 ref 跟踪是否是内部变化（用户输入）
  const isInternalChangeRef = useRef(false);

  // 当外部 defaultValues 变化时同步到表单（仅在非内部变化时）
  React.useEffect(() => {
    if (defaultValues && !isInternalChangeRef.current) {
      reset(transformDefaultValues(defaultValues));
    }
    isInternalChangeRef.current = false;
  }, [defaultValues, reset]);

  // 防抖的 onChange 处理
  const debouncedOnChange = useCallback((value: ClaudeConfig) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange?.(value);
    }, 300);
  }, [onChange]);

  // 监听表单变化并触发 onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        // 标记为内部变化
        isInternalChangeRef.current = true;

        // 将 env_array 转换为 env 对象
        const transformedValue = { ...value };
        if (transformedValue.env_array && Array.isArray(transformedValue.env_array)) {
          transformedValue.env = transformedValue.env_array.reduce((acc: Record<string, string>, item: any) => {
            if (item.key && item.value !== undefined) {
              acc[item.key] = item.value;
            }
            return acc;
          }, {});
          delete transformedValue.env_array;
        }

        // 清理空的 statusLine 和 fileSuggestion 对象
        if (transformedValue.statusLine && !transformedValue.statusLine.command) {
          delete transformedValue.statusLine;
        }
        if (transformedValue.fileSuggestion && !transformedValue.fileSuggestion.command) {
          delete transformedValue.fileSuggestion;
        }

        debouncedOnChange(transformedValue as ClaudeConfig);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, debouncedOnChange]);

  const onFormSubmit = (data: ClaudeFormData) => {
    if (onSubmit) {
      onSubmit(data as ClaudeConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 基础配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          基础配置
        </h3>
        <div className="space-y-4">
          {/* Cleanup Period Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              清理周期（天）
            </label>
            <input
              type="number"
              {...register('cleanupPeriodDays', { valueAsNumber: true })}
              placeholder="720"
              className={INPUT_STYLES}
            />
            {errors.cleanupPeriodDays && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cleanupPeriodDays.message}
              </p>
            )}
          </div>

          {/* Output Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              输出样式
            </label>
            <input
              type="text"
              {...register('outputStyle')}
              placeholder="Structural Thinking"
              className={INPUT_STYLES}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              语言
            </label>
            <input
              type="text"
              {...register('language')}
              placeholder="Chinese"
              className={INPUT_STYLES}
            />
          </div>
        </div>
      </div>

      {/* 工作区配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          UI 设置
        </h3>
        <div className="space-y-4">
          {/* Spinner Tips Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('spinnerTipsEnabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用 Spinner 提示
            </label>
          </div>

          {/* Always Thinking Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('alwaysThinkingEnabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              始终启用思考模式
            </label>
          </div>

          {/* Skip Dangerous Mode Permission Prompt */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('skipDangerousModePermissionPrompt')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              跳过危险模式权限提示
            </label>
          </div>

          {/* Show Turn Duration */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('showTurnDuration')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              显示回合时长
            </label>
          </div>
        </div>
      </div>

      {/* 编辑器配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          环境变量
        </h3>
        <div className="space-y-4">
          <KeyValueField
            name="env"
            label="环境变量配置"
            control={control}
            helpText="配置环境变量键值对（可从下拉列表选择或直接输入，选项包含中文说明）"
            keyOptions={ENV_VAR_OPTIONS}
            presets={[
              { key: 'ANTHROPIC_AUTH_TOKEN', value: '', description: 'Claude Code 认证令牌' },
              { key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:18100', description: 'API 基础 URL（本地代理）' },
              { key: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '95', description: '自动压缩阈值百分比' },
              { key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', value: '1', description: '禁用非必要流量' },
              { key: 'CLAUDE_CODE_PROXY_RESOLVES_HOSTS', value: '1', description: '代理解析主机' },
              { key: 'DISABLE_INSTALLATION_CHECKS', value: '1', description: '禁用安装检查' },
              { key: 'NODE_TLS_REJECT_UNAUTHORIZED', value: '0', description: '禁用 TLS 证书验证（开发用）' },
              { key: 'MAX_THINKING_TOKENS', value: '31999', description: '最大思考 Token 数' },
              { key: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: '1', description: '启用实验性 Agent Teams' },
              { key: 'CLAUDE_CODE_EFFORT_LEVEL', value: 'medium', description: '努力级别 (low/medium/high)' },
              { key: 'HTTP_PROXY', value: 'http://127.0.0.1:7890', description: 'HTTP 代理服务器' },
              { key: 'HTTPS_PROXY', value: 'http://127.0.0.1:7890', description: 'HTTPS 代理服务器' },
            ]}
          />
        </div>
      </div>

      {/* 权限配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          权限配置
        </h3>
        <div className="space-y-4">
          {/* Permissions Allow */}
          <ArrayField
            name="permissions.allow"
            label="允许的权限 (allow)"
            control={control}
            placeholder="如 Bash(git diff *)"
            helpText="自动允许的工具使用模式"
          />

          {/* Permissions Ask */}
          <ArrayField
            name="permissions.ask"
            label="询问的权限 (ask)"
            control={control}
            placeholder="如 Bash(git push *)"
            helpText="需要用户确认的工具使用模式"
          />

          {/* Permissions Deny */}
          <ArrayField
            name="permissions.deny"
            label="拒绝的权限 (deny)"
            control={control}
            placeholder="如 Read(./.env)"
            helpText="禁止访问的文件或命令模式"
          />

          {/* Additional Directories */}
          <ArrayField
            name="permissions.additionalDirectories"
            label="额外工作目录"
            control={control}
            placeholder="../docs/"
            helpText="Claude 可以访问的其他目录"
          />

          {/* Permissions Default Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认权限模式
            </label>
            <select
              {...register('permissions.defaultMode')}
              className={INPUT_STYLES}
            >
              <option value="default">Default</option>
              <option value="acceptEdits">Accept Edits</option>
              <option value="bypassPermissions">Bypass Permissions</option>
              <option value="dontAsk">Don't Ask</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              打开 Claude Code 时的默认权限模式
            </p>
          </div>
        </div>
      </div>

      {/* 归属信息 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          归属信息
        </h3>
        <div className="space-y-4">
          {/* Attribution Commit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commit 归属
            </label>
            <input
              type="text"
              {...register('attribution.commit')}
              placeholder=""
              className={INPUT_STYLES}
            />
          </div>

          {/* Attribution PR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              PR 归属
            </label>
            <input
              type="text"
              {...register('attribution.pr')}
              placeholder=""
              className={INPUT_STYLES}
            />
          </div>
        </div>
      </div>

      {/* 高级配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          模型配置
        </h3>
        <div className="space-y-4">
          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认模型
            </label>
            <input
              type="text"
              {...register('model')}
              placeholder="claude-sonnet-4-6"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              覆盖 Claude Code 使用的默认模型
            </p>
          </div>

          {/* Available Models */}
          <ArrayField
            name="availableModels"
            label="可用模型列表"
            control={control}
            placeholder="sonnet"
            helpText="限制用户可以选择的模型"
          />
        </div>
      </div>

      {/* MCP 配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          MCP 配置
        </h3>
        <div className="space-y-4">
          {/* Enable All Project MCP Servers */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('enableAllProjectMcpServers')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              自动批准所有项目 MCP servers
            </label>
          </div>

          {/* Enabled MCP Servers */}
          <ArrayField
            name="enabledMcpjsonServers"
            label="启用的 MCP Servers"
            control={control}
            placeholder="memory"
            helpText="要批准的 .mcp.json 文件中的 MCP servers"
          />

          {/* Disabled MCP Servers */}
          <ArrayField
            name="disabledMcpjsonServers"
            label="禁用的 MCP Servers"
            control={control}
            placeholder="filesystem"
            helpText="要拒绝的 .mcp.json 文件中的 MCP servers"
          />
        </div>
      </div>

      {/* Hooks 配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Hooks 配置
        </h3>
        <div className="space-y-4">
          {/* Disable All Hooks */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('disableAllHooks')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              禁用所有 Hooks
            </label>
          </div>

          {/* Hooks */}
          <JsonField
            name="hooks"
            label="Hooks 配置"
            control={control}
            helpText="自定义 Hooks 配置（JSON 格式）"
          />

          {/* Allowed HTTP Hook URLs */}
          <ArrayField
            name="allowedHttpHookUrls"
            label="允许的 HTTP Hook URLs"
            control={control}
            placeholder="https://hooks.example.com/*"
            helpText="HTTP hooks 可以访问的 URL 模式"
          />
        </div>
      </div>

      {/* 其他高级配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          其他高级配置
        </h3>
        <div className="space-y-4">
          {/* API Key Helper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key 助手脚本
            </label>
            <input
              type="text"
              {...register('apiKeyHelper')}
              placeholder="/bin/generate_temp_api_key.sh"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              生成身份验证值的自定义脚本
            </p>
          </div>

          {/* Plans Directory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              计划文件目录
            </label>
            <input
              type="text"
              {...register('plansDirectory')}
              placeholder="./plans"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              自定义计划文件的存储位置
            </p>
          </div>

          {/* Status Line Command */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              状态栏脚本
            </label>
            <input
              type="text"
              {...register('statusLine.command')}
              placeholder="~/.claude/statusline.sh"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              自定义状态栏显示的脚本路径（留空禁用自定义状态栏）
            </p>
          </div>

          {/* File Suggestion Command */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文件建议脚本
            </label>
            <input
              type="text"
              {...register('fileSuggestion.command')}
              placeholder="~/.claude/file-suggestion.sh"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              自定义 @ 文件自动完成的脚本路径（留空使用默认）
            </p>
          </div>

          {/* Teammate Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teammate 模式
            </label>
            <select
              {...register('teammateMode')}
              className={INPUT_STYLES}
            >
              <option value="auto">Auto</option>
              <option value="in-process">In-Process</option>
              <option value="tmux">Tmux</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Agent teams 的显示方式
            </p>
          </div>

          {/* Auto Updates Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              自动更新渠道
            </label>
            <select
              {...register('autoUpdatesChannel')}
              className={INPUT_STYLES}
            >
              <option value="latest">Latest</option>
              <option value="stable">Stable</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              选择更新的发布渠道
            </p>
          </div>

          {/* Fast Mode Per Session Opt In */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('fastModePerSessionOptIn')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              快速模式每会话选择加入
            </label>
          </div>

          {/* Respect Gitignore */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('respectGitignore')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              尊重 .gitignore 文件
            </label>
          </div>

          {/* Terminal Progress Bar Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('terminalProgressBarEnabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用终端进度条
            </label>
          </div>

          {/* Prefers Reduced Motion */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('prefersReducedMotion')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              减少动画效果
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

// 使用 React.memo 优化性能，避免不必要的重渲染
export const ClaudeForm = React.memo(ClaudeFormComponent);
