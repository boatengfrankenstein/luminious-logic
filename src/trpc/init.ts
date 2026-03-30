// src/trpc/init.ts
import { db } from "@/db";
import { cache } from "react";
import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { getSession } from "@/modules/auth/lib/get-session";

export const createTRPCContext = cache(async () => {
  // Fetch session here so it's available during SSR and API calls
  const session = await getSession();
  return { 
    db,
    session 
  };
});

// Update the Context type to include the session
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    // Now we just check the session already in context
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next({
      ctx: {
        ...ctx,
        auth: ctx.session.user,
      },
    });
  }
);