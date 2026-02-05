import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useServices } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Shirt, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  const q = useServices();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const items = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(s) ||
        it.description.toLowerCase().includes(s),
    );
  }, [q.data, search]);

  return (
    <>
      <Seo
        title="Services — Laundrè"
        description="Explore laundry services with transparent pricing and premium care."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="glass rounded-3xl p-6 sm:p-10 shadow-premium">
            <SectionHeading
              kicker="Catalog"
              title="Services & pricing"
              subtitle="Clean choices, clear pricing. Pick what you need — we’ll do the rest."
              testId="services-heading"
              right={
                <div className="hidden md:flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search services…"
                      className="pl-9 w-72 rounded-xl"
                      data-testid="services-search"
                    />
                  </div>
                </div>
              }
            />

            <div className="mt-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services…"
                  className="pl-9 rounded-xl"
                  data-testid="services-search-mobile"
                />
              </div>
            </div>

            <div className="mt-6">
              {q.isLoading ? (
                <LoadingState testId="services-loading" />
              ) : q.isError ? (
                <EmptyState
                  testId="services-error"
                  icon={<Shirt className="h-6 w-6 text-muted-foreground" />}
                  title="Couldn’t load services"
                  description="Please try again."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => q.refetch()}
                      data-testid="services-retry"
                    >
                      Retry
                    </Button>
                  }
                />
              ) : (q.data?.length ?? 0) === 0 ? (
                <EmptyState
                  testId="services-empty"
                  icon={<Shirt className="h-6 w-6 text-muted-foreground" />}
                  title="No services yet"
                  description="Add services on the backend to populate this page."
                />
              ) : filtered.length === 0 ? (
                <EmptyState
                  testId="services-noresults"
                  icon={<Search className="h-6 w-6 text-muted-foreground" />}
                  title="No matches"
                  description="Try a different keyword."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => setSearch("")}
                      data-testid="services-clear-search"
                    >
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((s, idx) => (
                    <ServiceCard
                      key={s.id}
                      service={s as any}
                      testId={`services-card-${idx}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
