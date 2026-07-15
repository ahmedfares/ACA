import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACA",
  description: "AI-powered job search and application assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
