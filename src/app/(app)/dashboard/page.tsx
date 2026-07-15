export default function DashboardPage() {
  return (
    <section>
      <p className="text-sm font-medium text-primary">Week 2 foundation</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Authentication and the database foundation are now in place. Profile, resume, and job
        workflows begin in the next weekly slices.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Profile", "Coming in Week 4"],
          ["Resume", "Coming in Week 6"],
          ["Jobs", "Coming in Week 7"],
        ].map(([title, status]) => (
          <div key={title} className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
