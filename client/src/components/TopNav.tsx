import { Link, useLocation } from "wouter";
import { Droplets, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCustomerLogout, useCustomerMe } from "@/hooks/use-customer-auth";
import { useToast } from "@/hooks/use-toast";

function NavLink({
  href,
  children,
  testId,
}: {
  href: string;
  children: React.ReactNode;
  testId: string;
}) {
  const [loc] = useLocation();
  const active = loc === href;

  return (
    <Link
      href={href}
      data-testid={testId}
      className={cn(
        "rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200",
        "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        active && "text-foreground bg-foreground/5",
      )}
    >
      {children}
    </Link>
  );
}

export default function TopNav() {
  const { data: me } = useCustomerMe();
  const logout = useCustomerLogout();
  const { toast } = useToast();

  return (
    <div className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass shadow-premium rounded-2xl px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              data-testid="nav-brand"
              className="group flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-foreground/5"
            >
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/18 to-accent/22 border border-border">
                <Droplets className="h-4 w-4 text-primary" />
                {/* <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-foreground shadow">
                  <Sparkles className="h-3 w-3" />
                </span> */}
              </span>
              <div className="leading-tight">
                <div className="font-display text-base sm:text-lg">
                  Laundrè
                </div>
                <div className="text-[11px] text-muted-foreground -mt-0.5">
                  premium laundry care
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/services" testId="nav-services">
                Services
              </NavLink>
              <NavLink href="/before-after" testId="nav-before-after">
                Before & After
              </NavLink>
              <NavLink href="/account" testId="nav-account">
                Account
              </NavLink>
            </div>

            <div className="flex items-center gap-2">
              {me ? (
                <>
                  <div className="hidden sm:block text-right mr-2">
                    <div className="text-sm font-semibold leading-tight">
                      {me.name}
                    </div>
                    <div className="text-xs text-muted-foreground -mt-0.5">
                      {me.phone}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => (window.location.href = "/account")}
                    data-testid="nav-account-cta"
                    className="hidden sm:inline-flex rounded-xl"
                  >
                    Account
                  </Button>
                  <Button
                    onClick={() =>
                      logout.mutate(undefined, {
                        onSuccess: () => {
                          toast({
                            title: "Logged out",
                            description: "See you soon.",
                          });
                          window.location.href = "/";
                        },
                        onError: (e) =>
                          toast({
                            title: "Logout failed",
                            description: String(e.message || e),
                            variant: "destructive",
                          }),
                      })
                    }
                    disabled={logout.isPending}
                    data-testid="nav-logout"
                    className="rounded-xl bg-gradient-to-r from-foreground to-foreground/85 text-background shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    {logout.isPending ? "Logging out…" : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    data-testid="nav-login"
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    data-testid="nav-signup"
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-semibold",
                      "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5",
                      "active:translate-y-0 transition-all duration-200",
                    )}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 flex md:hidden items-center gap-1 overflow-x-auto no-scrollbar">
            <NavLink href="/services" testId="nav-services-mobile">
              Services
            </NavLink>
            <NavLink href="/before-after" testId="nav-before-after-mobile">
              Before & After
            </NavLink>
            <NavLink href="/account" testId="nav-account-mobile">
              Account
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
