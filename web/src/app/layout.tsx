import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/presentation/providers/ThemeProvider";
import { ReduxProvider } from "@/presentation/providers/ReduxProvider";
import { ToastProvider } from "@/presentation/components/common/Toast";

const merriweather = Merriweather({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bunny Cove - Cozy Social Gaming Universe",
  description: "A cozy social gaming universe for friends and communities. Play Caro 15x15, Bingo, and chat in realtime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${merriweather.variable} font-serif antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen select-none`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
