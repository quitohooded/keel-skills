import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import DocHeader from "@/components/DocHeader";
import DocFooter from "@/components/DocFooter";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const SITE = "https://docs.estebanaguilar.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Keel Skills — Documentation",
    template: "%s · Keel Skills docs",
  },
  description:
    "Documentation for Keel Skills: a portable governance framework for Claude agents — a goal/method/green-light permission model, cost-aware model delegation, and file-grounded context discipline.",
  applicationName: "Keel Skills docs",
  authors: [{ name: "Esteban Aguilar", url: "https://estebanaguilar.me" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Keel Skills — Documentation",
    description:
      "Guardrails for autonomous coding agents: a goal/method/green-light permission model, cost-aware delegation, and file-as-source-of-truth context discipline.",
    url: SITE,
    siteName: "Keel Skills docs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keel Skills — Documentation",
    description:
      "Guardrails for autonomous coding agents: authorization levels, cost-aware delegation, file-grounded context.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NOTE: no className on <html>. The `dark` class is applied to <html> at
    // runtime (the head script below + ThemeToggle). Keeping the font variables
    // on <body> lets the runtime `dark` class survive client navigation —
    // same pattern as estebanaguilar.me.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${hanken.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-line focus:bg-paper focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
        >
          Skip to content
        </a>
        <DocHeader />
        {children}
        <DocFooter />
      </body>
    </html>
  );
}
