import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import SectionHeading from "@/components/SectionHeading";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import { useBeforeAfterItems } from "@/hooks/use-before-after";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export default function BeforeAfterPage() {
  const q = useBeforeAfterItems();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const items = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => it.title.toLowerCase().includes(s));
  }, [q.data, search]);

  return (
    <>
      <Seo
        title="Before & After — Laundrè"
        description="See transformations: stains lifted, whites brighter, colors revived."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="glass rounded-3xl p-6 sm:p-10 shadow-premium">
            <SectionHeading
              kicker="Gallery"
              title="Before & After"
              subtitle="A visual proof of care — tap a card to compare before/after."
              testId="beforeafter-heading"
              right={
                <div className="hidden md:block relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search items…"
                    className="pl-9 w-72 rounded-xl"
                    data-testid="beforeafter-search"
                  />
                </div>
              }
            />

            <div className="mt-4 md:hidden relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items…"
                className="pl-9 rounded-xl"
                data-testid="beforeafter-search-mobile"
              />
            </div>

            <div className="mt-6">
              {q.isLoading ? (
                <LoadingState testId="beforeafter-loading" />
              ) : q.isError ? (
                <EmptyState
                  testId="beforeafter-error"
                  icon={<ImageIcon className="h-6 w-6 text-muted-foreground" />}
                  title="Couldn’t load gallery"
                  description="Please try again."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => q.refetch()}
                      data-testid="beforeafter-retry"
                    >
                      Retry
                    </Button>
                  }
                />
              ) : (q.data?.length ?? 0) === 0 ? (
                <EmptyState
                  testId="beforeafter-empty"
                  icon={<ImageIcon className="h-6 w-6 text-muted-foreground" />}
                  title="No items yet"
                  description="Add before/after items on the backend to populate this gallery."
                />
              ) : filtered.length === 0 ? (
                <EmptyState
                  testId="beforeafter-noresults"
                  icon={<Search className="h-6 w-6 text-muted-foreground" />}
                  title="No matches"
                  description="Try another keyword."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => setSearch("")}
                      data-testid="beforeafter-clear-search"
                    >
                      Clear search
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((it, idx) => (
                    <BeforeAfterCard
                      key={it.id}
                      item={it as any}
                      testId={`beforeafter-card-${idx}`}
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
