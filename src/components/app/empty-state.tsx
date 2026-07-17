import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction?: {
    href: string;
    label: string;
  };
  status?: string;
};

export function EmptyState({ title, description, icon: Icon, primaryAction, status }: EmptyStateProps) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        {status ? (
          <span className="w-fit rounded-md border bg-background px-3 py-2 text-xs font-medium text-primary">
            {status}
          </span>
        ) : null}
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-normal">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      {primaryAction ? (
        <Button asChild className="mt-5">
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
