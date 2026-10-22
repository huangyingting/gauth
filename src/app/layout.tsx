import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gauth: AI Study Companion | Homework Helper, Academy & Atlas",
  description:
    "Your AI Study Companion across Math, Science, History, and Writing. Step-by-step solver, Interactive Gauth Academy courses, and Gauth Atlas visual learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
