/**
 * JSON 字段组件
 * 使用普通 textarea，失去焦点时校验 JSON 格式
 */
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { TEXTAREA_STYLES } from '@/styles/formStyles';

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
        render={({ field }) => {
          // 将对象转换为格式化的 JSON 字符串用于显示
          const stringValue = typeof field.value === 'string'
            ? field.value
            : JSON.stringify(field.value || {}, null, 2);

          return (
            <textarea
              value={stringValue}
              onChange={(e) => {
                // 输入时直接更新，不校验
                field.onChange(e.target.value);
                setError('');
              }}
              onBlur={(e) => {
                // 失去焦点时校验并转换
                const text = e.target.value.trim();

                // 空输入转换为空对象
                if (!text) {
                  field.onChange({});
                  setError('');
                  return;
                }

                // 尝试解析 JSON
                try {
                  const parsed = JSON.parse(text);
                  field.onChange(parsed);
                  setError('');
                } catch (err) {
                  setError('无效的 JSON 格式');
                  // 保持用户输入，不转换
                }
              }}
              rows={6}
              className={`${TEXTAREA_STYLES} font-mono text-sm`}
              placeholder="{}"
            />
          );
        }}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
