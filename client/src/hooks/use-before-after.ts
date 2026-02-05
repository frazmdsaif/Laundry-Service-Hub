import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { BeforeAfterListResponse } from "@shared/routes";
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

export function useBeforeAfterItems() {
  return useQuery<BeforeAfterListResponse>({
    queryKey: [api.beforeAfter.list.path],
    queryFn: async () => {
      const res = await fetch(api.beforeAfter.list.path, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch before/after items");
      const json = await res.json();
      return parseWithLogging(
        api.beforeAfter.list.responses[200],
        json,
        "beforeAfter.list",
      );
    },
  });
}
