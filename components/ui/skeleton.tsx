import { cn } from '@/shared/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('shimmer rounded-xl', className)} {...props} />;
}

export { Skeleton };
