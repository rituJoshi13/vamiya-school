import "./globals.css"; // 👈 MOVE THIS TO THE TOP
import { Inter } from "next/font/google"; // or your font
import StoreProvider from "@/components/providers/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Get the current path from headers
  const headerList = await headers();
  // In Next.js 15, x-url or x-pathname is often used via middleware
  const pathname = headerList.get("x-current-path") || "";

  // 2. Check Database Count
  const [result] = await db.select({ value: count() }).from(profiles);
  const isSystemEmpty = result?.value === 0;

  // 3. ONLY redirect if the user is NOT already on the register or auth pages
  // This prevents the infinite 307 loop
  if (isSystemEmpty) {
    const isRegistrationPage = pathname.includes("/register");
    const isAuthPage = pathname.includes("/auth");

    if (!isRegistrationPage && !isAuthPage) {
      redirect("/register");
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Wrap everything in the StoreProvider */}
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}