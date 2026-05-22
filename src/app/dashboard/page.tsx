"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import OverviewPanel from "@/components/dashboard/OverviewPanel";
import BrandPanel from "@/components/dashboard/BrandPanel";
import { brands } from "@/lib/brands";

export default function DashboardPage() {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectedBrand = activeBrand
    ? brands.find((b) => b.id === activeBrand) || null
    : null;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar
        activeBrand={activeBrand}
        onBrandSelect={setActiveBrand}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          activeBrand={selectedBrand}
          onBackToOverview={() => setActiveBrand(null)}
        />

        <main className="flex-1 overflow-y-auto">
          {selectedBrand ? (
            <BrandPanel brand={selectedBrand} />
          ) : (
            <OverviewPanel onSelectBrand={setActiveBrand} />
          )}
        </main>
      </div>
    </div>
  );
}
