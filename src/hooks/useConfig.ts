import { useState, useCallback, useMemo } from 'react';
import type { ToolType, ConfigValues, CodexConfig, ClaudeConfig, GeminiConfig } from '@/types/config';
import { generateConfigString } from '@/utils/parser';
import { importConfigFile, exportConfigFile } from '@/utils/file';
import { applyTemplate } from '@/utils/template';

const DEFAULT_CONFIGS = {
  codex: {
    model: 'gpt-5.4',
    approval_policy: 'on-request',
    sandbox_mode: 'workspace-write',
    web_search: 'cached',
    personality: 'friendly',
    allow_login_shell: false,
    project_root_markers: ['.git'],
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

  // 使用 useMemo 缓存配置字符串生成结果，避免每次渲染都重新计算
  const configString = useMemo(
    () => generateConfigString(currentTool, currentConfig),
    [currentTool, currentConfig]
  );

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
