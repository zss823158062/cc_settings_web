
interface SyntaxHighlightProps {
  code: string;
  language: 'json' | 'toml';
}

export function SyntaxHighlight({ code, language }: SyntaxHighlightProps) {
  const highlightJSON = (json: string) => {
    return json
      .replace(/(".*?"):/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>:')
      .replace(/: (".*?")/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/: (\d+)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>');
  };

  const highlightTOML = (toml: string) => {
    return toml
      .replace(/^\[.*\]$/gm, '<span class="text-blue-600 dark:text-blue-400 font-bold">$&</span>')
      .replace(/^(\w+)\s*=/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span> =')
      .replace(/= (".*?")/g, '= <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/= (true|false)/g, '= <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/= (\d+)/g, '= <span class="text-orange-600 dark:text-orange-400">$1</span>');
  };

  const highlightedCode = language === 'json' ? highlightJSON(code) : highlightTOML(code);

  return (
    <pre className="font-mono text-sm overflow-x-auto">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}
