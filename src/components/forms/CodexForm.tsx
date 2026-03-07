import { INPUT_STYLES } from '@/styles/formStyles';
/**
 * Codex 配置表单组件
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { codexSchema, CodexFormData } from '@/schemas/codex.schema';
import { CodexConfig } from '@/types/config';

interface CodexFormProps {
  defaultValues?: Partial<CodexConfig>;
  onChange?: (values: CodexConfig) => void;
  onSubmit?: (values: CodexConfig) => void;
}

const defaultCodexValues: CodexConfig = {
  api: {
    key: '',
    base_url: 'https://api.openai.com/v1',
  },
  model: {
    name: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2048,
  },
  behavior: {
    auto_save: true,
    timeout: 30,
  },
};

export const CodexForm: React.FC<CodexFormProps> = ({
  onChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CodexFormData>({
    resolver: zodResolver(codexSchema),
    defaultValues: defaultCodexValues,
    mode: 'onChange',
  });

  // 监听表单变化并触发 onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (onChange && value) {
        onChange(value as CodexConfig);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // 暴露 reset 方法
  React.useImperativeHandle(
    React.useRef<{ reset: () => void }>(),
    () => ({
      reset: () => reset(defaultCodexValues),
    })
  );

  const onFormSubmit = (data: CodexFormData) => {
    if (onSubmit) {
      onSubmit(data as CodexConfig);
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
              {...register('api.key')}
              placeholder="sk-..."
              className={INPUT_STYLES}
            />
            {errors.api?.key && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.api.key.message}
              </p>
            )}
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Base URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('api.base_url')}
              placeholder="https://api.openai.com/v1"
              className={INPUT_STYLES}
            />
            {errors.api?.base_url && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.api.base_url.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              API 服务的基础 URL 地址
            </p>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('model.name')}
              placeholder="gpt-4"
              className={INPUT_STYLES}
            />
            {errors.model?.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.model.name.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              如 gpt-4, gpt-3.5-turbo
            </p>
          </div>
        </div>
      </div>

      {/* 高级配置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          高级配置
        </h3>
        <div className="space-y-4">
          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              温度参数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              {...register('model.temperature', { valueAsNumber: true })}
              className={INPUT_STYLES}
            />
            {errors.model?.temperature && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.model.temperature.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              范围 0-2,控制输出的随机性
            </p>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大 Token 数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('model.max_tokens', { valueAsNumber: true })}
              className={INPUT_STYLES}
            />
            {errors.model?.max_tokens && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.model.max_tokens.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              生成文本的最大长度
            </p>
          </div>

          {/* Auto Save */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('behavior.auto_save')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              自动保存
            </label>
          </div>

          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              超时时间(秒) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('behavior.timeout', { valueAsNumber: true })}
              className={INPUT_STYLES}
            />
            {errors.behavior?.timeout && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.behavior.timeout.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              请求超时时间,建议 30-120 秒
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
