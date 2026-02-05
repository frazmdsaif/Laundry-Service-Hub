import { z } from "zod";
import {
  insertBeforeAfterItemSchema,
  insertCustomerAccountSchema,
  insertServiceSchema,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const customerSignupInput = insertCustomerAccountSchema.extend({
  password: z.string().min(4),
});

const customerLoginInput = z.object({
  phone: z.string().min(6),
  password: z.string().min(4),
});

export const api = {
  auth: {
    customerSignup: {
      method: "POST" as const,
      path: "/api/customer/signup",
      input: customerSignupInput,
      responses: {
        201: z.object({ id: z.string(), name: z.string(), phone: z.string() }),
        400: errorSchemas.validation,
      },
    },
    customerLogin: {
      method: "POST" as const,
      path: "/api/customer/login",
      input: customerLoginInput,
      responses: {
        200: z.object({ id: z.string(), name: z.string(), phone: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    customerMe: {
      method: "GET" as const,
      path: "/api/customer/me",
      responses: {
        200: z.object({ id: z.string(), name: z.string(), phone: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    customerLogout: {
      method: "POST" as const,
      path: "/api/customer/logout",
      responses: {
        204: z.void(),
      },
    },
  },
  services: {
    list: {
      method: "GET" as const,
      path: "/api/services",
      responses: {
        200: z.array(
          insertServiceSchema
            .extend({ id: z.string() })
            .pick({ id: true, title: true, description: true, priceInr: true })
        ),
      },
    },
  },
  beforeAfter: {
    list: {
      method: "GET" as const,
      path: "/api/before-after",
      responses: {
        200: z.array(
          insertBeforeAfterItemSchema
            .extend({ id: z.string() })
            .pick({ id: true, title: true, beforeImageUrl: true, afterImageUrl: true })
        ),
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CustomerSignupInput = z.infer<typeof api.auth.customerSignup.input>;
export type CustomerSignupResponse = z.infer<
  typeof api.auth.customerSignup.responses[201]
>;

export type CustomerLoginInput = z.infer<typeof api.auth.customerLogin.input>;
export type CustomerLoginResponse = z.infer<
  typeof api.auth.customerLogin.responses[200]
>;

export type ServiceListResponse = z.infer<typeof api.services.list.responses[200]>;
export type BeforeAfterListResponse = z.infer<
  typeof api.beforeAfter.list.responses[200]
>;
