/**
 * 模型提供商配置字段组件
 * 支持动态添加和删除提供商
 */
import React, { useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { INPUT_STYLES } from '@/styles/formStyles';

interface ModelProvidersFieldProps {
  control: Control<any>;
  onChange?: (value: any) => void;
}

export const ModelProvidersField: React.FC<ModelProvidersFieldProps> = ({
  control,
  onChange,
}) => {
  const modelProviders = useWatch({
    control,
    name: 'model_providers',
    defaultValue: {},
  });

  const [newProviderKey, setNewProviderKey] = useState('');
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());

  const handleAddProvider = () => {
    if (!newProviderKey.trim()) return;

    const updated = {
      ...modelProviders,
      [newProviderKey]: {
        base_url: '',
        name: newProviderKey,
        requires_openai_auth: false,
        wire_api: 'responses',
      },
    };

    onChange?.(updated);
    setNewProviderKey('');
    setExpandedProviders(new Set([...expandedProviders, newProviderKey]));
  };

  const handleRemoveProvider = (key: string) => {
    const updated = { ...modelProviders };
    delete updated[key];
    onChange?.(updated);

    const newExpanded = new Set(expandedProviders);
    newExpanded.delete(key);
    setExpandedProviders(newExpanded);
  };

  const handleUpdateProvider = (key: string, field: string, value: any) => {
    const updated = {
      ...modelProviders,
      [key]: {
        ...modelProviders[key],
        [field]: value,
      },
    };
    onChange?.(updated);
  };

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedProviders(newExpanded);
  };

  const providerKeys = Object.keys(modelProviders || {});

  return (
    <div className="space-y-3">
      {/* 现有提供商列表 */}
      {providerKeys.length > 0 && (
        <div className="space-y-2">
          {providerKeys.map((key) => {
            const provider = modelProviders[key];
            const isExpanded = expandedProviders.has(key);

            return (
              <div
                key={key}
                className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
              >
                {/* 提供商标题栏 */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(key)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{key}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveProvider(key)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* 提供商配置字段 */}
                {isExpanded && (
                  <div className="p-4 space-y-3 bg-white dark:bg-gray-800">
                    {/* Base URL */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={provider?.base_url || ''}
                        onChange={(e) => handleUpdateProvider(key, 'base_url', e.target.value)}
                        placeholder="http://127.0.0.1:18100"
                        className={INPUT_STYLES}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        名称
                      </label>
                      <input
                        type="text"
                        value={provider?.name || ''}
                        onChange={(e) => handleUpdateProvider(key, 'name', e.target.value)}
                        placeholder={key}
                        className={INPUT_STYLES}
                      />
                    </div>

                    {/* Wire API */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wire API
                      </label>
                      <select
                        value={provider?.wire_api || 'responses'}
                        onChange={(e) => handleUpdateProvider(key, 'wire_api', e.target.value)}
                        className={INPUT_STYLES}
                      >
                        <option value="responses">Responses</option>
                        <option value="streaming">Streaming</option>
                        <option value="openai">OpenAI</option>
                      </select>
                    </div>

                    {/* Requires OpenAI Auth */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={provider?.requires_openai_auth || false}
                        onChange={(e) =>
                          handleUpdateProvider(key, 'requires_openai_auth', e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
                        需要 OpenAI 认证
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 添加新提供商 */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newProviderKey}
          onChange={(e) => setNewProviderKey(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddProvider();
            }
          }}
          placeholder="提供商标识（如 code-switch-r）"
          className={INPUT_STYLES}
        />
        <button
          type="button"
          onClick={handleAddProvider}
          disabled={!newProviderKey.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
        >
          添加
        </button>
      </div>
    </div>
  );
};
