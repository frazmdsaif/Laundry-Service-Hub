import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  testId,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  testId: string;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-3xl border bg-card/70 backdrop-blur p-8 sm:p-10",
        "shadow-premium text-center",
      )}
    >
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border bg-background/70">
        {icon}
      </div>
      <div className="mt-4 font-display text-2xl">{title}</div>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
