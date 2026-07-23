import {
  BriefcaseBusiness,
  ClipboardList,
  FileCheck2,
  FileQuestion,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const appNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/top-matches", label: "Top Matches", icon: Sparkles },
  { href: "/review", label: "Review Queue", icon: ClipboardList },
  { href: "/question-bank", label: "Question Bank", icon: FileQuestion },
  { href: "/applications", label: "Applications", icon: FileCheck2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppNavProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function AppNav({ className, orientation = "vertical" }: AppNavProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        orientation === "horizontal" ? "flex gap-2 overflow-x-auto pb-1" : "space-y-1",
        className,
      )}
    >
      {appNavItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            className={cn(
              "inline-flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              orientation === "horizontal" ? "shrink-0 border bg-card" : "w-full",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
