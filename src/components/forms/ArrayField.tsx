/**
 * 数组字段组件
 * 支持动态添加和删除数组项
 */
import React from 'react';
import { useFieldArray, Control, Controller } from 'react-hook-form';
import { INPUT_STYLES } from '@/styles/formStyles';

interface ArrayFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
  helpText?: string;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
  name,
  label,
  control,
  placeholder = '输入值',
  helpText,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Controller
              name={`${name}.${index}` as const}
              control={control}
              render={({ field: inputField }) => (
                <input
                  type="text"
                  {...inputField}
                  placeholder={placeholder}
                  className={`flex-1 ${INPUT_STYLES}`}
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              删除
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append('')}
        className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        + 添加项
      </button>
    </div>
  );
};
