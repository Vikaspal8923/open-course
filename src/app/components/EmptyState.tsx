import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 opacity-60 dark:bg-gray-800">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-gray-600 dark:text-gray-300">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
