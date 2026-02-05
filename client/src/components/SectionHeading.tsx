import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  right,
  testId,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  testId?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="max-w-2xl">
        {kicker ? (
          <div
            className="text-xs font-semibold tracking-wide uppercase text-muted-foreground"
            data-testid={testId ? `${testId}-kicker` : undefined}
          >
            {kicker}
          </div>
        ) : null}
        <h2
          className={cn(
            "mt-2 text-2xl sm:text-3xl md:text-4xl leading-[1.05]",
            "font-display",
          )}
          data-testid={testId ? `${testId}-title` : undefined}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid={testId ? `${testId}-subtitle` : undefined}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
