/**
 * 数组字段组件
 * 支持动态添加和删除数组项
 */
import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';

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
            <input
              type="text"
              {...control.register(`${name}.${index}` as const)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
