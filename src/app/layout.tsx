import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khalsa Gurmat School",
  description:
    "Gurbani, history, and Sikh philosophy for students 14+ — plus seva, community, and lifelong friendships. Explore this year's program at Khalsa Gurmat School.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-cream text-navy">{children}</body>
    </html>
  );
}
