/**
 * JSON 字段组件
 * 支持 JSON 格式的文本编辑
 */
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';

interface JsonFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  helpText?: string;
}

export const JsonField: React.FC<JsonFieldProps> = ({
  name,
  label,
  control,
  helpText,
}) => {
  const [error, setError] = useState<string>('');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            value={
              typeof field.value === 'string'
                ? field.value
                : JSON.stringify(field.value || {}, null, 2)
            }
            onChange={(e) => {
              const text = e.target.value;
              try {
                const parsed = JSON.parse(text);
                field.onChange(parsed);
                setError('');
              } catch (err) {
                setError('无效的 JSON 格式');
                field.onChange(text);
              }
            }}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
            placeholder="{}"
          />
        )}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
