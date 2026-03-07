/**
 * Claude Code 配置表单组件
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { claudeSchema, ClaudeFormData } from '@/schemas/claude.schema';
import { ClaudeConfig } from '@/types/config';
import { ArrayField } from './ArrayField';

interface ClaudeFormProps {
  defaultValues?: Partial<ClaudeConfig>;
  onChange?: (values: ClaudeConfig) => void;
  onSubmit?: (values: ClaudeConfig) => void;
}

const defaultClaudeValues: ClaudeConfig = {
  apiKey: '',
  model: 'claude-sonnet-4',
  workspace: {
    autoSave: true,
    ignorePatterns: ['node_modules', '.git'],
  },
  editor: {
    tabSize: 2,
    formatOnSave: true,
  },
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
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('apiKey')}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.apiKey.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('model')}
              placeholder="claude-sonnet-4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.model.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              如 claude-sonnet-4, claude-opus-4
            </p>
          </div>
        </div>
      </div>

      {/* 工作区配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          工作区配置
        </h3>
        <div className="space-y-4">
          {/* Auto Save */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('workspace.autoSave')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              自动保存
            </label>
          </div>

          {/* Ignore Patterns */}
          <ArrayField
            name="workspace.ignorePatterns"
            label="忽略文件模式"
            control={control}
            placeholder="如 node_modules, .git"
            helpText="指定要忽略的文件或目录模式"
          />
          {errors.workspace?.ignorePatterns && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.workspace.ignorePatterns.message}
            </p>
          )}
        </div>
      </div>

      {/* 编辑器配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          编辑器配置
        </h3>
        <div className="space-y-4">
          {/* Tab Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tab 缩进大小 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('editor.tabSize', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.editor?.tabSize && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.editor.tabSize.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              通常为 2 或 4
            </p>
          </div>

          {/* Format On Save */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('editor.formatOnSave')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              保存时自动格式化
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
