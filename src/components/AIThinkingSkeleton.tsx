// components/AIThinkingSkeleton.tsx
export default function AIThinkingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
}
