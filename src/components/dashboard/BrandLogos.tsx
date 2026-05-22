export function LorenzosLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="#D4A853" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="32" fill="#162544" />
      <text x="40" y="48" textAnchor="middle" fill="#D4A853" fontFamily="serif" fontSize="28" fontWeight="700">L</text>
      <text x="22" y="18" fill="#D4A853" fontFamily="sans-serif" fontSize="7" fontWeight="300" letterSpacing="1">EST.</text>
      <text x="54" y="18" fill="#D4A853" fontFamily="sans-serif" fontSize="7" fontWeight="300" letterSpacing="1">2010</text>
    </svg>
  );
}

export function TTRGLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <path d="M40 8L68 28V58L40 72L12 58V28L40 8Z" fill="#1B4332" stroke="#D4A853" strokeWidth="2" />
      <path d="M40 20C46 20 52 24 52 32C52 38 48 42 44 44L40 60L36 44C32 42 28 38 28 32C28 24 34 20 40 20Z" fill="#40916C" opacity="0.8" />
      <path d="M36 30L40 26L44 30L40 34L36 30Z" fill="#D4A853" />
      <circle cx="40" cy="50" r="3" fill="#D4A853" />
    </svg>
  );
}

export function SelectNetworkLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="28" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
      <ellipse cx="40" cy="40" rx="28" ry="12" stroke="#C9A84C" strokeWidth="1" fill="none" />
      <ellipse cx="40" cy="40" rx="12" ry="28" stroke="#C9A84C" strokeWidth="1" fill="none" />
      <line x1="12" y1="40" x2="68" y2="40" stroke="#C9A84C" strokeWidth="0.8" />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#C9A84C" strokeWidth="0.8" />
      <circle cx="40" cy="40" r="4" fill="#C9A84C" />
      <circle cx="40" cy="12" r="2.5" fill="#C9A84C" />
      <circle cx="40" cy="68" r="2.5" fill="#C9A84C" />
      <circle cx="12" cy="40" r="2.5" fill="#C9A84C" />
      <circle cx="68" cy="40" r="2.5" fill="#C9A84C" />
    </svg>
  );
}

export function TLMLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <rect x="4" y="4" width="72" height="72" rx="16" fill="#0f172a" />
      <text x="40" y="36" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="16" fontWeight="800" letterSpacing="2">TLM</text>
      <line x1="20" y1="44" x2="60" y2="44" stroke="#6366f1" strokeWidth="1.5" />
      <text x="40" y="56" textAnchor="middle" fill="#94a3b8" fontFamily="sans-serif" fontSize="6" fontWeight="400" letterSpacing="3">ENTERPRISES</text>
    </svg>
  );
}

export function getBrandLogo(brandId: string, className?: string) {
  switch (brandId) {
    case "lorenzos":
      return <LorenzosLogo className={className} />;
    case "ttrg":
      return <TTRGLogo className={className} />;
    case "selectnetwork":
      return <SelectNetworkLogo className={className} />;
    default:
      return <TLMLogo className={className} />;
  }
}
