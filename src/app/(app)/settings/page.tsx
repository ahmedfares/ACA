import { Download, LockKeyhole, Settings, ShieldCheck, Trash2 } from "lucide-react";

const controls = [
  {
    description: "Week 8 uses signed-in workspace data only. Use tester data until hosted privacy controls are enabled.",
    icon: LockKeyhole,
    status: "Active guidance",
    title: "Privacy posture",
  },
  {
    description: "CSV export is planned with application tracking, after scored jobs and statuses exist.",
    icon: Download,
    status: "Planned Week 15",
    title: "Export my data",
  },
  {
    description: "Account deletion and record deletion controls are required before broader alpha access.",
    icon: Trash2,
    status: "Before broader alpha",
    title: "Delete my data",
  },
  {
    description: "Each tester should use a distinct account so profile, resume, and job records stay isolated.",
    icon: ShieldCheck,
    status: "Hosted setup",
    title: "Tester isolation",
  },
];

export default function SettingsPage() {
  return (
    <section>
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
          <Settings className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-primary">Trust center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Settings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Week 8 keeps the account surface honest: privacy, export, deletion, and tester isolation are visible even
            where full controls are scheduled for later Phase 1 slices.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {controls.map((control) => {
          const Icon = control.icon;

          return (
            <article className="rounded-lg border bg-card p-5 shadow-sm" key={control.title}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-base font-semibold tracking-normal">{control.title}</h2>
                </div>
                <span className="shrink-0 rounded-md border bg-background px-2 py-1 text-xs font-semibold text-primary">
                  {control.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{control.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
