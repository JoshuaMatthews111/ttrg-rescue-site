export interface Brand {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  domain: string;
  logo: string;
  logoIcon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    bgDark: string;
    text: string;
  };
  stats: {
    visitors: string;
    revenue: string;
    users: string;
    growth: string;
  };
  status: "live" | "development" | "maintenance";
  description: string;
  systemType: string;
  previewUrl: string;
}

export const brands: Brand[] = [
  {
    id: "lorenzos",
    name: "Lorenzo's Dog Training Team",
    shortName: "LDTT",
    tagline: "Discipline. Focus. Results.",
    domain: "lorenzosdogtrainingteam.com",
    logo: "/logos/lorenzos-full.svg",
    logoIcon: "/logos/lorenzos-icon.svg",
    colors: {
      primary: "#162544",
      secondary: "#C92B2B",
      accent: "#D4A853",
      bg: "#F8F8F8",
      bgDark: "#0e1a30",
      text: "#162544",
    },
    stats: {
      visitors: "24,892",
      revenue: "$48,320",
      users: "1,247",
      growth: "+18.2%",
    },
    status: "live",
    description: "Professional dog training — scheduling, client management, trainer operations",
    systemType: "Scheduling / Operations CRM",
    previewUrl: "/",
  },
  {
    id: "ttrg",
    name: "Team Trainer Rescue Group",
    shortName: "TTRG",
    tagline: "Rescue. Rehabilitate. Rehome.",
    domain: "teamtrainerrescuegroup.com",
    logo: "/logos/ttrg-full.svg",
    logoIcon: "/logos/ttrg-icon.svg",
    colors: {
      primary: "#1B4332",
      secondary: "#40916C",
      accent: "#D4A853",
      bg: "#F0F7F4",
      bgDark: "#0d2818",
      text: "#1B4332",
    },
    stats: {
      visitors: "12,450",
      revenue: "$28,150",
      users: "856",
      growth: "+24.7%",
    },
    status: "development",
    description: "Donor engagement, dog rescue journey tracking, emotional connection platform",
    systemType: "Donor / Rescue CRM",
    previewUrl: "/ttrg",
  },
  {
    id: "selectnetwork",
    name: "Select Network",
    shortName: "SN",
    tagline: "Connect. Collaborate. Elevate.",
    domain: "selectnetwork.com",
    logo: "/logos/sn-full.svg",
    logoIcon: "/logos/sn-icon.svg",
    colors: {
      primary: "#1a1a2e",
      secondary: "#C9A84C",
      accent: "#4A90D9",
      bg: "#F5F5F7",
      bgDark: "#0f0f1a",
      text: "#1a1a2e",
    },
    stats: {
      visitors: "8,320",
      revenue: "$15,800",
      users: "432",
      growth: "+31.5%",
    },
    status: "development",
    description: "Business & investor network — growth, opportunity, professional connections",
    systemType: "Business / Investor Network",
    previewUrl: "/selectnetwork",
  },
];

export const tlmEnterprise = {
  name: "TLM Enterprises",
  tagline: "One Ecosystem. Multiple Premium Brands.",
  colors: {
    primary: "#0f172a",
    secondary: "#6366f1",
    accent: "#D4A853",
    bg: "#f8fafc",
  },
};
