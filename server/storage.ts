import {
  beforeAfterItems,
  customerAccounts,
  services,
  bookings,
  type BeforeAfterItem,
  type CustomerAccount,
  type CustomerLoginRequest,
  type CustomerSignupRequest,
  type InsertBeforeAfterItem,
  type InsertService,
  type Service,
  type Booking,
  type InsertBooking,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  createCustomerAccount(input: CustomerSignupRequest): Promise<CustomerAccount>;
  getCustomerAccountByPhone(phone: string): Promise<CustomerAccount | undefined>;

  listServices(): Promise<Service[]>;
  createService(input: InsertService): Promise<Service>;

  listBeforeAfterItems(): Promise<BeforeAfterItem[]>;
  createBeforeAfterItem(input: InsertBeforeAfterItem): Promise<BeforeAfterItem>;

  createBooking(input: InsertBooking): Promise<Booking>;
  listBookings(customerId: string): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  async createCustomerAccount(input: CustomerSignupRequest): Promise<CustomerAccount> {
    const [created] = await db
      .insert(customerAccounts)
      .values({
        name: input.name,
        phone: input.phone,
        passwordHash: input.passwordHash,
      })
      .returning();
    return created;
  }

  async getCustomerAccountByPhone(
    phone: string,
  ): Promise<CustomerAccount | undefined> {
    const [found] = await db
      .select()
      .from(customerAccounts)
      .where(eq(customerAccounts.phone, phone));
    return found ?? undefined;
  }

  async listServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async createService(input: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(input).returning();
    return created;
  }

  async listBeforeAfterItems(): Promise<BeforeAfterItem[]> {
    return await db.select().from(beforeAfterItems);
  }

  async createBeforeAfterItem(input: InsertBeforeAfterItem): Promise<BeforeAfterItem> {
    const [created] = await db.insert(beforeAfterItems).values(input).returning();
    return created;
  }

  async createBooking(input: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(input).returning();
    return created;
  }

  async listBookings(customerId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customerId));
  }
}

export const storage = new DatabaseStorage();
