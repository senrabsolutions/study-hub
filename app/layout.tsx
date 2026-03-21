import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import SiteHeader from "@/components/SiteHeader";
import PwaRegister from "@/components/PwaRegister";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Study Hub",
  description: "Windows CLI Engineering Study Plan",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Study Hub",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <Providers>
          <ProgressProvider>
            <PwaRegister />
            <div className="min-h-screen">
              <SiteHeader />
              {children}
            </div>
          </ProgressProvider>
        </Providers>
      </body>
    </html>
  );
}