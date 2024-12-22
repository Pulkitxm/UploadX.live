import { NextAuthProvider } from "@/lib/NextAuthProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <NextAuthProvider>
        <body className="flex h-screen w-screen flex-col overflow-y-auto">
          <Navbar />
          <div className="flex-grow">{children}</div>
        </body>
      </NextAuthProvider>
    </html>
  );
}
