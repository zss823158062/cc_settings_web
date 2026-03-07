/**
 * 文件操作工具模块
 * 提供配置文件导入导出、剪贴板操作等功能
 */

import type { ExportOptions, ImportResult } from '@/types/common';
import type { ToolType } from '@/types/config';
import { parseJSON, parseTOML } from './parser';

/**
 * 读取文件内容为文本
 * @param file - 文件对象
 * @returns Promise<string>，文件内容
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('文件读取失败：结果不是字符串'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败：' + reader.error?.message));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * 导出配置文件到本地
 * @param options - 导出选项
 * @returns Promise，导出成功后 resolve
 */
export async function exportConfigFile(options: ExportOptions): Promise<void> {
  const { filename, format, content } = options;

  // 根据格式确定文件扩展名和 MIME 类型
  const extension = format === 'json' ? '.json' : '.toml';
  const mimeType = format === 'json' ? 'application/json' : 'text/toml';
  const fullFilename = filename + extension;

  // 创建 Blob 对象
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 导入配置文件
 * @param file - 用户选择的文件对象
 * @param tool - 目标工具类型（用于验证格式）
 * @returns Promise<ImportResult>，包含解析结果或错误信息
 */
export async function importConfigFile(file: File, tool: ToolType): Promise<ImportResult> {
  try {
    // 读取文件内容
    const content = await readFileAsText(file);

    // 根据文件扩展名确定格式
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // 验证文件格式与工具类型匹配
    if (tool === 'codex' && fileExtension !== 'toml') {
      return {
        success: false,
        error: 'Codex 配置文件应为 .toml 格式',
      };
    }

    if ((tool === 'claude' || tool === 'gemini') && fileExtension !== 'json') {
      return {
        success: false,
        error: `${tool === 'claude' ? 'Claude Code' : 'Gemini CLI'} 配置文件应为 .json 格式`,
      };
    }

    // 根据格式解析配置
    let data;
    if (fileExtension === 'toml') {
      data = parseTOML(content);
    } else if (fileExtension === 'json') {
      data = parseJSON(content);
    } else {
      return {
        success: false,
        error: '不支持的文件格式，仅支持 .json 和 .toml 文件',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '文件解析失败',
    };
  }
}

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本内容
 * @returns Promise<boolean>，成功返回 true，失败返回 false
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // 降级方案：使用 document.execCommand（已废弃但兼容性好）
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
}
