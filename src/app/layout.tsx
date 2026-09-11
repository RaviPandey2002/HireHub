import { Suspense } from "react";
import Loading from "./components/loading";
import "./globals.css";
import { auth } from "auth";
import Header from "@/components/common/header";
import SessionWrapper from "./components/sessionWrapper";
import { Toaster } from "./components/ui/toaster";

export const metadata = {
  title: "HireHub — Find Jobs & Hire Talent",
  description: "HireHub is a job board connecting recruiters and candidates. Post jobs, apply, and track applications all in one place.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full overflow-x-hidden font-sans antialiased">
        <SessionWrapper session={session}>
          <Suspense fallback={<Loading />}>
            <Header user={session?.user} />
            {children}
          </Suspense>
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
