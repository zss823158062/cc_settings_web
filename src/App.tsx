import { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Tabs } from './components/common/Tabs';
import { Button } from './components/common/Button';
import { FileUpload } from './components/common/FileUpload';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ConfigPreview } from './components/preview/ConfigPreview';
import { CodexForm } from './components/forms/CodexForm';
import { ClaudeForm } from './components/forms/ClaudeForm';
import { GeminiForm } from './components/forms/GeminiForm';
import { useTheme } from './hooks/useTheme';
import { useConfig } from './hooks/useConfig';
import { getTemplatesByTool } from './utils/template';
import type { ToolType } from './types/config';

const TOOL_TABS = [
  { id: 'codex', label: 'Codex' },
  { id: 'claude', label: 'Claude Code' },
  { id: 'gemini', label: 'Gemini CLI' },
];

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    currentTool,
    currentConfig,
    configString,
    format,
    handleToolChange,
    handleConfigChange,
    handleImport,
    handleExport,
    handleReset,
    handleApplyTemplate,
  } = useConfig();

  const [showTemplates, setShowTemplates] = useState(false);

  // 使用 useMemo 缓存模板列表，避免每次渲染都重新计算
  const templates = useMemo(() => getTemplatesByTool(currentTool), [currentTool]);

  const handleFileUpload = async (file: File) => {
    const result = await handleImport(file);
    if (!result.success) {
      alert(result.error || '导入失败');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    handleApplyTemplate(templateId);
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Tabs
            tabs={TOOL_TABS}
            activeTab={currentTool}
            onChange={(id) => handleToolChange(id as ToolType)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <FileUpload onChange={handleFileUpload} accept=".json,.toml" buttonText="导入配置" />
              <Button onClick={handleExport} variant="secondary" className="whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出配置
              </Button>
              <Button onClick={() => setShowTemplates(!showTemplates)} variant="secondary" className="whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {showTemplates ? '隐藏模板' : '应用模板'}
              </Button>
              <Button onClick={handleReset} variant="danger" className="whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置配置
              </Button>
            </div>

            {showTemplates && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg shadow-sm border border-blue-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  选择配置模板
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="text-left p-4 rounded-lg border-2 border-transparent bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {currentTool === 'codex' && (
                <CodexForm onChange={handleConfigChange} defaultValues={currentConfig as any} />
              )}
              {currentTool === 'claude' && (
                <ClaudeForm onChange={handleConfigChange} defaultValues={currentConfig as any} />
              )}
              {currentTool === 'gemini' && (
                <GeminiForm onChange={handleConfigChange} defaultValues={currentConfig as any} />
              )}
            </div>
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-24 h-fit">
            <ConfigPreview
              configString={configString}
              format={format as 'json' | 'toml'}
              title={`${TOOL_TABS.find(t => t.id === currentTool)?.label} 配置预览`}
            />
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
