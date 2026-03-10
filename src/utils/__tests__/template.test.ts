/**
 * 模板管理单元测试
 */

import { describe, it, expect } from 'vitest';
import { getTemplatesByTool, getTemplateById, applyTemplate } from '../template';
import type { CodexConfig, ClaudeConfig, GeminiConfig } from '@/types/config';

describe('getTemplatesByTool', () => {
  it('应该返回 Codex 的所有模板', () => {
    const templates = getTemplatesByTool('codex');
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.every((t) => t.tool === 'codex')).toBe(true);

    // 验证至少有 3 个模板（开发/生产/安全）
    expect(templates.length).toBeGreaterThanOrEqual(3);

    // 验证模板 ID 格式
    expect(templates.some((t) => t.id === 'codex-dev')).toBe(true);
    expect(templates.some((t) => t.id === 'codex-prod')).toBe(true);
    expect(templates.some((t) => t.id === 'codex-secure')).toBe(true);
  });

  it('应该返回 Claude 的所有模板', () => {
    const templates = getTemplatesByTool('claude');
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.every((t) => t.tool === 'claude')).toBe(true);

    expect(templates.length).toBeGreaterThanOrEqual(3);
    expect(templates.some((t) => t.id === 'claude-dev')).toBe(true);
    expect(templates.some((t) => t.id === 'claude-prod')).toBe(true);
    expect(templates.some((t) => t.id === 'claude-secure')).toBe(true);
  });

  it('应该返回 Gemini 的所有模板', () => {
    const templates = getTemplatesByTool('gemini');
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.every((t) => t.tool === 'gemini')).toBe(true);

    expect(templates.length).toBeGreaterThanOrEqual(3);
    expect(templates.some((t) => t.id === 'gemini-dev')).toBe(true);
    expect(templates.some((t) => t.id === 'gemini-prod')).toBe(true);
    expect(templates.some((t) => t.id === 'gemini-secure')).toBe(true);
  });

  it('不同工具的模板不应重叠', () => {
    const codexTemplates = getTemplatesByTool('codex');
    const claudeTemplates = getTemplatesByTool('claude');
    const geminiTemplates = getTemplatesByTool('gemini');

    const codexIds = codexTemplates.map((t) => t.id);
    const claudeIds = claudeTemplates.map((t) => t.id);
    const geminiIds = geminiTemplates.map((t) => t.id);

    // 验证没有重复的 ID
    const allIds = [...codexIds, ...claudeIds, ...geminiIds];
    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
  });
});

describe('getTemplateById', () => {
  it('应该返回存在的模板', () => {
    const template = getTemplateById('codex-dev');
    expect(template).not.toBeNull();
    expect(template?.id).toBe('codex-dev');
    expect(template?.tool).toBe('codex');
    expect(template?.name).toBeTruthy();
    expect(template?.description).toBeTruthy();
    expect(template?.values).toBeTruthy();
  });

  it('应该返回 null 对于不存在的模板', () => {
    const template = getTemplateById('non-existent-template');
    expect(template).toBeNull();
  });

  it('应该返回正确的 Codex 模板结构', () => {
    const template = getTemplateById('codex-dev');
    expect(template).not.toBeNull();

    const config = template!.values as CodexConfig;
    expect(config.model).toBeDefined();
    expect(typeof config.model).toBe('string');
    expect(config.approval_policy).toBeDefined();
    expect(config.sandbox_mode).toBeDefined();
  });

  it('应该返回正确的 Claude 模板结构', () => {
    const template = getTemplateById('claude-dev');
    expect(template).not.toBeNull();

    const config = template!.values as ClaudeConfig;
    expect(config.cleanupPeriodDays).toBeDefined();
    expect(config.outputStyle).toBeTruthy();
    expect(config.language).toBeTruthy();
    expect(typeof config.spinnerTipsEnabled).toBe('boolean');
  });

  it('应该返回正确的 Gemini 模板结构', () => {
    const template = getTemplateById('gemini-dev');
    expect(template).not.toBeNull();

    const config = template!.values as GeminiConfig;
    expect(config.projectId).toBeTruthy();
    expect(config.region).toBeTruthy();
    expect(config.model).toBeTruthy();
    expect(config.safetySettings).toBeDefined();
    expect(config.safetySettings.harassment).toBeTruthy();
    expect(config.safetySettings.hateSpeech).toBeTruthy();
  });
});

describe('applyTemplate', () => {
  it('应该返回模板的配置值', () => {
    const values = applyTemplate('codex-dev');
    expect(values).not.toBeNull();

    const config = values as CodexConfig;
    expect(config.model).toBeDefined();
    expect(config.approval_policy).toBeDefined();
  });

  it('应该返回 null 对于不存在的模板', () => {
    const values = applyTemplate('non-existent-template');
    expect(values).toBeNull();
  });

  it('应该返回深拷贝而非原始对象', () => {
    const values1 = applyTemplate('codex-dev') as CodexConfig;
    const values2 = applyTemplate('codex-dev') as CodexConfig;

    expect(values1).not.toBe(values2);
    expect(values1.model).not.toBe(values2.model);

    // 修改一个不应影响另一个
    values1.model = 'gpt-4';
    expect(values2.model).not.toBe('gpt-4');
  });

  it('Codex 开发模板应该有合理的默认值', () => {
    const config = applyTemplate('codex-dev') as CodexConfig;

    expect(config.model).toBe('gpt-5.4');
    expect(config.approval_policy).toBe('on-request');
    expect(config.sandbox_mode).toBe('workspace-write');
  });

  it('Codex 生产模板应该有合理的默认值', () => {
    const config = applyTemplate('codex-prod') as CodexConfig;

    expect(config.approval_policy).toBeDefined();
    expect(config.sandbox_mode).toBeDefined();
  });

  it('Codex 安全模板应该有严格的限制', () => {
    const config = applyTemplate('codex-secure') as CodexConfig;

    expect(config.sandbox_mode).toBe('read-only');
    expect(config.approval_policy).toBe('untrusted');
  });

  it('Claude 开发模板应该有合理的默认值', () => {
    const config = applyTemplate('claude-dev') as ClaudeConfig;

    expect(config.cleanupPeriodDays).toBe(720);
    expect(config.outputStyle).toBe('Structural Thinking');
    expect(config.language).toBe('Chinese');
  });

  it('Claude 安全模板应该有更严格的权限', () => {
    const devConfig = applyTemplate('claude-dev') as ClaudeConfig;
    const secureConfig = applyTemplate('claude-secure') as ClaudeConfig;

    expect(secureConfig.permissions?.allow?.length || 0).toBeLessThanOrEqual(
      devConfig.permissions?.allow?.length || 0
    );
  });

  it('Gemini 开发模板应该有合理的默认值', () => {
    const config = applyTemplate('gemini-dev') as GeminiConfig;

    expect(config.region).toBeTruthy();
    expect(config.model).toBeTruthy();
    expect(config.safetySettings.harassment).toBeTruthy();
  });

  it('Gemini 安全模板应该有更严格的过滤', () => {
    const secureConfig = applyTemplate('gemini-secure') as GeminiConfig;

    // 安全模式应该使用更严格的过滤级别
    // BLOCK_LOW_AND_ABOVE 比 BLOCK_MEDIUM_AND_ABOVE 更严格
    expect(secureConfig.safetySettings.harassment).toContain('LOW');
    expect(secureConfig.safetySettings.hateSpeech).toContain('LOW');
  });

  it('所有模板的敏感信息应该为空', () => {
    const codexConfig = applyTemplate('codex-dev') as CodexConfig;
    const claudeConfig = applyTemplate('claude-dev') as ClaudeConfig;
    const geminiConfig = applyTemplate('gemini-dev') as GeminiConfig;

    expect(codexConfig.model).toBeDefined();
    expect(claudeConfig.attribution?.commit).toBe('');
    expect(geminiConfig.apiKey).toBe('');
  });
});