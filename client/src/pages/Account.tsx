import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomerLogout, useCustomerMe } from "@/hooks/use-customer-auth";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, LogOut, ShieldCheck, User2 } from "lucide-react";
import { Link } from "wouter";

export default function AccountPage() {
  const me = useCustomerMe();
  const logout = useCustomerLogout();
  const { toast } = useToast();

  return (
    <>
      <Seo title="Account — Laundrè" description="Manage your customer account." />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          {me.isLoading ? (
            <LoadingState variant="page" testId="account-loading" />
          ) : me.isError ? (
            <EmptyState
              testId="account-error"
              icon={<User2 className="h-6 w-6 text-muted-foreground" />}
              title="Couldn’t load account"
              description="Please try again."
              action={
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => me.refetch()}
                  data-testid="account-retry"
                >
                  Retry
                </Button>
              }
            />
          ) : !me.data ? (
            <EmptyState
              testId="account-loggedout"
              icon={<ShieldCheck className="h-6 w-6 text-muted-foreground" />}
              title="You’re not logged in"
              description="Log in to view your account details."
              action={
                <Link href="/login" className="inline-flex" data-testid="account-login-link">
                  <Button className="rounded-xl">
                    Log in
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              <div className="lg:col-span-5">
                <div className="glass rounded-3xl p-6 sm:p-8 shadow-premium">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Signed in securely
                  </div>
                  <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.05]">
                    Your account
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Keep your info handy for faster checkouts and a smoother pickup experience.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border bg-background/60 px-4 py-3">
                      <div className="text-xs font-semibold text-muted-foreground">
                        Name
                      </div>
                      <div className="mt-1 text-sm font-semibold" data-testid="account-name">
                        {me.data.name}
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-background/60 px-4 py-3">
                      <div className="text-xs font-semibold text-muted-foreground">
                        Phone
                      </div>
                      <div className="mt-1 text-sm font-semibold" data-testid="account-phone">
                        {me.data.phone}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      logout.mutate(undefined, {
                        onSuccess: () => {
                          toast({ title: "Logged out", description: "See you soon." });
                          window.location.href = "/";
                        },
                        onError: (err) =>
                          toast({
                            title: "Logout failed",
                            description: String(err.message || err),
                            variant: "destructive",
                          }),
                      })
                    }
                    disabled={logout.isPending}
                    data-testid="account-logout"
                    className="mt-6 w-full rounded-xl bg-gradient-to-r from-foreground to-foreground/85 text-background shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logout.isPending ? "Logging out…" : "Logout"}
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <Card className="rounded-3xl border bg-card/70 backdrop-blur shadow-premium">
                  <div className="p-6 sm:p-10">
                    <div className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      Next steps
                    </div>
                    <div className="mt-2 font-display text-2xl sm:text-3xl">
                      What would you like to do?
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Explore services or browse results — booking flow can be connected when ready.
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/services" className="block" data-testid="account-go-services">
                        <div className="group rounded-2xl border bg-background/60 p-5 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                          <div className="font-display text-xl">Services</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Pricing + premium care options.
                          </div>
                          <div className="mt-4 inline-flex items-center text-sm font-semibold">
                            Explore
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/before-after"
                        className="block"
                        data-testid="account-go-beforeafter"
                      >
                        <div className="group rounded-2xl border bg-background/60 p-5 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                          <div className="font-display text-xl">Before & After</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Quick visual transformations.
                          </div>
                          <div className="mt-4 inline-flex items-center text-sm font-semibold">
                            View gallery
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/bookings"
                        className="block"
                        data-testid="account-go-bookings"
                      >
                        <div className="group rounded-2xl border bg-background/60 p-5 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                          <div className="font-display text-xl">My bookings</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Track pickup details and status.
                          </div>
                          <div className="mt-4 inline-flex items-center text-sm font-semibold">
                            View bookings
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="mt-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-5">
                      <div className="text-sm font-semibold">
                        Need a pickup?
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Book a fresh slot and share your pickup address.
                      </p>
                      <Link href="/book" className="inline-flex mt-4">
                        <Button
                          variant="secondary"
                          className="rounded-xl"
                          data-testid="account-booking-info"
                        >
                          Book a slot
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Shell>
    </>
  );
}
