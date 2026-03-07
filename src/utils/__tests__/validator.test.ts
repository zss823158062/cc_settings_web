/**
 * 验证工具单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  validateApiKey,
  validateURL,
  validateNumberRange,
  getFieldError,
} from '../validator';
import type { FormField } from '@/types/form';

describe('validateApiKey', () => {
  describe('Codex API Key 验证', () => {
    it('应该接受有效的 Codex API Key', () => {
      const result = validateApiKey('sk-1234567890abcdefghijklmnop', 'codex');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该拒绝不以 sk- 开头的 Key', () => {
      const result = validateApiKey('invalid-key-1234567890', 'codex');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Codex API Key 必须以 sk- 开头');
    });

    it('应该拒绝长度不足的 Key', () => {
      const result = validateApiKey('sk-short', 'codex');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('API Key 长度必须大于 20 个字符');
    });

    it('应该拒绝空字符串', () => {
      const result = validateApiKey('', 'codex');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('API Key 不能为空');
    });

    it('应该处理前后空格', () => {
      const result = validateApiKey('  sk-1234567890abcdefghijklmnop  ', 'codex');
      expect(result.valid).toBe(true);
    });
  });

  describe('Claude API Key 验证', () => {
    it('应该接受有效的 Claude API Key', () => {
      const result = validateApiKey('sk-ant-1234567890abcdefghijklmnop', 'claude');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该拒绝不以 sk-ant- 开头的 Key', () => {
      const result = validateApiKey('sk-1234567890abcdefghijklmnop', 'claude');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Claude API Key 必须以 sk-ant- 开头');
    });

    it('应该拒绝长度不足的 Key', () => {
      const result = validateApiKey('sk-ant-short', 'claude');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('API Key 长度必须大于 20 个字符');
    });
  });

  describe('Gemini API Key 验证', () => {
    it('应该接受有效的 Gemini API Key', () => {
      const result = validateApiKey('AIza1234567890abcdefghijklmnop', 'gemini');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该拒绝不以 AIza 开头的 Key', () => {
      const result = validateApiKey('invalid-1234567890abcdefghijklmnop', 'gemini');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Gemini API Key 必须以 AIza 开头');
    });

    it('应该拒绝长度不足的 Key', () => {
      const result = validateApiKey('AIzashort', 'gemini');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('API Key 长度必须至少 20 个字符');
    });
  });
});

describe('validateURL', () => {
  it('应该接受有效的 HTTP URL', () => {
    expect(validateURL('http://example.com')).toBe(true);
    expect(validateURL('http://api.example.com/v1')).toBe(true);
  });

  it('应该接受有效的 HTTPS URL', () => {
    expect(validateURL('https://example.com')).toBe(true);
    expect(validateURL('https://api.openai.com/v1')).toBe(true);
  });

  it('应该拒绝无效的 URL', () => {
    expect(validateURL('not-a-url')).toBe(false);
    expect(validateURL('ftp://example.com')).toBe(false);
    expect(validateURL('example.com')).toBe(false);
  });

  it('应该拒绝空字符串', () => {
    expect(validateURL('')).toBe(false);
    expect(validateURL('   ')).toBe(false);
  });

  it('应该拒绝其他协议', () => {
    expect(validateURL('ftp://example.com')).toBe(false);
    expect(validateURL('file:///path/to/file')).toBe(false);
  });
});

describe('validateNumberRange', () => {
  it('应该接受范围内的数值', () => {
    expect(validateNumberRange(5, 0, 10)).toBe(true);
    expect(validateNumberRange(0, 0, 10)).toBe(true);
    expect(validateNumberRange(10, 0, 10)).toBe(true);
  });

  it('应该拒绝范围外的数值', () => {
    expect(validateNumberRange(-1, 0, 10)).toBe(false);
    expect(validateNumberRange(11, 0, 10)).toBe(false);
  });

  it('应该拒绝非数值', () => {
    expect(validateNumberRange(NaN, 0, 10)).toBe(false);
    expect(validateNumberRange('5' as any, 0, 10)).toBe(false);
  });

  it('应该处理小数', () => {
    expect(validateNumberRange(0.5, 0, 1)).toBe(true);
    expect(validateNumberRange(1.5, 0, 1)).toBe(false);
  });

  it('应该处理负数范围', () => {
    expect(validateNumberRange(-5, -10, 0)).toBe(true);
    expect(validateNumberRange(-11, -10, 0)).toBe(false);
  });
});

describe('getFieldError', () => {
  describe('必填字段验证', () => {
    const requiredField: FormField = {
      name: 'test',
      label: '测试字段',
      type: 'text',
      required: true,
      defaultValue: '',
    };

    it('应该拒绝空值', () => {
      expect(getFieldError('test', '', requiredField)).toBe('此字段为必填项');
      expect(getFieldError('test', null, requiredField)).toBe('此字段为必填项');
      expect(getFieldError('test', undefined, requiredField)).toBe('此字段为必填项');
    });

    it('应该接受有效值', () => {
      expect(getFieldError('test', 'value', requiredField)).toBeNull();
    });
  });

  describe('数组字段验证', () => {
    const arrayField: FormField = {
      name: 'items',
      label: '项目列表',
      type: 'array',
      required: true,
      defaultValue: [],
    };

    it('应该拒绝空数组（必填时）', () => {
      expect(getFieldError('items', [], arrayField)).toBe('此字段至少需要一个值');
    });

    it('应该接受非空数组', () => {
      expect(getFieldError('items', ['item1'], arrayField)).toBeNull();
    });

    it('应该拒绝非数组值', () => {
      const nonRequiredArrayField = { ...arrayField, required: false };
      expect(getFieldError('items', 'not-array', nonRequiredArrayField)).toBe(
        '此字段必须是数组'
      );
    });
  });

  describe('数值字段验证', () => {
    const numberField: FormField = {
      name: 'count',
      label: '数量',
      type: 'number',
      required: false,
      defaultValue: 0,
    };

    it('应该拒绝非数值', () => {
      expect(getFieldError('count', 'not-a-number', numberField)).toBe(
        '请输入有效的数字'
      );
      expect(getFieldError('count', NaN, numberField)).toBe('请输入有效的数字');
    });

    it('应该接受有效数值', () => {
      expect(getFieldError('count', 42, numberField)).toBeNull();
    });
  });

  describe('温度参数验证', () => {
    const tempField: FormField = {
      name: 'model.temperature',
      label: '温度',
      type: 'number',
      required: true,
      defaultValue: 0.7,
    };

    it('应该验证温度范围 0-2', () => {
      expect(getFieldError('model.temperature', 0, tempField)).toBeNull();
      expect(getFieldError('model.temperature', 1, tempField)).toBeNull();
      expect(getFieldError('model.temperature', 2, tempField)).toBeNull();
      expect(getFieldError('model.temperature', -0.1, tempField)).toBe(
        '温度参数必须在 0-2 之间'
      );
      expect(getFieldError('model.temperature', 2.1, tempField)).toBe(
        '温度参数必须在 0-2 之间'
      );
    });
  });

  describe('max_tokens 验证', () => {
    const tokensField: FormField = {
      name: 'model.max_tokens',
      label: '最大 Token',
      type: 'number',
      required: true,
      defaultValue: 2048,
    };

    it('应该验证 max_tokens 范围 1-100000', () => {
      expect(getFieldError('model.max_tokens', 1, tokensField)).toBeNull();
      expect(getFieldError('model.max_tokens', 2048, tokensField)).toBeNull();
      expect(getFieldError('model.max_tokens', 100000, tokensField)).toBeNull();
      expect(getFieldError('model.max_tokens', 0, tokensField)).toBe(
        '最大 token 数必须在 1-100000 之间'
      );
      expect(getFieldError('model.max_tokens', 100001, tokensField)).toBe(
        '最大 token 数必须在 1-100000 之间'
      );
    });
  });

  describe('URL 字段验证', () => {
    const urlField: FormField = {
      name: 'api.base_url',
      label: 'API URL',
      type: 'text',
      required: true,
      defaultValue: '',
    };

    it('应该验证 URL 格式', () => {
      expect(getFieldError('api.base_url', 'https://api.example.com', urlField)).toBeNull();
      expect(getFieldError('api.base_url', 'not-a-url', urlField)).toBe(
        '请输入有效的 HTTP/HTTPS 地址'
      );
    });
  });

  describe('布尔字段验证', () => {
    const boolField: FormField = {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: false,
      defaultValue: false,
    };

    it('应该接受布尔值', () => {
      expect(getFieldError('enabled', true, boolField)).toBeNull();
      expect(getFieldError('enabled', false, boolField)).toBeNull();
    });

    it('应该拒绝非布尔值', () => {
      expect(getFieldError('enabled', 'true', boolField)).toBe('此字段必须是布尔值');
      expect(getFieldError('enabled', 1, boolField)).toBe('此字段必须是布尔值');
    });
  });

  describe('非必填字段', () => {
    const optionalField: FormField = {
      name: 'optional',
      label: '可选字段',
      type: 'text',
      required: false,
      defaultValue: '',
    };

    it('应该允许空值', () => {
      expect(getFieldError('optional', '', optionalField)).toBeNull();
      expect(getFieldError('optional', null, optionalField)).toBeNull();
      expect(getFieldError('optional', undefined, optionalField)).toBeNull();
    });
  });
});
