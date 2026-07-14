"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ttrg/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Redirecting to staff login...</p>
      </div>
    </div>
  );
}
