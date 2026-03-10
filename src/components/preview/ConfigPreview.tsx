import React from 'react';
import { CopyButton } from '../common/CopyButton';
import { SyntaxHighlight } from './SyntaxHighlight';

interface ConfigPreviewProps {
  configString: string;
  format: 'json' | 'toml';
  title?: string;
}

const ConfigPreviewComponent: React.FC<ConfigPreviewProps> = ({
  configString,
  format,
  title = '配置预览'
}) => {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ height: 'calc(100vh - 12rem)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {title}
        </h3>
        <CopyButton text={configString} />
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-md p-4 min-h-full">
          {configString ? (
            <SyntaxHighlight code={configString} language={format} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              填写表单后将在此处显示配置预览
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// 使用 React.memo 优化性能，避免不必要的语法高亮重新计算
export const ConfigPreview = React.memo(ConfigPreviewComponent);
