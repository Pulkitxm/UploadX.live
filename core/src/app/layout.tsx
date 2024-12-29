import { NextAuthProvider } from "@/components/NextAuthProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen flex-col overflow-hidden">
        <NextAuthProvider>
          <Navbar />
          <div className="flex-1 overflow-hidden">{children}</div>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
