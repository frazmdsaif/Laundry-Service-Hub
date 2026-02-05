import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const customerAccounts = pgTable("customer_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priceInr: integer("price_inr").notNull(),
});

export const beforeAfterItems = pgTable("before_after_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  beforeImageUrl: text("before_image_url").notNull(),
  afterImageUrl: text("after_image_url").notNull(),
});

export const insertCustomerAccountSchema = createInsertSchema(customerAccounts).omit({
  id: true,
  passwordHash: true,
});

export const loginCustomerSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(4),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertBeforeAfterItemSchema = createInsertSchema(beforeAfterItems).omit({
  id: true,
});

export type CustomerAccount = typeof customerAccounts.$inferSelect;
export type InsertCustomerAccount = z.infer<typeof insertCustomerAccountSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type BeforeAfterItem = typeof beforeAfterItems.$inferSelect;
export type InsertBeforeAfterItem = z.infer<typeof insertBeforeAfterItemSchema>;

export type CustomerSignupRequest = InsertCustomerAccount & { password: string };
export type CustomerLoginRequest = z.infer<typeof loginCustomerSchema>;

export type ServicesListResponse = Service[];
export type BeforeAfterListResponse = BeforeAfterItem[];
