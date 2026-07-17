"use client";

import type { ReactNode } from "react";
import { useActionState, useMemo, useState } from "react";
import { Check, CheckCircle2, Flame, MousePointerClick, Sparkles, Target, Trophy, Zap } from "lucide-react";

import { saveProfileForm, type ProfileFormState } from "@/features/profile/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProfileFormDefaults = {
  currentTitle?: string;
  dealBreakers?: string;
  desiredCompensation?: string;
  employmentTypes?: string;
  excludedCompanies?: string;
  industries?: string;
  instructions?: string;
  leadership?: string;
  minCompensation?: string;
  preferredLocations?: string;
  preferredSkills?: string;
  preferredTitles?: string;
  relocation?: string;
  remotePreference?: string;
  skills?: string;
  sponsorship?: string;
  summary?: string;
  targetCompanies?: string;
  travel?: string;
  workAuthorization?: string;
  yearsExperience?: string;
};

type ProfileFormProps = {
  databaseConfigured: boolean;
  defaults: ProfileFormDefaults;
  mode?: "onboarding" | "profile";
};

type ProfileFormValues = Required<ProfileFormDefaults>;

type SuggestionPreset = {
  description: string;
  label: string;
  points: number;
  values: Partial<ProfileFormValues>;
};

const titleOptions = [
  "Software Engineer",
  "Senior Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Staff Software Engineer",
  "Engineering Manager",
  "Solutions Architect",
  "Product Manager",
  "Data Engineer",
  "AI Engineer",
];

const industryOptions = [
  "Software",
  "AI",
  "Cloud",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "Enterprise SaaS",
  "Cybersecurity",
  "Education",
  "Government",
];

const preferredTitleOptions = [
  "Senior Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Staff Software Engineer",
  "Backend Engineer",
  "Full-stack Engineer",
  "Platform Engineer",
  "Engineering Manager",
  "Solutions Architect",
  "AI Engineer",
];

const locationOptions = [
  "Remote US",
  "Remote global",
  "Atlanta hybrid",
  "New York hybrid",
  "San Francisco Bay Area",
  "Austin hybrid",
  "Seattle hybrid",
  "Open to relocation",
];

const employmentTypeOptions = ["Full-time", "Direct hire", "Contract", "Contract-to-hire", "Part-time"];

const dealBreakerOptions = [
  "C2C",
  "Unpaid take-home",
  "Required relocation",
  "On-site 5 days",
  "No sponsorship",
  "Below compensation floor",
  "Commission-only",
];

const skillSuggestions = [
  "Java | Backend | Advanced | 10",
  "Spring Boot | Backend | Advanced | 8",
  "React | Frontend | Advanced | 6",
  "TypeScript | Frontend | Advanced | 5",
  "PostgreSQL | Database | Advanced | 7",
  "AWS | Cloud | Advanced | 6",
  "System Design | Architecture | Advanced | 8",
  "Docker | DevOps | Intermediate | 5",
  "Python | AI/Data | Intermediate | 4",
  "Prompt Engineering | AI | Intermediate | 2",
];

const compensationOptions = [
  { label: "Not sure yet", value: "" },
  { label: "$100k", value: "100000" },
  { label: "$120k", value: "120000" },
  { label: "$140k", value: "140000" },
  { label: "$160k", value: "160000" },
  { label: "$180k", value: "180000" },
  { label: "$200k", value: "200000" },
  { label: "$225k+", value: "225000" },
];

const suggestionPresets: SuggestionPreset[] = [
  {
    description: "Backend, cloud, and platform roles.",
    label: "Senior backend",
    points: 35,
    values: {
      currentTitle: "Senior Software Engineer",
      desiredCompensation: "180000",
      industries: "Software, Cloud, Fintech",
      minCompensation: "150000",
      preferredSkills: "Java, Spring Boot, PostgreSQL, AWS, System Design",
      summary:
        "Senior engineer focused on reliable backend systems, cloud architecture, and product-minded delivery.",
      workAuthorization: "Authorized to work in the United States",
    },
  },
  {
    description: "Product engineering with frontend and backend scope.",
    label: "Full-stack",
    points: 35,
    values: {
      currentTitle: "Senior Software Engineer",
      desiredCompensation: "170000",
      industries: "Software, Enterprise SaaS, E-commerce",
      minCompensation: "145000",
      preferredSkills: "React, TypeScript, Node.js, PostgreSQL, System Design",
      summary:
        "Full-stack engineer who can own user-facing product work, backend services, and pragmatic architecture.",
      workAuthorization: "Authorized to work in the United States",
    },
  },
  {
    description: "Technical leadership, mentoring, and architecture.",
    label: "Tech lead",
    points: 35,
    values: {
      currentTitle: "Staff Software Engineer",
      desiredCompensation: "200000",
      employmentTypes: "Full-time, Direct hire",
      industries: "Software, Cloud, Enterprise SaaS",
      leadership: "Technical leadership, mentoring, architecture reviews, delivery planning",
      minCompensation: "170000",
      preferredSkills: "System Design, Architecture, Cloud, Mentoring, Delivery Leadership",
      summary:
        "Technical leader with hands-on engineering depth, mentoring experience, and architecture ownership.",
      workAuthorization: "Authorized to work in the United States",
    },
  },
];

function listFromText(value?: string) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDefaults(defaults: ProfileFormDefaults): ProfileFormValues {
  return {
    currentTitle: defaults.currentTitle ?? "",
    dealBreakers: defaults.dealBreakers ?? "",
    desiredCompensation: defaults.desiredCompensation ?? "",
    employmentTypes: defaults.employmentTypes ?? "",
    excludedCompanies: defaults.excludedCompanies ?? "",
    industries: defaults.industries ?? "",
    instructions: defaults.instructions ?? "",
    leadership: defaults.leadership ?? "",
    minCompensation: defaults.minCompensation ?? "",
    preferredLocations: defaults.preferredLocations ?? "",
    preferredSkills: defaults.preferredSkills ?? "",
    preferredTitles: defaults.preferredTitles ?? "",
    relocation: defaults.relocation ?? "",
    remotePreference: defaults.remotePreference ?? "",
    skills: defaults.skills ?? "",
    sponsorship: defaults.sponsorship ?? "",
    summary: defaults.summary ?? "",
    targetCompanies: defaults.targetCompanies ?? "",
    travel: defaults.travel ?? "",
    workAuthorization: defaults.workAuthorization ?? "",
    yearsExperience: defaults.yearsExperience ?? "",
  };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function completionStats(values: ProfileFormValues) {
  const tasks = [
    hasText(values.currentTitle),
    hasText(values.yearsExperience),
    hasText(values.summary) || hasText(values.industries),
    hasText(values.preferredTitles),
    hasText(values.preferredLocations),
    hasText(values.remotePreference),
    hasText(values.employmentTypes),
    hasText(values.minCompensation) || hasText(values.desiredCompensation),
    hasText(values.workAuthorization),
    hasText(values.skills),
  ];
  const completed = tasks.filter(Boolean).length;
  const total = tasks.length;
  const percent = Math.round((completed / total) * 100);

  return {
    completed,
    percent,
    points: completed * 10,
    total,
  };
}

function nextWin(values: ProfileFormValues) {
  if (!hasText(values.currentTitle)) {
    return "Pick your current title";
  }

  if (!hasText(values.preferredTitles)) {
    return "Choose two target roles";
  }

  if (!hasText(values.preferredLocations)) {
    return "Select where you want to work";
  }

  if (!hasText(values.skills)) {
    return "Tap 3 skills you want matched";
  }

  return "You have a strong profile base";
}

function testChecklist(values: ProfileFormValues, starterApplied: boolean) {
  const selectedTitles = listFromText(values.preferredTitles).length;
  const selectedLocations = listFromText(values.preferredLocations).length;
  const selectedSkills = values.skills
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;

  return [
    {
      complete: starterApplied,
      label: "Apply a starter path",
    },
    {
      complete: selectedTitles >= 2,
      label: "Pick at least 2 target roles",
    },
    {
      complete: selectedLocations >= 1 && hasText(values.remotePreference),
      label: "Choose location and remote fit",
    },
    {
      complete: selectedSkills >= 3,
      label: "Add 3 match skills",
    },
  ];
}

function TextAreaField({
  label,
  name,
  onChange,
  placeholder,
  rows = 4,
  value,
}: {
  label: string;
  name: keyof ProfileFormDefaults;
  onChange: (name: keyof ProfileFormDefaults, value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        id={name}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: keyof ProfileFormDefaults;
  onChange: (name: keyof ProfileFormDefaults, value: string) => void;
  options: string[] | { label: string; value: string }[];
  value: string;
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        id={name}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        value={value}
      >
        {normalizedOptions.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfileProgress({
  completed,
  nextAction,
  percent,
  points,
  total,
}: {
  completed: number;
  nextAction: string;
  percent: number;
  points: number;
  total: number;
}) {
  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              <Flame aria-hidden="true" className="size-4" />
              {points} readiness pts
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium">
              <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
              {completed}/{total} quick wins
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Each choice makes job scoring sharper. Keep going one tap at a time.
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Zap aria-hidden="true" className="size-4 text-primary" />
            Next quick win
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{nextAction}</p>
        </div>
      </div>
    </section>
  );
}

function TestGuide({ starterApplied, values }: { starterApplied: boolean; values: ProfileFormValues }) {
  const items = testChecklist(values, starterApplied);
  const completed = items.filter((item) => item.complete).length;

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
              <MousePointerClick aria-hidden="true" className="size-4" />
            </span>
            <h2 className="text-lg font-semibold tracking-normal">Test this in 60 seconds</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use this checklist to review the new Ease & Fast profile experience without needing database saving.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-300",
                  item.complete
                    ? "aca-complete-pop border-primary/30 bg-primary/5 text-foreground"
                    : "bg-background text-muted-foreground",
                )}
                key={item.label}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className={cn("size-4 shrink-0", item.complete ? "text-primary" : "text-muted-foreground")}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Review score</span>
            <span className="text-primary">{completed}/4</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${completed * 25}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Click one starter path, then make the next choices yourself. Progress should move one step at a time.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  description,
  icon,
  points,
  title,
}: {
  description: string;
  icon: ReactNode;
  points: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
            {icon}
          </span>
          <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <span className="inline-flex h-8 w-fit items-center rounded-md border bg-background px-3 text-sm font-medium text-primary">
        {points}
      </span>
    </div>
  );
}

function MultiChoiceField({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: keyof ProfileFormDefaults;
  onChange: (name: keyof ProfileFormDefaults, value: string) => void;
  options: string[];
  value: string;
}) {
  const selected = useMemo(() => listFromText(value), [value]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(option: string) {
    const next = selectedSet.has(option) ? selected.filter((item) => item !== option) : [...selected, option];
    onChange(name, next.join(", "));
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{label}</legend>
      <input name={name} type="hidden" value={value} />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selectedSet.has(option);

          return (
            <button
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
              )}
              key={option}
              onClick={() => toggle(option)}
              type="button"
            >
              {active ? <Check aria-hidden="true" className="size-4" /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SuggestionButton({ onApply, preset }: { onApply: (preset: SuggestionPreset) => void; preset: SuggestionPreset }) {
  return (
    <button
      className="group rounded-lg border border-input bg-background p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
      onClick={() => onApply(preset)}
      type="button"
    >
      <span className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="size-4 text-primary" />
          {preset.label}
        </span>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">+{preset.points}</span>
      </span>
      <span className="mt-2 block text-sm leading-6 text-muted-foreground">{preset.description}</span>
    </button>
  );
}

export function ProfileForm({ databaseConfigured, defaults, mode = "profile" }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(saveProfileForm, {});
  const [values, setValues] = useState<ProfileFormValues>(() => normalizeDefaults(defaults));
  const [starterApplied, setStarterApplied] = useState(false);
  const stats = completionStats(values);

  function updateValue(name: keyof ProfileFormDefaults, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function applyPreset(preset: SuggestionPreset) {
    setValues((current) => ({ ...current, ...preset.values }));
    setStarterApplied(true);
  }

  function addSkill(skill: string) {
    setValues((current) => {
      const existingSkills = current.skills
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      if (existingSkills.includes(skill)) {
        return current;
      }

      return { ...current, skills: [...existingSkills, skill].join("\n") };
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground">
          Preview mode: you can build momentum here, then enable `DATABASE_URL` to save your progress.
        </div>
      ) : null}

      {state.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="rounded-lg border border-primary/30 bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
          {state.success}
        </div>
      ) : null}

      <ProfileProgress
        completed={stats.completed}
        nextAction={nextWin(values)}
        percent={stats.percent}
        points={stats.points}
        total={stats.total}
      />

      <TestGuide starterApplied={starterApplied} values={values} />

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <SectionHeader
          description="Start from a proven path, then tweak only what matters."
          icon={<Sparkles aria-hidden="true" className="size-4" />}
          points="Fast start"
          title="Choose a momentum path"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {suggestionPresets.map((preset) => (
            <SuggestionButton key={preset.label} onApply={applyPreset} preset={preset} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <SectionHeader
          description="Enough context for ACA to understand who you are and where your search should point."
          icon={<Target aria-hidden="true" className="size-4" />}
          points="+30 pts"
          title="Career basics"
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <SelectField
            label="Current title"
            name="currentTitle"
            onChange={updateValue}
            options={[{ label: "Select title", value: "" }, ...titleOptions.map((value) => ({ label: value, value }))]}
            value={values.currentTitle}
          />
          <SelectField
            label="Years of experience"
            name="yearsExperience"
            onChange={updateValue}
            options={[
              { label: "Select range", value: "" },
              { label: "0-1 years", value: "1" },
              { label: "2-4 years", value: "3" },
              { label: "5-7 years", value: "6" },
              { label: "8-10 years", value: "9" },
              { label: "11-15 years", value: "12" },
              { label: "16+ years", value: "16" },
            ]}
            value={values.yearsExperience}
          />
        </div>
        <div className="mt-5">
          <TextAreaField
            label="Career summary"
            name="summary"
            onChange={updateValue}
            placeholder="Senior engineer focused on reliable backend systems, cloud architecture, and product-minded delivery."
            value={values.summary}
          />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <MultiChoiceField
            label="Industries"
            name="industries"
            onChange={updateValue}
            options={industryOptions}
            value={values.industries}
          />
          <TextAreaField
            label="Leadership experience"
            name="leadership"
            onChange={updateValue}
            placeholder="Mentoring, tech lead, architecture ownership"
            value={values.leadership}
          />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <SectionHeader
          description="These choices help filter noise so your energy goes into roles worth pursuing."
          icon={<Zap aria-hidden="true" className="size-4" />}
          points="+50 pts"
          title="Target roles"
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <MultiChoiceField
            label="Preferred titles"
            name="preferredTitles"
            onChange={updateValue}
            options={preferredTitleOptions}
            value={values.preferredTitles}
          />
          <MultiChoiceField
            label="Preferred locations"
            name="preferredLocations"
            onChange={updateValue}
            options={locationOptions}
            value={values.preferredLocations}
          />
          <SelectField
            label="Minimum compensation"
            name="minCompensation"
            onChange={updateValue}
            options={compensationOptions}
            value={values.minCompensation}
          />
          <SelectField
            label="Desired compensation"
            name="desiredCompensation"
            onChange={updateValue}
            options={compensationOptions}
            value={values.desiredCompensation}
          />
          <SelectField
            label="Remote preference"
            name="remotePreference"
            onChange={updateValue}
            options={[
              { label: "Select preference", value: "" },
              { label: "Remote only", value: "Remote only" },
              { label: "Remote preferred", value: "Remote preferred" },
              { label: "Hybrid preferred", value: "Hybrid preferred" },
              { label: "On-site is okay", value: "On-site is okay" },
            ]}
            value={values.remotePreference}
          />
          <SelectField
            label="Work authorization"
            name="workAuthorization"
            onChange={updateValue}
            options={[
              { label: "Select authorization", value: "" },
              {
                label: "Authorized to work in the United States",
                value: "Authorized to work in the United States",
              },
              { label: "Need employer sponsorship", value: "Need employer sponsorship" },
              { label: "Open to international roles", value: "Open to international roles" },
            ]}
            value={values.workAuthorization}
          />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <MultiChoiceField
            label="Employment types"
            name="employmentTypes"
            onChange={updateValue}
            options={employmentTypeOptions}
            value={values.employmentTypes}
          />
          <MultiChoiceField
            label="Deal-breakers"
            name="dealBreakers"
            onChange={updateValue}
            options={dealBreakerOptions}
            value={values.dealBreakers}
          />
          <TextAreaField
            label="Preferred skills"
            name="preferredSkills"
            onChange={updateValue}
            placeholder="Java, Spring Boot, React, PostgreSQL"
            value={values.preferredSkills}
          />
          <TextAreaField
            label="Target companies"
            name="targetCompanies"
            onChange={updateValue}
            placeholder="Companies you want to prioritize"
            value={values.targetCompanies}
          />
          <TextAreaField
            label="Excluded companies"
            name="excludedCompanies"
            onChange={updateValue}
            placeholder="Companies to avoid"
            value={values.excludedCompanies}
          />
          <TextAreaField
            label="Application instructions"
            name="instructions"
            onChange={updateValue}
            placeholder="Tone, constraints, claims to avoid, or personal preferences."
            value={values.instructions}
          />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <SectionHeader
          description="Tap the skills you want matched first. You can refine the list anytime."
          icon={<Trophy aria-hidden="true" className="size-4" />}
          points="+20 pts"
          title="Match skills"
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {skillSuggestions.map((skill) => {
            const label = skill.split("|")[0].trim();

            return (
              <button
                className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-secondary"
                key={skill}
                onClick={() => addSkill(skill)}
                type="button"
              >
                <Zap aria-hidden="true" className="size-3.5 text-primary" />
                {label}
              </button>
            );
          })}
        </div>
        <div className="mt-5">
          <TextAreaField
            label="Skill list"
            name="skills"
            onChange={updateValue}
            placeholder={"Java | Backend | Advanced | 10\nReact | Frontend | Advanced | 6"}
            rows={7}
            value={values.skills}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isPending || !databaseConfigured}>
          {isPending ? "Saving..." : mode === "onboarding" ? "Save and continue" : "Save progress"}
        </Button>
      </div>
    </form>
  );
}
