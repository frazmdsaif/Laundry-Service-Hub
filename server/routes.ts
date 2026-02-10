import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";
import { storage } from "./storage";
import crypto from "crypto";

const CUSTOMER_SESSION_KEY = "customer";

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/-/g, "");
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 210000, 32, "sha256").toString("hex");
}

function makePasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = hashPassword(password, salt);
  return `pbkdf2_sha256$${salt}$${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3) return false;
  const [, salt, expected] = parts;
  const derived = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(derived));
}

function getCustomerFromSession(req: any): { id: string; name: string; phone: string } | null {
  const customer = req.session?.[CUSTOMER_SESSION_KEY];
  if (!customer) return null;
  if (!customer.id || !customer.phone || !customer.name) return null;
  return customer;
}

async function seedDatabase(): Promise<void> {
  const existingServices = await storage.listServices();
  if (existingServices.length === 0) {
    await storage.createService({
      title: "Wash & Fold",
      description: "Everyday laundry washed, dried, and neatly folded.",
      priceInr: 99,
    });
    await storage.createService({
      title: "Ironing",
      description: "Crisp ironing for shirts, pants, sarees, and more.",
      priceInr: 25,
    });
    await storage.createService({
      title: "Dry Cleaning",
      description: "Gentle care for delicate and special fabrics.",
      priceInr: 199,
    });
    await storage.createService({
      title: "Express Service",
      description: "Priority processing for urgent orders.",
      priceInr: 149,
    });
  }

  const existingBeforeAfter = await storage.listBeforeAfterItems();
  if (existingBeforeAfter.length === 0) {
    await storage.createBeforeAfterItem({
      title: "Stain removal (white shirt)",
      beforeImageUrl: "https://images.unsplash.com/photo-1520975958225-2ee0f2b5a1aa?auto=format&fit=crop&w=1200&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1520975958225-2ee0f2b5a1aa?auto=format&fit=crop&w=1200&q=80",
    });
    await storage.createBeforeAfterItem({
      title: "Fresh bedding finish",
      beforeImageUrl: "https://images.unsplash.com/photo-1582582429416-6a3fcd8ce5d1?auto=format&fit=crop&w=1200&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1582582429416-6a3fcd8ce5d1?auto=format&fit=crop&w=1200&q=80",
    });
    await storage.createBeforeAfterItem({
      title: "Ironed office wear",
      beforeImageUrl: "https://images.unsplash.com/photo-1520975693415-35a533d6fe98?auto=format&fit=crop&w=1200&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1520975693415-35a533d6fe98?auto=format&fit=crop&w=1200&q=80",
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedDatabase();

  app.post(api.auth.customerSignup.path, async (req: any, res) => {
    try {
      const input = api.auth.customerSignup.input.parse(req.body);
      const phone = normalizePhone(input.phone);

      const existing = await storage.getCustomerAccountByPhone(phone);
      if (existing) {
        return res.status(400).json({
          message: "Phone number already registered",
          field: "phone",
        });
      }

      const passwordHash = makePasswordHash(input.password);
      const created = await storage.createCustomerAccount({
        name: input.name,
        phone,
        passwordHash,
      } as any);

      req.session[CUSTOMER_SESSION_KEY] = {
        id: created.id,
        name: created.name,
        phone: created.phone,
      };

      return res.status(201).json({
        id: created.id,
        name: created.name,
        phone: created.phone,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: String(err.errors[0]?.path?.[0] ?? ""),
        });
      }
      throw err;
    }
  });

  app.post(api.auth.customerLogin.path, async (req: any, res) => {
    try {
      const input = api.auth.customerLogin.input.parse(req.body);
      const phone = normalizePhone(input.phone);

      const account = await storage.getCustomerAccountByPhone(phone);
      if (!account) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      const ok = verifyPassword(input.password, account.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      req.session[CUSTOMER_SESSION_KEY] = {
        id: account.id,
        name: account.name,
        phone: account.phone,
      };

      return res.json({ id: account.id, name: account.name, phone: account.phone });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: String(err.errors[0]?.path?.[0] ?? ""),
        });
      }
      throw err;
    }
  });

  app.get(api.auth.customerMe.path, async (req: any, res) => {
    const customer = getCustomerFromSession(req);
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json(customer);
  });

  app.post(api.auth.customerLogout.path, async (req: any, res) => {
    if (req.session) {
      req.session[CUSTOMER_SESSION_KEY] = null;
    }
    return res.status(204).send();
  });

  app.get(api.services.list.path, async (req, res) => {
    const items = await storage.listServices();
    return res.json(items);
  });

  app.get(api.beforeAfter.list.path, async (req, res) => {
    const items = await storage.listBeforeAfterItems();
    return res.json(items);
  });

  app.post(api.bookings.create.path, async (req: any, res) => {
    const customer = getCustomerFromSession(req);
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking({
        ...input,
        customerId: customer.id,
      });
      return res.status(201).json({ id: booking.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: String(err.errors[0]?.path?.[0] ?? ""),
        });
      }
      throw err;
    }
  });

  app.get(api.bookings.list.path, async (req: any, res) => {
    const customer = getCustomerFromSession(req);
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const items = await storage.listBookings(customer.id);
    return res.json(items);
  });

  return httpServer;
}
