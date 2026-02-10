import Seo from "@/components/Seo";
import Shell from "@/components/Shell";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCustomerMe } from "@/hooks/use-customer-auth";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, MapPin, Sparkles, Timer } from "lucide-react";
import { useServices } from "@/hooks/use-services";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export default function BookingPage() {
  const { data: me, isLoading: meLoading } = useCustomerMe();
  const { toast } = useToast();
  const services = useServices();

  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("serviceId") || "";

  const selectedService = useMemo(() => {
    if (!serviceId) return null;
    return (services.data ?? []).find((s) => s.id === serviceId) ?? null;
  }, [serviceId, services.data]);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");

  const createBooking = useMutation({
    mutationFn: async () => {
      const payload = parseWithLogging(
        api.bookings.create.input,
        { bookingDate, bookingTime, address, landmark, city },
        "bookings.create.input",
      );

      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const err = parseWithLogging(
            api.bookings.create.responses[400],
            errJson,
            "bookings.create.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const errJson = await res.json().catch(() => ({}));
          const err = parseWithLogging(
            api.bookings.create.responses[401],
            errJson,
            "bookings.create.401",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to create booking");
      }

      const json = await res.json();
      return parseWithLogging(api.bookings.create.responses[201], json, "bookings.create.201");
    },
  });

  const canSubmit = useMemo(() => {
    return (
      bookingDate.trim().length > 0 &&
      bookingTime.trim().length > 0 &&
      address.trim().length >= 8 &&
      city.trim().length >= 2 &&
      !createBooking.isPending
    );
  }, [address, bookingDate, bookingTime, city, createBooking.isPending]);

  if (!meLoading && !me) {
    const next = `${window.location.pathname}${window.location.search}`;
    return (
      <>
        <Seo
          title="Book a slot — Laundrè"
          description="Pick a convenient slot and share your address to book."
        />
        <TopNav />
        <Shell>
          <div className="page-enter pt-6 sm:pt-10 pb-14">
            <Card className="rounded-3xl border bg-card/70 backdrop-blur shadow-premium">
              <div className="p-6 sm:p-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                  Login required
                </div>
                <h1 className="mt-4 font-display text-2xl sm:text-3xl">
                  Please log in to book a slot.
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  We’ll keep your booking tied to your account.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <Link
                    href={`/login?next=${encodeURIComponent(next)}`}
                    className="inline-flex"
                  >
                    <Button className="rounded-xl">Log in</Button>
                  </Link>
                  <Link
                    href={`/signup?next=${encodeURIComponent(next)}`}
                    className="inline-flex"
                  >
                    <Button variant="secondary" className="rounded-xl">
                      Create account
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Shell>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Book a slot — Laundrè"
        description="Pick a convenient slot and share your address to book."
      />
      <TopNav />
      <Shell>
        <div className="page-enter pt-6 sm:pt-10 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="glass rounded-3xl p-6 sm:p-8 shadow-premium">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  Book your slot
                </div>
                <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.05]">
                  Choose date, time, and address.
                </h1>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We’ll confirm pickup details once your request is submitted.
                </p>

                {selectedService ? (
                  <div className="mt-6 rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Selected service
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {selectedService.title}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Reliable</div>
                    <div className="mt-1 text-sm font-semibold">
                      Same-day pickup slots in select areas.
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-background/60 px-4 py-3">
                    <div className="text-xs font-semibold text-muted-foreground">Flexible</div>
                    <div className="mt-1 text-sm font-semibold">
                      Choose a time that fits your routine.
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
                        Booking
                      </div>
                      <div className="mt-2 font-display text-2xl sm:text-3xl">
                        Pickup details
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Signed in as <span className="font-semibold">{me?.name}</span>
                    </div>
                  </div>

                  <form
                    className="mt-8 grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      createBooking.mutate(undefined, {
                        onSuccess: () => {
                          toast({
                            title: "Booking requested",
                            description: "We’ll confirm your pickup slot shortly.",
                          });
                          setBookingDate("");
                          setBookingTime("");
                          setAddress("");
                          setLandmark("");
                          setCity("");
                        },
                        onError: (err) => {
                          toast({
                            title: "Booking failed",
                            description: String((err as Error).message || err),
                            variant: "destructive",
                          });
                        },
                      });
                    }}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold">Date</span>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            type="date"
                            className="pl-9 rounded-xl"
                            data-testid="booking-date"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold">Time</span>
                        <div className="relative">
                          <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            type="time"
                            className="pl-9 rounded-xl"
                            data-testid="booking-time"
                          />
                        </div>
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold">Address</span>
                      <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Flat, Street, Area"
                        className="rounded-xl min-h-[96px]"
                        data-testid="booking-address"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold">Landmark (optional)</span>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="Near..."
                            className="pl-9 rounded-xl"
                            data-testid="booking-landmark"
                          />
                        </div>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-semibold">City</span>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="rounded-xl"
                          data-testid="booking-city"
                        />
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="mt-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                      data-testid="booking-submit"
                    >
                      {createBooking.isPending ? "Booking…" : "Confirm booking"}
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
