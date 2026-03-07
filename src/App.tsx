import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Tabs } from './components/common/Tabs';
import { Button } from './components/common/Button';
import { FileUpload } from './components/common/FileUpload';
import { ResetButton } from './components/common/ResetButton';
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
  const templates = getTemplatesByTool(currentTool);

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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Tabs
            tabs={TOOL_TABS}
            activeTab={currentTool}
            onChange={(id) => handleToolChange(id as ToolType)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <FileUpload onChange={handleFileUpload} accept=".json,.toml" buttonText="导入配置" />
              <Button onClick={handleExport} variant="secondary">
                导出配置
              </Button>
              <Button onClick={() => setShowTemplates(!showTemplates)} variant="secondary">
                应用模板
              </Button>
              <ResetButton onReset={handleReset} />
            </div>

            {showTemplates && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  选择模板
                </h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full text-left p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {currentTool === 'codex' && (
                <CodexForm onChange={handleConfigChange} />
              )}
              {currentTool === 'claude' && (
                <ClaudeForm onChange={handleConfigChange} />
              )}
              {currentTool === 'gemini' && (
                <GeminiForm onChange={handleConfigChange} />
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <ConfigPreview
              configString={configString}
              format={format as 'json' | 'toml'}
              title={`${TOOL_TABS.find(t => t.id === currentTool)?.label} 配置预览`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
