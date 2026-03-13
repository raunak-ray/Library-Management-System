import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LibraryOS - Library Management System",
  description: "Modern library management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster
  position="top-right"
  gutter={10}
  toastOptions={{
    duration: 3500,
    style: {
      background: "oklch(0.145 0 0)",
      color: "#ffffff",
      border: "1px solid #e5e5e5",
      padding: "14px 16px",
      borderRadius: "8px",
      fontSize: "18px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    success: {
      iconTheme: {
        primary: "#000",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#000",
        secondary: "#fff",
      },
    },
  }}
/>
      </body>
    </html>
  );
}
