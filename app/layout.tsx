import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creator Nexus by Nexfluence",
  description:
    "Bringing Impactful Creators Across the Baltics Under One Roof. Latvia's premier influencer marketing platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <body
        style={{
          background: "#0a0612",
          minHeight: "100vh",
          margin: 0,
          fontFamily: "var(--font-rubik), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}