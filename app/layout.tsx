import type { Metadata } from "next";
import { Montserrat, Spectral } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://atlanticproperty.com'),
  title: {
    default: "Atlantic Property Partners | Trusted Real Estate Investment",
    template: "%s | Atlantic Property Partners"
  },
  description: "Securely invest in Nigerian and UK properties from the diaspora. Verified developers, 9.75% mortgages, and transparent legal documentation.",
  keywords: ["Nigeria real estate", "UK property investment", "diaspora mortgage", "Lagos property", "invest in Nigeria from abroad", "Atlantic Property Partners"],
  authors: [{ name: "Atlantic Property Partners" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://atlanticproperty.com",
    siteName: "Atlantic Property Partners",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Atlantic Property Partners Investment"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlantic Property Partners",
    description: "Secure real estate investments for Nigerians in the diaspora.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${spectral.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
