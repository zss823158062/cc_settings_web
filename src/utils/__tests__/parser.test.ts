/**
 * 配置解析器单元测试
 * 测试 JSON/TOML 格式的解析和生成功能
 */

import { describe, it, expect } from 'vitest';
import {
  stringifyJSON,
  stringifyTOML,
  parseJSON,
  parseTOML,
  generateConfigString,
} from '../parser';
import type { CodexConfig, ClaudeConfig, GeminiConfig } from '@/types/config';

describe('parser - stringifyJSON', () => {
  it('应该正确格式化 ClaudeConfig 为 JSON（pretty=true）', () => {
    const config: ClaudeConfig = {
      cleanupPeriodDays: 720,
      env: {
        ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      },
      outputStyle: 'Structural Thinking',
      language: 'Chinese',
    };

    const result = stringifyJSON(config, true);

    expect(result).toContain('"cleanupPeriodDays": 720');
    expect(result).toContain('"outputStyle": "Structural Thinking"');
    expect(result).toContain('"language": "Chinese"');
    // 验证格式化（包含换行和缩进）
    expect(result).toContain('\n');
    expect(result).toContain('  ');
  });

  it('应该正确格式化 GeminiConfig 为 JSON（pretty=true）', () => {
    const config: GeminiConfig = {
      apiKey: 'AIzaTest123',
      projectId: 'my-project',
      region: 'us-central1',
      model: 'gemini-pro',
      safetySettings: {
        harassment: 'BLOCK_MEDIUM_AND_ABOVE',
        hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    };

    const result = stringifyJSON(config, true);

    expect(result).toContain('"apiKey": "AIzaTest123"');
    expect(result).toContain('"projectId": "my-project"');
    expect(result).toContain('"region": "us-central1"');
    expect(result).toContain('"safetySettings"');
  });

  it('应该正确生成紧凑 JSON（pretty=false）', () => {
    const config: ClaudeConfig = {
      cleanupPeriodDays: 720,
      outputStyle: 'Structural Thinking',
    };

    const result = stringifyJSON(config, false);

    expect(result).not.toContain('\n');
    expect(result).toContain('{"cleanupPeriodDays":720');
  });
});

describe('parser - stringifyTOML', () => {
  it('应该正确格式化 CodexConfig 为 TOML', () => {
    const config: CodexConfig = {
      api: {
        key: 'sk-test123',
        base_url: 'https://api.openai.com/v1',
      },
      model: {
        name: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2048,
      },
      behavior: {
        auto_save: true,
        timeout: 30,
      },
    };

    const result = stringifyTOML(config);

    expect(result).toContain('[api]');
    expect(result).toContain('key = "sk-test123"');
    expect(result).toContain('base_url = "https://api.openai.com/v1"');
    expect(result).toContain('[model]');
    expect(result).toContain('name = "gpt-4"');
    expect(result).toContain('temperature = 0.7');
    expect(result).toContain('max_tokens = 2048');
    expect(result).toContain('[behavior]');
    expect(result).toContain('auto_save = true');
    expect(result).toContain('timeout = 30');
  });

  it('应该正确处理布尔值和数字类型', () => {
    const config: CodexConfig = {
      api: {
        key: 'sk-test',
        base_url: 'https://example.com',
      },
      model: {
        name: 'gpt-3.5-turbo',
        temperature: 1.5,
        max_tokens: 4096,
      },
      behavior: {
        auto_save: false,
        timeout: 60,
      },
    };

    const result = stringifyTOML(config);

    expect(result).toContain('auto_save = false');
    expect(result).toContain('temperature = 1.5');
    expect(result).toContain('timeout = 60');
  });
});

describe('parser - parseJSON', () => {
  it('应该正确解析 ClaudeConfig JSON 字符串', () => {
    const jsonString = JSON.stringify({
      cleanupPeriodDays: 720,
      env: {
        ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      },
      outputStyle: 'Structural Thinking',
      language: 'Chinese',
    });

    const result = parseJSON<ClaudeConfig>(jsonString);

    expect(result.cleanupPeriodDays).toBe(720);
    expect(result.outputStyle).toBe('Structural Thinking');
    expect(result.language).toBe('Chinese');
  });

  it('应该正确解析 GeminiConfig JSON 字符串', () => {
    const jsonString = JSON.stringify({
      apiKey: 'AIzaXXX',
      projectId: 'test-project',
      region: 'asia-east1',
      model: 'gemini-ultra',
      safetySettings: {
        harassment: 'BLOCK_HIGH',
        hateSpeech: 'BLOCK_NONE',
      },
    });

    const result = parseJSON<GeminiConfig>(jsonString);

    expect(result.apiKey).toBe('AIzaXXX');
    expect(result.projectId).toBe('test-project');
    expect(result.region).toBe('asia-east1');
    expect(result.safetySettings.harassment).toBe('BLOCK_HIGH');
  });

  it('应该在 JSON 格式错误时抛出异常', () => {
    const invalidJSON = '{ "apiKey": "test", invalid }';

    expect(() => parseJSON(invalidJSON)).toThrow('JSON 格式错误');
  });

  it('应该在 JSON 不完整时抛出异常', () => {
    const incompleteJSON = '{ "apiKey": "test"';

    expect(() => parseJSON(incompleteJSON)).toThrow('JSON 格式错误');
  });
});

describe('parser - parseTOML', () => {
  it('应该正确解析 CodexConfig TOML 字符串', () => {
    const tomlString = `
[api]
key = "sk-test123"
base_url = "https://api.openai.com/v1"

[model]
name = "gpt-4"
temperature = 0.7
max_tokens = 2048

[behavior]
auto_save = true
timeout = 30
`;

    const result = parseTOML(tomlString);

    expect(result.api.key).toBe('sk-test123');
    expect(result.api.base_url).toBe('https://api.openai.com/v1');
    expect(result.model.name).toBe('gpt-4');
    expect(result.model.temperature).toBe(0.7);
    expect(result.model.max_tokens).toBe(2048);
    expect(result.behavior.auto_save).toBe(true);
    expect(result.behavior.timeout).toBe(30);
  });

  it('应该正确处理不同的数值类型', () => {
    const tomlString = `
[api]
key = "sk-test"
base_url = "https://example.com"

[model]
name = "gpt-3.5-turbo"
temperature = 1.2
max_tokens = 8192

[behavior]
auto_save = false
timeout = 120
`;

    const result = parseTOML(tomlString);

    expect(result.model.temperature).toBe(1.2);
    expect(result.model.max_tokens).toBe(8192);
    expect(result.behavior.auto_save).toBe(false);
    expect(result.behavior.timeout).toBe(120);
  });

  it('应该在 TOML 格式错误时抛出异常', () => {
    const invalidTOML = `
[api
key = "test"
`;

    expect(() => parseTOML(invalidTOML)).toThrow('TOML 格式错误');
  });

  it('应该在 TOML 语法错误时抛出异常', () => {
    const invalidTOML = `
[api]
key = test without quotes
`;

    expect(() => parseTOML(invalidTOML)).toThrow('TOML 格式错误');
  });
});

describe('parser - generateConfigString', () => {
  it('应该为 codex 工具生成 TOML 字符串', () => {
    const config: CodexConfig = {
      api: {
        key: 'sk-test',
        base_url: 'https://api.openai.com/v1',
      },
      model: {
        name: 'gpt-4',
        temperature: 0.8,
        max_tokens: 1024,
      },
      behavior: {
        auto_save: true,
        timeout: 45,
      },
    };

    const result = generateConfigString('codex', config);

    expect(result).toContain('[api]');
    expect(result).toContain('key = "sk-test"');
    expect(result).toContain('[model]');
    expect(result).toContain('[behavior]');
  });

  it('应该为 claude 工具生成 JSON 字符串', () => {
    const config: ClaudeConfig = {
      cleanupPeriodDays: 720,
      outputStyle: 'Structural Thinking',
      language: 'Chinese',
    };

    const result = generateConfigString('claude', config);

    expect(result).toContain('"cleanupPeriodDays"');
    expect(result).toContain('"outputStyle"');
    expect(result).toContain('\n'); // 验证是格式化的 JSON
  });

  it('应该为 gemini 工具生成 JSON 字符串', () => {
    const config: GeminiConfig = {
      apiKey: 'AIzaTest',
      projectId: 'test-project',
      region: 'us-central1',
      model: 'gemini-pro',
      safetySettings: {
        harassment: 'BLOCK_MEDIUM_AND_ABOVE',
        hateSpeech: 'BLOCK_LOW_AND_ABOVE',
      },
    };

    const result = generateConfigString('gemini', config);

    expect(result).toContain('"apiKey"');
    expect(result).toContain('"projectId"');
    expect(result).toContain('"safetySettings"');
    expect(result).toContain('\n'); // 验证是格式化的 JSON
  });
});

describe('parser - 集成测试', () => {
  it('应该能够往返转换 CodexConfig（stringify -> parse）', () => {
    const original: CodexConfig = {
      api: {
        key: 'sk-original',
        base_url: 'https://api.test.com',
      },
      model: {
        name: 'gpt-4-turbo',
        temperature: 0.5,
        max_tokens: 3000,
      },
      behavior: {
        auto_save: false,
        timeout: 90,
      },
    };

    const tomlString = stringifyTOML(original);
    const parsed = parseTOML(tomlString);

    expect(parsed).toEqual(original);
  });

  it('应该能够往返转换 ClaudeConfig（stringify -> parse）', () => {
    const original: ClaudeConfig = {
      cleanupPeriodDays: 720,
      env: {
        ANTHROPIC_AUTH_TOKEN: 'code-switch-r',
      },
      outputStyle: 'Structural Thinking',
      language: 'Chinese',
    };

    const jsonString = stringifyJSON(original);
    const parsed = parseJSON<ClaudeConfig>(jsonString);

    expect(parsed).toEqual(original);
  });

  it('应该能够往返转换 GeminiConfig（stringify -> parse）', () => {
    const original: GeminiConfig = {
      apiKey: 'AIzaOriginal',
      projectId: 'original-project',
      region: 'europe-west1',
      model: 'gemini-ultra',
      safetySettings: {
        harassment: 'BLOCK_NONE',
        hateSpeech: 'BLOCK_HIGH',
      },
    };

    const jsonString = stringifyJSON(original);
    const parsed = parseJSON<GeminiConfig>(jsonString);

    expect(parsed).toEqual(original);
  });
});
