import { INPUT_STYLES } from '@/styles/formStyles';
/**
 * Gemini CLI 配置表单组件
 */
import React from 'react';
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

export const GeminiForm: React.FC<GeminiFormProps> = ({
  onChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<GeminiFormData>({
    resolver: zodResolver(geminiSchema),
    defaultValues: defaultGeminiValues,
    mode: 'onChange',
  });

  // 监听表单变化并触发 onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (onChange && value) {
        onChange(value as unknown as GeminiConfig);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // 暴露 reset 方法
  React.useImperativeHandle(
    React.useRef<{ reset: () => void }>(),
    () => ({
      reset: () => reset(defaultGeminiValues),
    })
  );

  const onFormSubmit: SubmitHandler<GeminiFormData> = (data) => {
    if (onSubmit) {
      onSubmit(data as unknown as GeminiConfig);
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
