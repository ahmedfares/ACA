import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-normal">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </section>
  );
}
