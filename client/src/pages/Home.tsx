import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useServices } from "@/hooks/use-services";
import { useBeforeAfterItems } from "@/hooks/use-before-after";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shirt, Sparkles, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const services = useServices();
  const ba = useBeforeAfterItems();

  return (
    <>
      <Seo
        title="Laundrè — Premium Laundry Service"
        description="Premium laundry care with transparent pricing, quick turnaround, and satisfying before/after results."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border bg-card/70 backdrop-blur shadow-premium">
            <div className="absolute inset-0">
              <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/18 blur-3xl floaty" />
              <div
                className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/18 blur-3xl"
                style={{ animationDelay: "800ms" }}
              />
            </div>

            <div className="relative p-6 sm:p-10 lg:p-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                  Clean minimal. Premium results.
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-6xl leading-[1.02] font-display">
                  Laundry that looks freshly bought — every time.
                </h1>

                <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  Thoughtful care for everyday essentials and special pieces. Pick a service,
                  schedule pickup, and enjoy crisp, clean results.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link
                    href="/services"
                    data-testid="home-cta-services"
                    className="inline-flex"
                  >
                    <Button
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      Explore services
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  <Link
                    href="/before-after"
                    data-testid="home-cta-before-after"
                    className="inline-flex"
                  >
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      See before/after
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Turnaround</div>
                    <div className="mt-1 font-semibold">24–48 hours</div>
                  </div>
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Care</div>
                    <div className="mt-1 font-semibold">Fabric-safe</div>
                  </div>
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Support</div>
                    <div className="mt-1 font-semibold">WhatsApp-ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-10 sm:mt-14">
            <SectionHeading
              kicker="Services"
              title="Simple pricing. Premium finishes."
              subtitle="Choose the service that matches your fabric and lifestyle. Clear rates, careful handling, beautiful results."
              right={
                <Link
                  href="/services"
                  data-testid="home-services-viewall"
                  className="hidden sm:inline-flex"
                >
                  <Button variant="secondary" className="rounded-xl">
                    View all
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              }
              testId="home-services-heading"
            />

            <div className="mt-5">
              {services.isLoading ? (
                <LoadingState testId="home-services-loading" />
              ) : services.isError ? (
                <EmptyState
                  testId="home-services-error"
                  icon={<Shirt className="h-6 w-6 text-muted-foreground" />}
                  title="Couldn’t load services"
                  description="Please try again in a moment."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => services.refetch()}
                      data-testid="home-services-retry"
                    >
                      Retry
                    </Button>
                  }
                />
              ) : (services.data?.length ?? 0) === 0 ? (
                <EmptyState
                  testId="home-services-empty"
                  icon={<Shirt className="h-6 w-6 text-muted-foreground" />}
                  title="No services yet"
                  description="Once services are added on the backend, they’ll show up here."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.data!.slice(0, 6).map((s, idx) => (
                    <ServiceCard
                      key={s.id}
                      service={s as any}
                      testId={`home-service-${idx}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Before/After */}
          <div className="mt-10 sm:mt-14">
            <SectionHeading
              kicker="Results"
              title="Before & After gallery"
              subtitle="A quick look at real transformations — stains lifted, whites brighter, colors revived."
              right={
                <Link
                  href="/before-after"
                  data-testid="home-beforeafter-viewall"
                  className="hidden sm:inline-flex"
                >
                  <Button variant="secondary" className="rounded-xl">
                    View gallery
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              }
              testId="home-beforeafter-heading"
            />

            <div className="mt-5">
              {ba.isLoading ? (
                <LoadingState testId="home-beforeafter-loading" />
              ) : ba.isError ? (
                <EmptyState
                  testId="home-beforeafter-error"
                  icon={<ImageIcon className="h-6 w-6 text-muted-foreground" />}
                  title="Couldn’t load gallery"
                  description="Please try again in a moment."
                  action={
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => ba.refetch()}
                      data-testid="home-beforeafter-retry"
                    >
                      Retry
                    </Button>
                  }
                />
              ) : (ba.data?.length ?? 0) === 0 ? (
                <EmptyState
                  testId="home-beforeafter-empty"
                  icon={<ImageIcon className="h-6 w-6 text-muted-foreground" />}
                  title="No transformations yet"
                  description="Once before/after items are added on the backend, they’ll show here."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ba.data!.slice(0, 6).map((it, idx) => (
                    <BeforeAfterCard
                      key={it.id}
                      item={it as any}
                      testId={`home-beforeafter-${idx}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 sm:mt-14 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-10 shadow-premium">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Ready when you are
                </div>
                <div className="mt-2 font-display text-2xl sm:text-3xl">
                  Create an account to save preferences & get faster checkouts.
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  No OTP. Just your name, phone number, and a password.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup" data-testid="home-cta-signup" className="inline-flex">
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                    Sign up
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login" data-testid="home-cta-login" className="inline-flex">
                  <Button variant="secondary" className="rounded-xl">
                    Log in
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <footer className="mt-12 pb-2 flex flex-col items-center gap-3 text-center text-xs text-muted-foreground">
            <a
              href="https://wa.me/917004534354"
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="secondary" className="rounded-xl">
                Support on WhatsApp +91 70045 34354
              </Button>
            </a>
            <span>
              <span className="font-semibold text-foreground/80">Laundrè</span> — premium laundry care
            </span>
          </footer>
        </div>
      </Shell>
    </>
  );
}
