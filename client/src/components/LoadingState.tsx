import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState({
  variant = "grid",
  testId,
}: {
  variant?: "grid" | "page";
  testId: string;
}) {
  if (variant === "page") {
    return (
      <div data-testid={testId} className="page-enter py-10">
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-premium">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="mt-3 h-4 w-80" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl p-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-6 h-10 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid={testId} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="rounded-2xl p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-6 h-10 w-full rounded-xl" />
        </Card>
      ))}
    </div>
  );
}
