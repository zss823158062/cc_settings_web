import { INPUT_STYLES } from '@/styles/formStyles';
/**
 * Gemini CLI 配置表单组件
 */
import React, { useCallback, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { geminiSchema, GeminiFormData } from '@/schemas/gemini.schema';
import { GeminiConfig } from '@/types/config';

interface GeminiFormProps {
  defaultValues?: Partial<GeminiConfig>;
  onChange?: (values: GeminiConfig) => void;
  onSubmit?: (values: GeminiConfig) => void;
}

const defaultGeminiValues = {
  apiKey: '',
  projectId: '',
  region: 'us-central1',
  model: 'gemini-pro',
  safetySettings: {
    harassment: 'BLOCK_MEDIUM_AND_ABOVE' as const,
    hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE' as const,
  },
} satisfies GeminiFormData;

const safetyLevelOptions = [
  { label: '不阻止', value: 'BLOCK_NONE' },
  { label: '阻止低级及以上', value: 'BLOCK_LOW_AND_ABOVE' },
  { label: '阻止中级及以上', value: 'BLOCK_MEDIUM_AND_ABOVE' },
  { label: '仅阻止高级', value: 'BLOCK_HIGH' },
];

const GeminiFormComponent: React.FC<GeminiFormProps> = ({
  defaultValues,
  onChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<GeminiFormData>({
    resolver: zodResolver(geminiSchema),
    defaultValues: defaultGeminiValues,
    mode: 'onChange',
  });

  // 使用 useRef 存储防抖定时器
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // 使用 ref 跟踪是否是内部变化（用户输入）
  const isInternalChangeRef = useRef(false);

  // 当外部 defaultValues 变化时同步到表单（仅在非内部变化时）
  React.useEffect(() => {
    if (defaultValues && !isInternalChangeRef.current) {
      reset(defaultValues as GeminiFormData);
    }
    isInternalChangeRef.current = false;
  }, [defaultValues, reset]);

  // 防抖的 onChange 处理
  const debouncedOnChange = useCallback((value: GeminiConfig) => {
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
        debouncedOnChange(value as unknown as GeminiConfig);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, debouncedOnChange]);

  const onFormSubmit: SubmitHandler<GeminiFormData> = (data) => {
    if (onSubmit) {
      onSubmit(data as unknown as GeminiConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 开发中提示 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              功能开发中
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Gemini CLI 配置功能暂未开发完成，敬请期待后续版本更新。
            </p>
          </div>
        </div>
      </div>

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
              placeholder="AIza..."
              className={INPUT_STYLES}
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.apiKey.message}
              </p>
            )}
          </div>

          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              项目 ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('projectId')}
              placeholder="my-project"
              className={INPUT_STYLES}
            />
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.projectId.message}
              </p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              区域 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('region')}
              placeholder="us-central1"
              className={INPUT_STYLES}
            />
            {errors.region && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.region.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              如 us-central1, asia-east1
            </p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('model')}
              placeholder="gemini-pro"
              className={INPUT_STYLES}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.model.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              如 gemini-pro, gemini-ultra
            </p>
          </div>
        </div>
      </div>

      {/* 安全设置 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          安全设置
        </h3>
        <div className="space-y-4">
          {/* Harassment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              骚扰内容过滤级别 <span className="text-red-500">*</span>
            </label>
            <select
              {...register('safetySettings.harassment')}
              className={INPUT_STYLES}
            >
              {safetyLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.safetySettings?.harassment && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.safetySettings.harassment.message}
              </p>
            )}
          </div>

          {/* Hate Speech */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              仇恨言论过滤级别 <span className="text-red-500">*</span>
            </label>
            <select
              {...register('safetySettings.hateSpeech')}
              className={INPUT_STYLES}
            >
              {safetyLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.safetySettings?.hateSpeech && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.safetySettings.hateSpeech.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

// 使用 React.memo 优化性能，避免不必要的重渲染
export const GeminiForm = React.memo(GeminiFormComponent);
