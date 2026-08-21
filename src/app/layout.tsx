import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://checko.app"),
  title: "Checko — AI Persona Debate & WhatsApp Arena",
  description:
    "Interactive AI Persona Debate Arena. Watch iconic historical and custom personas debate in real-time WhatsApp-style group chats with voice synthesis.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  keywords: [
    "Checko",
    "AI Persona",
    "Debate Arena",
    "WhatsApp Group Chat",
    "Gemini AI",
    "OpenRouter",
    "Einstein vs Hawking",
  ],
  openGraph: {
    title: "Checko — AI Persona Debate & WhatsApp Arena",
    description:
      "Interactive AI Persona Debate Arena with voice synthesis, sliding context token optimization, and custom Wikipedia figures.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
