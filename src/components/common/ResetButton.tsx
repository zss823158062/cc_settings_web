
interface ResetButtonProps {
  onReset: () => void;
  confirmMessage?: string;
  className?: string;
}

export function ResetButton({
  onReset,
  confirmMessage = '确定要重置吗？所有未保存的更改将丢失。',
  className = ''
}: ResetButtonProps) {
  const handleReset = () => {
    if (window.confirm(confirmMessage)) {
      onReset();
    }
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      重置
    </button>
  );
}
