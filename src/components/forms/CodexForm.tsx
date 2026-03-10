import { INPUT_STYLES } from '@/styles/formStyles';
/**
 * Codex 配置表单组件
 * 基于真实的 Codex config.toml 结构
 */
import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { codexSchema, CodexFormData } from '@/schemas/codex.schema';
import { CodexConfig } from '@/types/config';
import { ArrayField } from './ArrayField';
import { ModelProvidersField } from './ModelProvidersField';

interface CodexFormProps {
  defaultValues?: Partial<CodexConfig>;
  onChange?: (values: CodexConfig) => void;
  onSubmit?: (values: CodexConfig) => void;
}

const defaultCodexValues: CodexConfig = {
  model: 'gpt-5.4',
  approval_policy: 'on-request',
  sandbox_mode: 'workspace-write',
  web_search: 'cached',
  personality: 'friendly',
  allow_login_shell: false,
  project_root_markers: ['.git'],
};

const CodexFormComponent: React.FC<CodexFormProps> = ({
  defaultValues,
  onChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
  } = useForm<CodexFormData>({
    resolver: zodResolver(codexSchema),
    defaultValues: { ...defaultCodexValues, ...defaultValues } as CodexFormData,
    mode: 'onChange',
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isInternalChangeRef = useRef(false);

  React.useEffect(() => {
    if (defaultValues && !isInternalChangeRef.current) {
      reset({ ...defaultCodexValues, ...defaultValues });
    }
    isInternalChangeRef.current = false;
  }, [defaultValues, reset]);

  const debouncedOnChange = useCallback((value: CodexConfig) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange?.(value);
    }, 300);
  }, [onChange]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        isInternalChangeRef.current = true;
        debouncedOnChange(value as CodexConfig);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, debouncedOnChange]);

  const onFormSubmit = (data: CodexFormData) => {
    if (onSubmit) {
      onSubmit(data as CodexConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 核心配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          核心配置
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
              placeholder="gpt-5.4"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Codex 默认使用的模型
            </p>
          </div>

          {/* Approval Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              审批策略
            </label>
            <select
              {...register('approval_policy')}
              className={INPUT_STYLES}
            >
              <option value="on-request">On Request (按需审批)</option>
              <option value="untrusted">Untrusted (不信任)</option>
              <option value="never">Never (从不审批)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              控制 Codex 何时暂停以获取命令审批
            </p>
          </div>

          {/* Sandbox Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              沙箱模式
            </label>
            <select
              {...register('sandbox_mode')}
              className={INPUT_STYLES}
            >
              <option value="workspace-write">Workspace Write (工作区写入)</option>
              <option value="read-only">Read Only (只读)</option>
              <option value="danger-full-access">Danger Full Access (完全访问)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              调整文件系统和网络访问权限
            </p>
          </div>

          {/* Web Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              网络搜索
            </label>
            <select
              {...register('web_search')}
              className={INPUT_STYLES}
            >
              <option value="cached">Cached (缓存)</option>
              <option value="live">Live (实时)</option>
              <option value="disabled">Disabled (禁用)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              网络搜索行为设置
            </p>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              个性化
            </label>
            <select
              {...register('personality')}
              className={INPUT_STYLES}
            >
              <option value="friendly">Friendly (友好)</option>
              <option value="pragmatic">Pragmatic (务实)</option>
              <option value="none">None (无)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              沟通风格设置
            </p>
          </div>

          {/* Service Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              服务层级
            </label>
            <select
              {...register('service_tier')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="free">Free (免费)</option>
              <option value="pro">Pro (专业)</option>
              <option value="team">Team (团队)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              指定服务层级
            </p>
          </div>

          {/* Commit Attribution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              提交归属
            </label>
            <input
              type="text"
              {...register('commit_attribution')}
              placeholder="Your Name <email@example.com>"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Git 提交的归属信息
            </p>
          </div>

          {/* Developer Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              开发者指令
            </label>
            <textarea
              {...register('developer_instructions')}
              placeholder="自定义开发者指令..."
              rows={3}
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              为 Codex 提供自定义指令
            </p>
          </div>

          {/* Compact Prompt */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('compact_prompt')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              紧凑提示模式
            </label>
          </div>

          {/* Background Terminal Max Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              后台终端最大超时（秒）
            </label>
            <input
              type="number"
              {...register('background_terminal_max_timeout', { valueAsNumber: true })}
              placeholder="600"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              后台终端任务的最大超时时间
            </p>
          </div>

          {/* Tool Output Token Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              工具输出令牌限制
            </label>
            <input
              type="number"
              {...register('tool_output_token_limit', { valueAsNumber: true })}
              placeholder="10000"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              工具输出的最大令牌数
            </p>
          </div>

          {/* Model Auto Compact Token Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型自动压缩令牌限制
            </label>
            <input
              type="number"
              {...register('model_auto_compact_token_limit', { valueAsNumber: true })}
              placeholder="100000"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              触发自动压缩的令牌阈值
            </p>
          </div>

          {/* Check for Update on Startup */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('check_for_update_on_startup')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启动时检查更新
            </label>
          </div>

          {/* Hide Agent Reasoning */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('hide_agent_reasoning')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              隐藏代理推理过程
            </label>
          </div>

          {/* Model Reasoning Summary */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('model_reasoning_summary')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              模型推理摘要
            </label>
          </div>
        </div>
      </div>

      {/* 模型配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          模型配置
        </h3>
        <div className="space-y-4">
          {/* Model Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型提供商
            </label>
            <input
              type="text"
              {...register('model_provider')}
              placeholder="proxy, ollama"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              指定自定义提供商（如 proxy, ollama）。如果使用下方"模型提供商配置"中配置的自定义提供商，请填写提供商的名称（name 字段），例如：code-switch-r
            </p>
          </div>

          {/* Model Reasoning Effort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              推理强度
            </label>
            <select
              {...register('model_reasoning_effort')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="high">High (高)</option>
              <option value="medium">Medium (中)</option>
              <option value="low">Low (低)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              调整推理模型的强度
            </p>
          </div>

          {/* Model Verbosity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              详细程度
            </label>
            <select
              {...register('model_verbosity')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="low">Low (低)</option>
              <option value="medium">Medium (中)</option>
              <option value="high">High (高)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              调整响应详细程度
            </p>
          </div>

          {/* Model Context Window */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              上下文窗口大小
            </label>
            <input
              type="number"
              {...register('model_context_window', { valueAsNumber: true })}
              placeholder="128000"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              设置上下文大小（如 128000）
            </p>
          </div>

          {/* Review Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              审查模型
            </label>
            <input
              type="text"
              {...register('review_model')}
              placeholder="gpt-5.4"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              用于代码审查的模型
            </p>
          </div>

          {/* Plan Mode Reasoning Effort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              计划模式推理强度
            </label>
            <select
              {...register('plan_mode_reasoning_effort')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="high">High (高)</option>
              <option value="medium">Medium (中)</option>
              <option value="low">Low (低)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              计划模式下的推理强度
            </p>
          </div>
        </div>
      </div>

      {/* 模型提供商配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          模型提供商配置
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>提示：</strong>配置自定义模型提供商后，在上方"模型配置"区块的"模型提供商"字段中填写提供商的名称（name 字段）即可使用。
              例如：配置了名为 <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">code-switch-r</code> 的提供商后，
              在"模型提供商"字段中填写 <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">code-switch-r</code> 即可。
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
              <strong>API Key 配置：</strong>Codex 需要在 <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">auth.json</code> 文件中配置 API Key。
            </p>
            <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <p><strong>文件位置：</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>Windows: <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">C:\Users\用户名\.codex\auth.json</code></li>
                <li>macOS/Linux: <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">~/.codex/auth.json</code></li>
              </ul>
              <p className="mt-2"><strong>文件内容示例：</strong></p>
              <pre className="mt-1 p-2 bg-amber-100 dark:bg-amber-900 rounded text-xs overflow-x-auto">
{`{
  "OPENAI_API_KEY": "code-switch-r"
}`}
              </pre>
              <p className="mt-2 text-amber-600 dark:text-amber-400">
                注意：将 <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">code-switch-r</code> 替换为你配置的模型提供商名称
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            支持配置本地模型服务（如 Ollama、LM Studio）或第三方 API 端点。
          </p>
          <ModelProvidersField
            control={control}
            onChange={(value) => setValue('model_providers', value, { shouldDirty: true })}
          />
        </div>
      </div>

      {/* 安全与环境配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          安全与环境配置
        </h3>
        <div className="space-y-4">
          {/* Allow Login Shell */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('allow_login_shell')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              允许登录 Shell
            </label>
          </div>

          {/* Shell Environment Inherit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shell 环境继承
            </label>
            <select
              {...register('shell_environment_policy.inherit')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="none">None (无)</option>
              <option value="core">Core (核心)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              控制环境变量继承策略
            </p>
          </div>

          {/* Shell Environment Exclude */}
          <ArrayField
            name="shell_environment_policy.exclude"
            label="排除的环境变量"
            control={control}
            placeholder="VARIABLE_NAME"
            helpText="要排除的环境变量模式"
          />

          {/* Shell Environment Include Only */}
          <ArrayField
            name="shell_environment_policy.include_only"
            label="仅包含的环境变量"
            control={control}
            placeholder="PATH"
            helpText="仅允许的环境变量（如 PATH, HOME）"
          />
        </div>
      </div>

      {/* 项目配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          项目配置
        </h3>
        <div className="space-y-4">
          {/* Project Root Markers */}
          <ArrayField
            name="project_root_markers"
            label="项目根标记"
            control={control}
            placeholder=".git"
            helpText="用于识别项目根目录的文件/目录"
          />

          {/* Project Doc Max Bytes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              项目文档最大字节数
            </label>
            <input
              type="number"
              {...register('project_doc_max_bytes', { valueAsNumber: true })}
              placeholder="1048576"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              限制 AGENTS.md 文件读取大小
            </p>
          </div>

          {/* Log Directory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日志目录
            </label>
            <input
              type="text"
              {...register('log_dir')}
              placeholder="~/.codex/logs"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              覆盖日志文件位置
            </p>
          </div>
        </div>
      </div>

      {/* UI 配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          UI 配置
        </h3>
        <div className="space-y-4">
          {/* File Opener */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文件打开器
            </label>
            <select
              {...register('file_opener')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="vscode">VS Code</option>
              <option value="cursor">Cursor</option>
              <option value="windsurf">Windsurf</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              选择默认的代码编辑器
            </p>
          </div>

          {/* TUI Notifications */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('tui.notifications')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用通知
            </label>
          </div>

          {/* TUI Animations */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('tui.animations')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用动画
            </label>
          </div>

          {/* TUI Alternate Screen */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('tui.alternate_screen')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              使用备用屏幕
            </label>
          </div>
        </div>
      </div>

      {/* 遥测与分析 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          遥测与分析
        </h3>
        <div className="space-y-4">
          {/* OTEL Exporter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenTelemetry 导出器
            </label>
            <select
              {...register('otel.exporter')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="none">None (禁用)</option>
              <option value="otlp-http">OTLP HTTP</option>
              <option value="otlp-grpc">OTLP gRPC</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              配置遥测数据导出方式
            </p>
          </div>

          {/* OTEL Log User Prompt */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('otel.log_user_prompt')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              记录用户提示
            </label>
          </div>

          {/* OTEL Endpoint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OTLP 端点
            </label>
            <input
              type="text"
              {...register('otel.endpoint')}
              placeholder="http://localhost:4318"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              OpenTelemetry 收集器端点
            </p>
          </div>

          {/* OTEL Sampling Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              采样率 (0.0-1.0)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              {...register('otel.sampling_rate', { valueAsNumber: true })}
              placeholder="1.0"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              遥测数据采样比例
            </p>
          </div>

          {/* OTEL Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              服务名称
            </label>
            <input
              type="text"
              {...register('otel.service_name')}
              placeholder="codex"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              在遥测数据中标识的服务名
            </p>
          </div>

          {/* OTEL Enable Tracing */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('otel.enable_tracing')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用追踪
            </label>
          </div>

          {/* OTEL Enable Metrics */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('otel.enable_metrics')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用指标
            </label>
          </div>

          {/* Analytics Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('analytics.enabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用分析
            </label>
          </div>

          {/* Feedback Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('feedback.enabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用反馈
            </label>
          </div>
        </div>
      </div>

      {/* 功能标志 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          功能标志
        </h3>
        <div className="space-y-4">
          {/* Shell Snapshot */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.shell_snapshot')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Shell Snapshot (Beta)
            </label>
          </div>

          {/* Multi Agent */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.multi_agent')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Multi Agent (实验性)
            </label>
          </div>

          {/* Unified Exec */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.unified_exec')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Unified Exec (Beta)
            </label>
          </div>

          {/* Auto Memory */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.auto_memory')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              自动记忆
            </label>
          </div>

          {/* Context Compression */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.context_compression')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              上下文压缩
            </label>
          </div>

          {/* Streaming Output */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.streaming_output')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              流式输出
            </label>
          </div>

          {/* Code Review */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.code_review')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              代码审查
            </label>
          </div>

          {/* Git Integration */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('features.git_integration')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Git 集成
            </label>
          </div>
        </div>
      </div>

      {/* Windows 配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Windows 配置
        </h3>
        <div className="space-y-4">
          {/* Windows Sandbox */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Windows 沙箱
            </label>
            <select
              {...register('windows.sandbox')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="elevated">Elevated (提升权限)</option>
              <option value="unelevated">Unelevated (普通权限)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Windows 特定的沙箱配置
            </p>
          </div>
        </div>
      </div>

      {/* History 配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          历史记录配置
        </h3>
        <div className="space-y-4">
          {/* History Persistence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              持久化策略
            </label>
            <select
              {...register('history.persistence')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="none">None (禁用)</option>
              <option value="local">Local (本地)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              控制历史记录持久化
            </p>
          </div>

          {/* History Max Bytes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大字节数
            </label>
            <input
              type="number"
              {...register('history.max_bytes', { valueAsNumber: true })}
              placeholder="10485760"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              历史记录文件的最大大小
            </p>
          </div>

          {/* History Retention Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              保留天数
            </label>
            <input
              type="number"
              {...register('history.retention_days', { valueAsNumber: true })}
              placeholder="30"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              历史记录保留的天数
            </p>
          </div>
        </div>
      </div>

      {/* 工具配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          工具配置
        </h3>
        <div className="space-y-4">
          {/* Tools Disabled */}
          <div>
            <ArrayField
              control={control}
              name="tools.disabled"
              label="禁用的工具"
              placeholder="工具名称"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              禁用特定工具（如 Bash, Edit）
            </p>
          </div>

          {/* Tools Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              工具超时（秒）
            </label>
            <input
              type="number"
              {...register('tools.timeout', { valueAsNumber: true })}
              placeholder="120"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              工具执行的超时时间
            </p>
          </div>
        </div>
      </div>

      {/* 沙箱工作区写入配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          沙箱工作区写入配置
        </h3>
        <div className="space-y-4">
          {/* Allowed Paths */}
          <div>
            <ArrayField
              control={control}
              name="sandbox_workspace_write.allowed_paths"
              label="允许的路径"
              placeholder="/path/to/allow"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              允许写入的路径列表
            </p>
          </div>

          {/* Denied Paths */}
          <div>
            <ArrayField
              control={control}
              name="sandbox_workspace_write.denied_paths"
              label="禁止的路径"
              placeholder="/path/to/deny"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              禁止写入的路径列表
            </p>
          </div>
        </div>
      </div>

      {/* 记忆配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          记忆配置
        </h3>
        <div className="space-y-4">
          {/* Memories Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('memories.enabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用记忆功能
            </label>
          </div>

          {/* Memories Directory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              记忆目录
            </label>
            <input
              type="text"
              {...register('memories.directory')}
              placeholder="~/.codex/memories"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              存储记忆文件的目录
            </p>
          </div>
        </div>
      </div>

      {/* 权限配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          权限配置
        </h3>
        <div className="space-y-4">
          {/* Network Allow All */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('permissions.network.allow_all')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              允许所有网络访问
            </label>
          </div>

          {/* Allowed Domains */}
          <div>
            <ArrayField
              control={control}
              name="permissions.network.allowed_domains"
              label="允许的域名"
              placeholder="example.com"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              允许访问的域名列表
            </p>
          </div>

          {/* Blocked Domains */}
          <div>
            <ArrayField
              control={control}
              name="permissions.network.blocked_domains"
              label="禁止的域名"
              placeholder="blocked.com"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              禁止访问的域名列表
            </p>
          </div>
        </div>
      </div>

      {/* 代理配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          代理配置
        </h3>
        <div className="space-y-4">
          {/* Max Concurrent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大并发代理数
            </label>
            <input
              type="number"
              {...register('agents.max_concurrent', { valueAsNumber: true })}
              placeholder="5"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              同时运行的最大代理数量
            </p>
          </div>

          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              代理超时（秒）
            </label>
            <input
              type="number"
              {...register('agents.timeout', { valueAsNumber: true })}
              placeholder="300"
              className={INPUT_STYLES}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              代理执行的超时时间
            </p>
          </div>

          {/* Communication Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              通信模式
            </label>
            <select
              {...register('agents.communication_mode')}
              className={INPUT_STYLES}
            >
              <option value="">默认</option>
              <option value="direct">Direct (直接)</option>
              <option value="queue">Queue (队列)</option>
              <option value="broadcast">Broadcast (广播)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              代理间的通信方式
            </p>
          </div>

          {/* Enabled Types */}
          <div>
            <ArrayField
              control={control}
              name="agents.enabled_types"
              label="启用的代理类型"
              placeholder="researcher, coder, tester"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              允许使用的代理类型
            </p>
          </div>
        </div>
      </div>

      {/* 高级配置说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          高级配置
        </h3>
        <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <p>
            以下高级配置需要手动编辑 TOML 配置文件：
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>[mcp_servers]</strong> - MCP 服务器配置
              <div className="mt-1 text-xs text-blue-700 dark:text-blue-300 ml-5">
                配置 Model Context Protocol 服务器命令和参数
              </div>
            </li>
            <li>
              <strong>[plugin_servers]</strong> - 插件服务器配置
              <div className="mt-1 text-xs text-blue-700 dark:text-blue-300 ml-5">
                配置插件服务器（mcp_servers 的别名）
              </div>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded border border-blue-300 dark:border-blue-700">
            <p className="font-medium mb-2">示例配置：</p>
            <pre className="text-xs overflow-x-auto">
{`[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem"]
enabled = true`}
            </pre>
          </div>
        </div>
      </div>
    </form>
  );
};

// 使用 React.memo 优化性能，避免不必要的重渲染
export const CodexForm = React.memo(CodexFormComponent);
