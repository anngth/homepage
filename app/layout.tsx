import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "homepage",
  description: "Heimer - Software Developer Portfolio",
  generator: "Next.js",
  authors: [{ name: "Heimer", url: "https://github.com/nguyenthanhan" }],
  keywords: ["Next.js", "Conference", "React", "TypeScript", "Demo"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
