import { CopyButton } from '../common/CopyButton';
import { SyntaxHighlight } from './SyntaxHighlight';

interface ConfigPreviewProps {
  configString: string;
  format: 'json' | 'toml';
  title?: string;
}

export function ConfigPreview({
  configString,
  format,
  title = '配置预览'
}: ConfigPreviewProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
}
