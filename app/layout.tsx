import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SilkRoad China Export",
  description: "B2B Export Platform for Chinese Suppliers",
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
