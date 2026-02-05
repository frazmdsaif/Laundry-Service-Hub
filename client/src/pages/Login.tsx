import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCustomerLogin, useCustomerMe } from "@/hooks/use-customer-auth";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, Phone, Sparkles } from "lucide-react";

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").slice(0, 20);
}

export default function LoginPage() {
  const { data: me, isLoading: meLoading } = useCustomerMe();
  const login = useCustomerLogin();
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return phone.trim().length >= 6 && password.trim().length >= 4 && !login.isPending;
  }, [login.isPending, password, phone]);

  useEffect(() => {
    if (!meLoading && me) {
      window.location.href = "/account";
    }
  }, [me, meLoading]);

  return (
    <>
      <Seo
        title="Log in — Laundrè"
        description="Log in with your phone number and password."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="glass rounded-3xl p-6 sm:p-8 shadow-premium">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                  Welcome back
                </div>
                <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.05]">
                  Log in, then pick a service.
                </h1>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Use your phone number and password. We’ll keep you signed in with a secure session.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Card className="rounded-3xl border bg-card/70 backdrop-blur shadow-premium">
                <div className="p-6 sm:p-10">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                        Login
                      </div>
                      <div className="mt-2 font-display text-2xl sm:text-3xl">
                        Customer login
                      </div>
                    </div>
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="login-to-signup"
                    >
                      New here?
                    </Link>
                  </div>

                  <form
                    className="mt-8 grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      login.mutate(
                        { phone: phone.trim(), password },
                        {
                          onSuccess: () => {
                            toast({
                              title: "Logged in",
                              description: "Welcome back.",
                            });
                            window.location.href = "/account";
                          },
                          onError: (err) => {
                            toast({
                              title: "Login failed",
                              description: String(err.message || err),
                              variant: "destructive",
                            });
                          },
                        },
                      );
                    }}
                  >
                    <label className="grid gap-2" data-testid="login-phone-wrap">
                      <span className="text-sm font-semibold">Phone</span>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(normalizePhone(e.target.value))}
                          placeholder="+91 98xxxxxx"
                          className="pl-9 rounded-xl"
                          data-testid="login-phone"
                          inputMode="tel"
                          autoComplete="tel"
                        />
                      </div>
                    </label>

                    <label className="grid gap-2" data-testid="login-password-wrap">
                      <span className="text-sm font-semibold">Password</span>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          className="pl-9 rounded-xl"
                          data-testid="login-password"
                          type="password"
                          autoComplete="current-password"
                        />
                      </div>
                    </label>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                        onClick={() =>
                          toast({
                            title: "Forgot password",
                            description:
                              "Connect a password reset flow when the backend supports it.",
                          })
                        }
                        data-testid="login-forgot"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      data-testid="login-submit"
                      className="mt-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      {login.isPending ? "Logging in…" : "Log in"}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
