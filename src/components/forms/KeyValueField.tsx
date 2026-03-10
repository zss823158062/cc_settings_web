/**
 * 键值对字段组件
 * 支持动态添加和删除键值对
 */
import React from 'react';
import { useFieldArray, Control, Controller } from 'react-hook-form';
import { INPUT_STYLES } from '@/styles/formStyles';

interface KeyValueFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  helpText?: string;
  presets?: Array<{ key: string; value: string; description?: string }>;
  /** 可选的 key 选项列表（用于 datalist），支持带描述的对象格式 */
  keyOptions?: Array<string | { value: string; label: string }>;
}

export const KeyValueField: React.FC<KeyValueFieldProps> = ({
  name,
  label,
  control,
  helpText,
  presets = [],
  keyOptions = [],
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}_array`,
  });

  const handleAddPreset = (preset: { key: string; value: string }) => {
    append(preset);
  };

  // 生成唯一的 datalist ID
  const datalistId = `${name}-key-options`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      {/* 预设选项 */}
      {presets.length > 0 && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">常用预设：</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                title={preset.description}
              >
                + {preset.key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* datalist 用于 key 字段的自动完成 */}
      {keyOptions.length > 0 && (
        <datalist id={datalistId}>
          {keyOptions.map((option, index) => {
            if (typeof option === 'string') {
              return <option key={index} value={option} />;
            } else {
              // 支持带描述的格式：value 是实际值，label 是显示的描述
              return <option key={index} value={option.value} label={option.label} />;
            }
          })}
        </datalist>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Controller
              name={`${name}_array.${index}.key` as const}
              control={control}
              render={({ field: inputField }) => (
                <input
                  type="text"
                  {...inputField}
                  list={keyOptions.length > 0 ? datalistId : undefined}
                  placeholder="键"
                  className={INPUT_STYLES}
                />
              )}
            />
            <Controller
              name={`${name}_array.${index}.value` as const}
              control={control}
              render={({ field: inputField }) => (
                <input
                  type="text"
                  {...inputField}
                  placeholder="值"
                  className={INPUT_STYLES}
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
        onClick={() => append({ key: '', value: '' })}
        className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        + 添加键值对
      </button>
    </div>
  );
};
