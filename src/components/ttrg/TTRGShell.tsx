"use client";

import { usePathname } from "next/navigation";
import TTRGNav from "@/components/ttrg/TTRGNav";
import TTRGFooter from "@/components/ttrg/TTRGFooter";

export default function TTRGShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/ttrg/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <TTRGNav />
      <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      <TTRGFooter />
    </div>
  );
}
