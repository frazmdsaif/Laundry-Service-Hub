import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { Link } from "wouter";
import { useCustomerMe } from "@/hooks/use-customer-auth";
import { api } from "@shared/routes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Calendar, MapPin, Sparkles, Timer } from "lucide-react";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

const statusTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function BookingsPage() {
  const me = useCustomerMe();

  const bookings = useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await fetch(api.bookings.list.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to load bookings");
      const json = await res.json();
      return parseWithLogging(api.bookings.list.responses[200], json, "bookings.list.200");
    },
    retry: false,
    enabled: !me.isLoading,
  });

  if (me.isLoading || bookings.isLoading) {
    return (
      <>
        <Seo title="My bookings — Laundrè" description="Track your pickup bookings." />
        <TopNav />
        <Shell>
          <div className="page-enter pt-6 sm:pt-10 pb-14">
            <LoadingState variant="page" testId="bookings-loading" />
          </div>
        </Shell>
      </>
    );
  }

  if (!me.data) {
    return (
      <>
        <Seo title="My bookings — Laundrè" description="Track your pickup bookings." />
        <TopNav />
        <Shell>
          <div className="page-enter pt-6 sm:pt-10 pb-14">
            <EmptyState
              testId="bookings-loggedout"
              icon={<Sparkles className="h-6 w-6 text-muted-foreground" />}
              title="Log in to see your bookings"
              description="Bookings are tied to your account."
              action={
                <Link href="/login" className="inline-flex">
                  <Button className="rounded-xl">
                    Log in
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
              }
            />
          </div>
        </Shell>
      </>
    );
  }

  if (bookings.isError) {
    return (
      <>
        <Seo title="My bookings — Laundrè" description="Track your pickup bookings." />
        <TopNav />
        <Shell>
          <div className="page-enter pt-6 sm:pt-10 pb-14">
            <EmptyState
              testId="bookings-error"
              icon={<Sparkles className="h-6 w-6 text-muted-foreground" />}
              title="Couldn’t load bookings"
              description="Please try again."
              action={
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => bookings.refetch()}
                >
                  Retry
                </Button>
              }
            />
          </div>
        </Shell>
      </>
    );
  }

  const items = bookings.data ?? [];

  return (
    <>
      <Seo title="My bookings — Laundrè" description="Track your pickup bookings." />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="glass rounded-3xl p-6 sm:p-10 shadow-premium">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  My bookings
                </div>
                <div className="mt-2 font-display text-2xl sm:text-3xl">
                  Your pickup schedule
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Track dates, times, and status.
                </p>
              </div>
              <Link href="/book" className="inline-flex">
                <Button className="rounded-xl">Book a slot</Button>
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  testId="bookings-empty"
                  icon={<Calendar className="h-6 w-6 text-muted-foreground" />}
                  title="No bookings yet"
                  description="Schedule a pickup to see it here."
                  action={
                    <Link href="/book" className="inline-flex">
                      <Button variant="secondary" className="rounded-xl">
                        Book now
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {items.map((b) => (
                  <Card
                    key={b.id}
                    className="rounded-2xl border bg-card/70 backdrop-blur shadow-premium"
                  >
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{b.bookingDate}</span>
                          <Timer className="h-4 w-4 ml-2" />
                          <span>{b.bookingTime}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span className="text-foreground">
                            {b.address}
                            {b.city ? `, ${b.city}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            statusTone[b.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {b.status}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          ID: {b.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Shell>
    </>
  );
}
