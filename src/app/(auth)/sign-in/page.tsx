import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">ACA</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use the Week 2 development credentials from your environment.
          </p>
        </div>
        <SignInForm />
      </section>
    </main>
  );
}
