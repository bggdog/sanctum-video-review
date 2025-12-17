import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Sanctum Creative",
  description: "Video review and collaboration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SessionProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

