import "@radix-ui/themes/styles.css";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Metadata } from "next";
import QueryProvider from "./QueryProvider";
import ThemeWarpper from "./ThemeWarpper";

export const metadata: Metadata = {
  title: "Real Address Generator",
  description: "Generate real addresses based on IP addresses",
  keywords:
    "IP address, Address generator, Geolocation, IP location, IP lookup, IP address lookup, Geolocation lookup, Location generator, Address lookup tool, IP tool, Address locator, Location information",
  authors: [{ name: "therayyanawaz" }],
  openGraph: {
    title: "Real Address Generator",
    description: "Generate real addresses based on IP addresses",
    type: "website",
    locale: "en_US",
    siteName: "Real Address Generator",
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
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryProvider>
          <ThemeWarpper>{children}</ThemeWarpper>
        </QueryProvider>
      </body>
    </html>
  );
}
