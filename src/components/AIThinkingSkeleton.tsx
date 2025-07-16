// components/AIThinkingSkeleton.tsx
export default function AIThinkingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10"></div>
      <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10"></div>
      <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10"></div>
      <div className="h-4 w-1/3 rounded bg-black/10 dark:bg-white/10"></div>
    </div>
  );
}
