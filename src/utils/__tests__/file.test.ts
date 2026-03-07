/**
 * 文件操作工具单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportConfigFile, importConfigFile, copyToClipboard, readFileAsText } from '../file';
import type { ExportOptions } from '@/types/common';

describe('readFileAsText', () => {
  it('应该成功读取文件内容', async () => {
    const content = 'test file content';
    const file = new File([content], 'test.txt', { type: 'text/plain' });

    const result = await readFileAsText(file);

    expect(result).toBe(content);
  });

  it('应该读取 UTF-8 编码的文件', async () => {
    const content = '中文内容测试';
    const file = new File([content], 'test.txt', { type: 'text/plain' });

    const result = await readFileAsText(file);

    expect(result).toBe(content);
  });

  it('应该处理空文件', async () => {
    const file = new File([''], 'empty.txt', { type: 'text/plain' });

    const result = await readFileAsText(file);

    expect(result).toBe('');
  });
});

describe('exportConfigFile', () => {
  let createElementSpy: any;
  let appendChildSpy: any;
  let removeChildSpy: any;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;

  beforeEach(() => {
    // Mock DOM 操作
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    // Mock URL API
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该导出 JSON 格式的配置文件', async () => {
    const options: ExportOptions = {
      filename: 'config',
      format: 'json',
      content: '{"key": "value"}',
    };

    await exportConfigFile(options);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });

  it('应该导出 TOML 格式的配置文件', async () => {
    const options: ExportOptions = {
      filename: 'config',
      format: 'toml',
      content: '[api]\nkey = "value"',
    };

    await exportConfigFile(options);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
  });

  it('应该使用正确的文件名和扩展名', async () => {
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    createElementSpy.mockReturnValue(mockLink);

    const options: ExportOptions = {
      filename: 'my-config',
      format: 'json',
      content: '{}',
    };

    await exportConfigFile(options);

    expect(mockLink.download).toBe('my-config.json');
  });
});

describe('importConfigFile', () => {
  // Mock parser 函数
  beforeEach(() => {
    vi.mock('../parser', () => ({
      parseJSON: vi.fn((content: string) => JSON.parse(content)),
      parseTOML: vi.fn(() => ({
        api: { key: 'test', base_url: 'http://test.com' },
        model: { name: 'gpt-4', temperature: 0.7, max_tokens: 2048 },
        behavior: { auto_save: true, timeout: 30 },
      })),
    }));
  });

  it('应该成功导入 JSON 配置文件', async () => {
    const content = '{"apiKey": "test-key", "model": "claude-sonnet-4"}';
    const file = new File([content], 'config.json', { type: 'application/json' });

    const result = await importConfigFile(file, 'claude');

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('应该成功导入 TOML 配置文件', async () => {
    const content = '[api]\nkey = "test"';
    const file = new File([content], 'config.toml', { type: 'text/toml' });

    const result = await importConfigFile(file, 'codex');

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('应该拒绝格式不匹配的文件（Codex 需要 TOML）', async () => {
    const content = '{"key": "value"}';
    const file = new File([content], 'config.json', { type: 'application/json' });

    const result = await importConfigFile(file, 'codex');

    expect(result.success).toBe(false);
    expect(result.error).toContain('toml');
  });

  it('应该拒绝格式不匹配的文件（Claude 需要 JSON）', async () => {
    const content = '[api]\nkey = "test"';
    const file = new File([content], 'config.toml', { type: 'text/toml' });

    const result = await importConfigFile(file, 'claude');

    expect(result.success).toBe(false);
    expect(result.error).toContain('json');
  });

  it('应该拒绝不支持的文件格式', async () => {
    const content = 'some content';
    const file = new File([content], 'config.txt', { type: 'text/plain' });

    const result = await importConfigFile(file, 'claude');

    expect(result.success).toBe(false);
    expect(result.error).toContain('不支持的文件格式');
  });

  it('应该处理解析错误', async () => {
    const content = 'invalid json {';
    const file = new File([content], 'config.json', { type: 'application/json' });

    const result = await importConfigFile(file, 'claude');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('copyToClipboard', () => {
  it('应该使用 Clipboard API 复制文本', async () => {
    const text = 'test content';
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await copyToClipboard(text);

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith(text);
  });

  it('应该在 Clipboard API 不可用时使用降级方案', async () => {
    // 移除 Clipboard API
    Object.assign(navigator, {
      clipboard: undefined,
    });

    const execCommandMock = vi.spyOn(document, 'execCommand').mockReturnValue(true);
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    const text = 'test content';
    const result = await copyToClipboard(text);

    expect(result).toBe(true);
    expect(createElementSpy).toHaveBeenCalledWith('textarea');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(execCommandMock).toHaveBeenCalledWith('copy');

    vi.restoreAllMocks();
  });

  it('应该在复制失败时返回 false', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));

    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await copyToClipboard('test');

    expect(result).toBe(false);
  });

  it('应该处理空字符串', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await copyToClipboard('');

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('');
  });

  it('应该处理多行文本', async () => {
    const text = 'line1\nline2\nline3';
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await copyToClipboard(text);

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith(text);
  });
});

