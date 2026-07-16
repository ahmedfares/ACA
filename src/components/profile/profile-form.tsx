"use client";

import { useActionState } from "react";

import { saveProfileForm, type ProfileFormState } from "@/features/profile/actions";
import { Button } from "@/components/ui/button";

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

function TextField({
  defaultValue,
  label,
  name,
  placeholder,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: keyof ProfileFormDefaults;
  placeholder?: string;
  type?: "number" | "text";
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

function TextAreaField({
  defaultValue,
  label,
  name,
  placeholder,
  rows = 4,
}: {
  defaultValue?: string;
  label: string;
  name: keyof ProfileFormDefaults;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        defaultValue={defaultValue}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

export function ProfileForm({ databaseConfigured, defaults, mode = "profile" }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(saveProfileForm, {});

  return (
    <form action={formAction} className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
          Saving is disabled until `DATABASE_URL` points to a PostgreSQL database.
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

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-normal">Career basics</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextField
            defaultValue={defaults.currentTitle}
            label="Current title"
            name="currentTitle"
            placeholder="Senior Software Engineer"
          />
          <TextField
            defaultValue={defaults.yearsExperience}
            label="Years of experience"
            name="yearsExperience"
            placeholder="10"
            type="number"
          />
        </div>
        <div className="mt-5">
          <TextAreaField
            defaultValue={defaults.summary}
            label="Career summary"
            name="summary"
            placeholder="Briefly describe your background, strengths, and target direction."
          />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextAreaField
            defaultValue={defaults.industries}
            label="Industries"
            name="industries"
            placeholder="Software, fintech, healthcare"
          />
          <TextAreaField
            defaultValue={defaults.leadership}
            label="Leadership experience"
            name="leadership"
            placeholder="Mentoring, tech lead, architecture ownership"
          />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-normal">Target role preferences</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextAreaField
            defaultValue={defaults.preferredTitles}
            label="Preferred titles"
            name="preferredTitles"
            placeholder="Senior Software Engineer, Backend Engineer"
          />
          <TextAreaField
            defaultValue={defaults.preferredLocations}
            label="Preferred locations"
            name="preferredLocations"
            placeholder="Remote US, Atlanta hybrid"
          />
          <TextField
            defaultValue={defaults.minCompensation}
            label="Minimum compensation"
            name="minCompensation"
            placeholder="150000"
            type="number"
          />
          <TextField
            defaultValue={defaults.desiredCompensation}
            label="Desired compensation"
            name="desiredCompensation"
            placeholder="180000"
            type="number"
          />
          <TextField
            defaultValue={defaults.remotePreference}
            label="Remote preference"
            name="remotePreference"
            placeholder="Remote preferred"
          />
          <TextField
            defaultValue={defaults.workAuthorization}
            label="Work authorization"
            name="workAuthorization"
            placeholder="Authorized to work in the United States"
          />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextAreaField
            defaultValue={defaults.employmentTypes}
            label="Employment types"
            name="employmentTypes"
            placeholder="Full-time, direct hire"
          />
          <TextAreaField
            defaultValue={defaults.dealBreakers}
            label="Deal-breakers"
            name="dealBreakers"
            placeholder="Contract, C2C, required relocation"
          />
          <TextAreaField
            defaultValue={defaults.preferredSkills}
            label="Preferred skills"
            name="preferredSkills"
            placeholder="Java, Spring Boot, React, PostgreSQL"
          />
          <TextAreaField
            defaultValue={defaults.targetCompanies}
            label="Target companies"
            name="targetCompanies"
            placeholder="Companies you want to prioritize"
          />
          <TextAreaField
            defaultValue={defaults.excludedCompanies}
            label="Excluded companies"
            name="excludedCompanies"
            placeholder="Companies to avoid"
          />
          <TextAreaField
            defaultValue={defaults.instructions}
            label="Application instructions"
            name="instructions"
            placeholder="Tone, constraints, claims to avoid, or personal preferences."
          />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-normal">Skills</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter one skill per line as `Name | Category | Proficiency | Years`.
        </p>
        <div className="mt-5">
          <TextAreaField
            defaultValue={defaults.skills}
            label="Skill list"
            name="skills"
            placeholder={"Java | Backend | Advanced | 10\nReact | Frontend | Advanced | 6"}
            rows={7}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isPending || !databaseConfigured}>
          {isPending ? "Saving..." : mode === "onboarding" ? "Save and continue" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
