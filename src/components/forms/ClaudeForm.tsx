/**
 * Claude Code 配置表单组件
 * 基于真实的 Claude Code settings.json 结构
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { claudeSchema, ClaudeFormData } from '@/schemas/claude.schema';
import { ClaudeConfig } from '@/types/config';
import { ArrayField } from './ArrayField';
import { KeyValueField } from './KeyValueField';
import { JsonField } from './JsonField';

interface ClaudeFormProps {
  defaultValues?: Partial<ClaudeConfig>;
  onChange?: (values: ClaudeConfig) => void;
  onSubmit?: (values: ClaudeConfig) => void;
}

const defaultClaudeValues: ClaudeConfig = {
  cleanupPeriodDays: 720,
  env: {},
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
  skipDangerousModePermissionPrompt: true,
  showTurnDuration: false,
};

export const ClaudeForm: React.FC<ClaudeFormProps> = ({
  onChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<ClaudeFormData>({
    resolver: zodResolver(claudeSchema),
    defaultValues: defaultClaudeValues,
    mode: 'onChange',
  });

  // 监听表单变化并触发 onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (onChange && value) {
        onChange(value as ClaudeConfig);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // 暴露 reset 方法
  React.useImperativeHandle(
    React.useRef<{ reset: () => void }>(),
    () => ({
      reset: () => reset(defaultClaudeValues),
    })
  );

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            helpText="配置环境变量键值对"
            presets={[
              { key: 'ANTHROPIC_AUTH_TOKEN', value: '', description: 'Claude Code 认证令牌' },
              { key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:18100', description: 'API 基础 URL（本地代理）' },
              { key: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '95', description: '自动压缩阈值百分比' },
              { key: 'CLAUDE_CODE_ATTRIBUTION_HEADER', value: '0', description: '禁用归属头' },
              { key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', value: '1', description: '禁用非必要流量' },
              { key: 'CLAUDE_CODE_PROXY_RESOLVES_HOSTS', value: '1', description: '代理解析主机' },
              { key: 'DISABLE_INSTALLATION_CHECKS', value: '1', description: '禁用安装检查' },
              { key: 'NODE_TLS_REJECT_UNAUTHORIZED', value: '0', description: '禁用 TLS 证书验证（开发用）' },
              { key: 'MAX_THINKING_TOKENS', value: '31999', description: '最大思考 Token 数' },
              { key: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: '1', description: '启用实验性 Agent Teams' },
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
            label="允许的权限"
            control={control}
            placeholder="如 Bash(find:*)"
            helpText="允许执行的命令模式列表"
          />

          {/* Permissions Default Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认权限模式
            </label>
            <input
              type="text"
              {...register('permissions.defaultMode')}
              placeholder="default"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 高级配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          高级配置
        </h3>
        <div className="space-y-4">
          {/* Hooks */}
          <JsonField
            name="hooks"
            label="Hooks 配置"
            control={control}
            helpText="Hooks 配置（JSON 格式）"
          />

          {/* Enabled Plugins */}
          <JsonField
            name="enabledPlugins"
            label="启用的插件"
            control={control}
            helpText="启用的插件配置（JSON 格式）"
          />
        </div>
      </div>
    </form>
  );
};
