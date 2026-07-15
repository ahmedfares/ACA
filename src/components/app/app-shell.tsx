import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppNav } from "@/components/app/app-nav";

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link className="text-lg font-semibold tracking-normal" href="/dashboard">
            ACA
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            {userEmail ? (
              <span className="hidden max-w-64 truncate text-sm text-muted-foreground sm:inline">
                {userEmail}
              </span>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-6">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AppNav />
          </div>
        </aside>

        <div className="min-w-0">
          <AppNav className="mb-5 lg:hidden" orientation="horizontal" />
          {children}
        </div>
      </div>
    </main>
  );
}
