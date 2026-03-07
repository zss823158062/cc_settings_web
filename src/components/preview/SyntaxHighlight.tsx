
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

    return escaped
      .replace(/^\[.*\]$/gm, '<span class="text-blue-600 dark:text-blue-400 font-bold">$&</span>')
      .replace(/^(\w+)\s*=/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span> =')
      .replace(/=\s*("(?:\\.|[^"\\])*")/g, '= <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/=\s*(true|false)\b/g, '= <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/=\s*(-?\d+\.?\d*)\b/g, '= <span class="text-orange-600 dark:text-orange-400">$1</span>');
  };

  const highlightedCode = language === 'json' ? highlightJSON(code) : highlightTOML(code);

  return (
    <pre className="font-mono text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}
