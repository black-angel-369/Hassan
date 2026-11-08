import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { site } from "@/content/portfolio";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const title = `${site.name} — ${site.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Muhammad Hassan Nadeem",
    "Software Engineer",
    "Cybersecurity Analyst",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Web Application Security",
    "Full-Stack Developer",
    "Peshawar",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: `${site.name} Portfolio`,
    title,
    description: site.description,
    locale: "en_US",
    firstName: "Muhammad Hassan",
    lastName: "Nadeem",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Enables pre-hidden reveal states only when motion
 * is allowed, decides whether the intro overlay shows, and includes a failsafe
 * that un-hides content if the client bundle never initialises.
 */
const prePaint = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');var s=null;try{s=sessionStorage.getItem('mhn-intro')}catch(e){}if(s!=='1')d.classList.add('show-intro');setTimeout(function(){if(!window.__mhnReady){d.classList.remove('js-motion','show-intro')}},5000)}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: ["Software Engineer", "Cybersecurity Analyst"],
  description: site.description,
  url: SITE_URL,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Peshawar", addressCountry: "PK" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "City University of Science and Information Technology (CUSIT)",
    address: { "@type": "PostalAddress", addressLocality: "Peshawar", addressCountry: "PK" },
  },
  knowsAbout: [
    "Cybersecurity",
    "Software Development",
    "Full-Stack Web Development",
    "Network Security",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Web Application Security",
  ],
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body className="grain min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
