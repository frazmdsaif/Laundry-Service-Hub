import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import type { BeforeAfterItem } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BeforeAfterCard({
  item,
  testId,
}: {
  item: BeforeAfterItem;
  testId: string;
}) {
  const [mode, setMode] = useState<"before" | "after">("after");
  const [open, setOpen] = useState(false);

  const img = useMemo(() => {
    return mode === "before" ? item.beforeImageUrl : item.afterImageUrl;
  }, [mode, item.afterImageUrl, item.beforeImageUrl]);

  return (
    <>
      <Card
        data-testid={testId}
        className={cn(
          "group overflow-hidden rounded-2xl border bg-card/70 backdrop-blur",
          "shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10",
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-accent/18 blur-2xl" />
            <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-primary/18 blur-2xl" />
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={img}
              alt={`${item.title} — ${mode}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              data-testid={`${testId}-img`}
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="glass rounded-2xl px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{item.title}</div>
                  <div className="text-[11px] text-muted-foreground -mt-0.5">
                    Viewing: <span className="font-semibold">{mode}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setMode((m) => (m === "before" ? "after" : "before"))}
                    data-testid={`${testId}-toggle`}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Toggle
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setOpen(true)}
                    data-testid={`${testId}-view`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{item.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border bg-muted">
              <div className="px-4 py-3 text-xs font-semibold text-muted-foreground border-b bg-background/60">
                Before
              </div>
              <img
                src={item.beforeImageUrl}
                alt={`${item.title} before`}
                className="w-full h-auto"
                data-testid={`${testId}-modal-before`}
              />
            </div>
            <div className="rounded-2xl overflow-hidden border bg-muted">
              <div className="px-4 py-3 text-xs font-semibold text-muted-foreground border-b bg-background/60">
                After
              </div>
              <img
                src={item.afterImageUrl}
                alt={`${item.title} after`}
                className="w-full h-auto"
                data-testid={`${testId}-modal-after`}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
