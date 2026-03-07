import { useState, useCallback } from 'react';
import type { ToolType, ConfigValues, CodexConfig, ClaudeConfig, GeminiConfig } from '@/types/config';
import { generateConfigString } from '@/utils/parser';
import { importConfigFile, exportConfigFile } from '@/utils/file';
import { applyTemplate } from '@/utils/template';

const DEFAULT_CONFIGS = {
  codex: {
    api: { key: '', base_url: 'https://api.openai.com/v1' },
    model: { name: 'gpt-4', temperature: 0.7, max_tokens: 2048 },
    behavior: { auto_save: true, timeout: 30 },
  } as CodexConfig,
  claude: {
    cleanupPeriodDays: 30,
    env: {},
    attribution: {
      commit: '',
      pr: '',
    },
    permissions: {
      allow: [],
      defaultMode: 'default',
    },
    hooks: {},
    enabledPlugins: {},
    outputStyle: '',
    language: 'Chinese',
    spinnerTipsEnabled: true,
    alwaysThinkingEnabled: false,
    skipDangerousModePermissionPrompt: false,
    showTurnDuration: true,
  } as ClaudeConfig,
  gemini: {
    apiKey: '',
    projectId: '',
    region: 'us-central1',
    model: 'gemini-pro',
    safetySettings: { harassment: 'BLOCK_MEDIUM_AND_ABOVE', hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE' },
  } as GeminiConfig,
};

export function useConfig() {
  const [currentTool, setCurrentTool] = useState<ToolType>('codex');
  const [configs, setConfigs] = useState<Record<ToolType, ConfigValues>>(DEFAULT_CONFIGS);

  const currentConfig = configs[currentTool];
  const configString = generateConfigString(currentTool, currentConfig);
  const format = currentTool === 'codex' ? 'toml' : 'json';

  const handleConfigChange = useCallback((newConfig: ConfigValues) => {
    setConfigs(prev => ({
      ...prev,
      [currentTool]: newConfig,
    }));
  }, [currentTool]);

  const handleToolChange = useCallback((tool: ToolType) => {
    setCurrentTool(tool);
  }, []);

  const handleImport = useCallback(async (file: File) => {
    const result = await importConfigFile(file, currentTool);
    if (result.success && result.data) {
      setConfigs(prev => ({
        ...prev,
        [currentTool]: result.data!,
      }));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [currentTool]);

  const handleExport = useCallback(async () => {
    const filename = `${currentTool}-config`;
    await exportConfigFile({
      filename,
      format,
      content: configString,
    });
  }, [currentTool, format, configString]);

  const handleReset = useCallback(() => {
    setConfigs(prev => ({
      ...prev,
      [currentTool]: DEFAULT_CONFIGS[currentTool],
    }));
  }, [currentTool]);

  const handleApplyTemplate = useCallback((templateId: string) => {
    const templateValues = applyTemplate(templateId);
    if (templateValues) {
      setConfigs(prev => ({
        ...prev,
        [currentTool]: templateValues,
      }));
      return true;
    }
    return false;
  }, [currentTool]);

  return {
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
  };
}
