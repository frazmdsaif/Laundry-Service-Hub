import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type {
  CustomerLoginInput,
  CustomerLoginResponse,
  CustomerSignupInput,
  CustomerSignupResponse,
} from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCustomerMe() {
  return useQuery({
    queryKey: [api.auth.customerMe.path],
    queryFn: async () => {
      const res = await fetch(api.auth.customerMe.path, {
        credentials: "include",
      });

      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch customer session");

      const json = await res.json();
      return parseWithLogging(
        api.auth.customerMe.responses[200],
        json,
        "auth.customerMe",
      );
    },
    retry: false,
  });
}

export function useCustomerSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CustomerSignupInput): Promise<CustomerSignupResponse> => {
      const validated = parseWithLogging(
        api.auth.customerSignup.input,
        input,
        "auth.customerSignup.input",
      );

      const res = await fetch(api.auth.customerSignup.path, {
        method: api.auth.customerSignup.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const err = parseWithLogging(
            api.auth.customerSignup.responses[400],
            errJson,
            "auth.customerSignup.400",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to sign up");
      }

      const json = await res.json();
      return parseWithLogging(
        api.auth.customerSignup.responses[201],
        json,
        "auth.customerSignup.201",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.auth.customerMe.path] });
    },
  });
}

export function useCustomerLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CustomerLoginInput): Promise<CustomerLoginResponse> => {
      const validated = parseWithLogging(
        api.auth.customerLogin.input,
        input,
        "auth.customerLogin.input",
      );

      const res = await fetch(api.auth.customerLogin.path, {
        method: api.auth.customerLogin.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const err = parseWithLogging(
            api.auth.customerLogin.responses[400],
            errJson,
            "auth.customerLogin.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const errJson = await res.json().catch(() => ({}));
          const err = parseWithLogging(
            api.auth.customerLogin.responses[401],
            errJson,
            "auth.customerLogin.401",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to log in");
      }

      const json = await res.json();
      return parseWithLogging(
        api.auth.customerLogin.responses[200],
        json,
        "auth.customerLogin.200",
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.auth.customerMe.path] });
    },
  });
}

export function useCustomerLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const res = await fetch(api.auth.customerLogout.path, {
        method: api.auth.customerLogout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log out");
    },
    onSuccess: async () => {
      qc.setQueryData([api.auth.customerMe.path], null);
      await qc.invalidateQueries({ queryKey: [api.auth.customerMe.path] });
    },
  });
}
