import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="grain min-h-dvh">
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
