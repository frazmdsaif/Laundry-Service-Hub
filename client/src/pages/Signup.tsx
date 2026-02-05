import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCustomerMe, useCustomerSignup } from "@/hooks/use-customer-auth";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Lock, Phone, User2 } from "lucide-react";

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").slice(0, 20);
}

export default function SignupPage() {
  const { data: me, isLoading: meLoading } = useCustomerMe();
  const signup = useCustomerSignup();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      phone.trim().length >= 6 &&
      password.trim().length >= 4 &&
      !signup.isPending
    );
  }, [name, password, phone, signup.isPending]);

  useEffect(() => {
    if (!meLoading && me) {
      window.location.href = "/account";
    }
  }, [me, meLoading]);

  return (
    <>
      <Seo
        title="Sign up — Laundrè"
        description="Create your laundry account in seconds — no OTP required."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="glass rounded-3xl p-6 sm:p-8 shadow-premium">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  No OTP. No hassle.
                </div>
                <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.05]">
                  Create your account
                </h1>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Save your phone number for quick logins and keep your laundry
                  preferences ready for next time.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Privacy-first</div>
                    <div className="mt-1 text-sm font-semibold">
                      We use secure sessions (cookies), not OTP spam.
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Simple</div>
                    <div className="mt-1 text-sm font-semibold">
                      Name + phone + password. Done.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Card className="rounded-3xl border bg-card/70 backdrop-blur shadow-premium">
                <div className="p-6 sm:p-10">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                        Sign up
                      </div>
                      <div className="mt-2 font-display text-2xl sm:text-3xl">
                        Welcome to Laundrè
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="signup-to-login"
                    >
                      Already have an account?
                    </Link>
                  </div>

                  <form
                    className="mt-8 grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      signup.mutate(
                        { name: name.trim(), phone: phone.trim(), password },
                        {
                          onSuccess: () => {
                            toast({
                              title: "Account created",
                              description: "You’re signed in.",
                            });
                            window.location.href = "/account";
                          },
                          onError: (err) => {
                            toast({
                              title: "Signup failed",
                              description: String(err.message || err),
                              variant: "destructive",
                            });
                          },
                        },
                      );
                    }}
                  >
                    <label className="grid gap-2" data-testid="signup-name-wrap">
                      <span className="text-sm font-semibold">Name</span>
                      <div className="relative">
                        <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="pl-9 rounded-xl"
                          data-testid="signup-name"
                          autoComplete="name"
                        />
                      </div>
                    </label>

                    <label className="grid gap-2" data-testid="signup-phone-wrap">
                      <span className="text-sm font-semibold">Phone</span>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(normalizePhone(e.target.value))}
                          placeholder="+91 98xxxxxx"
                          className="pl-9 rounded-xl"
                          data-testid="signup-phone"
                          inputMode="tel"
                          autoComplete="tel"
                        />
                      </div>
                    </label>

                    <label className="grid gap-2" data-testid="signup-password-wrap">
                      <span className="text-sm font-semibold">Password</span>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 4 characters"
                          className="pl-9 rounded-xl"
                          data-testid="signup-password"
                          type="password"
                          autoComplete="new-password"
                        />
                      </div>
                    </label>

                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      data-testid="signup-submit"
                      className="mt-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      {signup.isPending ? "Creating…" : "Create account"}
                    </Button>

                    <div className="text-xs text-muted-foreground leading-relaxed">
                      By creating an account, you agree to our{" "}
                      <button
                        type="button"
                        className="font-semibold text-foreground/80 hover:text-foreground underline underline-offset-4"
                        onClick={() =>
                          toast({
                            title: "Terms",
                            description:
                              "Hook this up to your Terms page when available.",
                          })
                        }
                        data-testid="signup-terms"
                      >
                        Terms
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="font-semibold text-foreground/80 hover:text-foreground underline underline-offset-4"
                        onClick={() =>
                          toast({
                            title: "Privacy",
                            description:
                              "Hook this up to your Privacy page when available.",
                          })
                        }
                        data-testid="signup-privacy"
                      >
                        Privacy Policy
                      </button>
                      .
                    </div>
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
