export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/jobs/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/question-bank/:path*",
    "/resume/:path*",
    "/review/:path*",
    "/settings/:path*",
    "/top-matches/:path*",
  ],
};
