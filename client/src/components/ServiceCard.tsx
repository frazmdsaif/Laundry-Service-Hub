import { IndianRupee, Timer, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function formatInr(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₹${n}`;
  }
}

export default function ServiceCard({
  service,
  variant = "default",
  onBook,
  testId,
}: {
  service: Service;
  variant?: "default" | "compact";
  onBook?: (service: Service) => void;
  testId: string;
}) {
  const { toast } = useToast();

  return (
    <Card
      data-testid={testId}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur",
        "shadow-premium transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10",
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-accent/15 blur-2xl" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Fabric-safe process
            </div>
            <h3 className="mt-3 text-lg sm:text-xl font-display leading-tight">
              {service.title}
            </h3>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" />
              Starting at
            </div>
            <div className="mt-1 text-lg sm:text-xl font-bold">
              {formatInr(service.priceInr)}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-xs font-semibold">
            <Timer className="h-4 w-4 text-foreground/70" />
            24–48h turnaround
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Free pickup (select areas)
          </div>
        </div>

        <div className={cn("mt-5", variant === "compact" && "mt-4")}>
          <Button
            onClick={() => {
              if (onBook) return onBook(service);
              toast({
                title: "Booking coming soon",
                description:
                  "This UI is ready — connect a booking endpoint when available.",
              });
            }}
            data-testid={`${testId}-book`}
            className={cn(
              "w-full rounded-xl font-semibold",
              "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
              "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5",
              "active:translate-y-0 transition-all duration-200",
            )}
          >
            Book {service.title}
          </Button>
        </div>
      </div>
    </Card>
  );
}
