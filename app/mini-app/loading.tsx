import { Skeleton } from '@/components/ui/skeleton';

export default function MiniAppLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="grid grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-2.5 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}
