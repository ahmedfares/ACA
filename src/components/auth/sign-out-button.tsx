"use client";

import { Button } from "@/components/ui/button";
import { signOutCurrentUser } from "@/components/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutCurrentUser}>
      <Button size="sm" variant="outline" type="submit">
        Sign out
      </Button>
    </form>
  );
}
