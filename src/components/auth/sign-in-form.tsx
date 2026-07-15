"use client";

import { useActionState } from "react";

import { signInWithCredentials } from "@/app/(auth)/sign-in/actions";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const [errorMessage, formAction, isPending] = useActionState(signInWithCredentials, undefined);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-card p-5 shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          id="email"
          name="email"
          placeholder="demo@example.com"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          id="password"
          name="password"
          placeholder="change-me"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
