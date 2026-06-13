import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Lý Gia Huy — Engineering Mechanics × Software × AI",
  description:
    "Portfolio of Lý Gia Huy: engineering mechanics, software, machine learning, robotics, and 3D web projects.",
  metadataBase: new URL("https://lygiahuy.vercel.app"),
  openGraph: {
    title: "Lý Gia Huy — Engineering Mechanics × Software × AI",
    description:
      "Engineering mechanics, software, machine learning, robotics, and 3D web projects.",
    type: "website",
  },
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'dark';
    var sysLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var light = t === 'light' || (t === 'system' && sysLight);
    document.documentElement.classList.add(light ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lý Gia Huy",
  alternateName: "Huy Gia Ly",
  jobTitle: "Engineering Mechanics Researcher",
  affiliation: "Ho Chi Minh City University of Technology (HCMUT)",
  url: "https://lygiahuy.vercel.app",
  sameAs: [
    "https://github.com/Huy-1906",
    "https://www.linkedin.com/in/giahuyly196/",
    "https://www.researchgate.net/publication/401616634",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
