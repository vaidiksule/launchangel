import type { Metadata } from "next";
import "@fontsource/open-sauce-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchAngel | Autonomous Influencer Growth Agents",
  description: "Scale your startup with AI-driven influencer marketing campaigns. Predicting ROI, generating style-matched hooks, and automating campaign workflows.",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
