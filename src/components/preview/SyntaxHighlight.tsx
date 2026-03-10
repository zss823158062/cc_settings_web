
interface SyntaxHighlightProps {
  code: string;
  language: 'json' | 'toml';
}

export function SyntaxHighlight({ code, language }: SyntaxHighlightProps) {
  const highlightJSON = (json: string) => {
    // 转义 HTML 特殊字符
    const escaped = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 高亮 JSON 语法
    return escaped
      .replace(/("(?:\\.|[^"\\])*")(\s*:)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>$2')
      .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/:\s*(true|false|null)\b/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*)\b/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/([{}[\],])/g, '<span class="text-gray-700 dark:text-gray-300">$1</span>');
  };

  const highlightTOML = (toml: string) => {
    // 转义 HTML 特殊字符
    const escaped = toml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 按行处理，避免正则替换冲突
    const lines = escaped.split('\n');
    const highlighted = lines.map(line => {
      // 空行
      if (!line.trim()) return line;

      // TOML 表格标题 [section]
      if (/^\[.*\]$/.test(line)) {
        return `<span class="text-blue-600 dark:text-blue-400 font-bold">${line}</span>`;
      }

      // 键值对
      const kvMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (kvMatch) {
        const key = kvMatch[1];
        const value = kvMatch[2].trim();

        let highlightedValue = value;

        // 字符串值
        if (/^".*"$/.test(value)) {
          highlightedValue = `<span class="text-green-600 dark:text-green-400">${value}</span>`;
        }
        // 布尔值
        else if (/^(true|false)$/.test(value)) {
          highlightedValue = `<span class="text-orange-600 dark:text-orange-400">${value}</span>`;
        }
        // 数字
        else if (/^-?\d+\.?\d*$/.test(value)) {
          highlightedValue = `<span class="text-orange-600 dark:text-orange-400">${value}</span>`;
        }
        // 数组
        else if (/^\[.*\]$/.test(value)) {
          highlightedValue = value.replace(/"([^"]*)"/g, '<span class="text-green-600 dark:text-green-400">"$1"</span>');
        }

        return `<span class="text-purple-600 dark:text-purple-400">${key}</span> = ${highlightedValue}`;
      }

      // 注释
      if (line.trim().startsWith('#')) {
        return `<span class="text-gray-500 dark:text-gray-500">${line}</span>`;
      }

      return line;
    });

    return highlighted.join('\n');
  };

  const highlightedCode = language === 'json' ? highlightJSON(code) : highlightTOML(code);

  return (
    <pre className="font-mono text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}
