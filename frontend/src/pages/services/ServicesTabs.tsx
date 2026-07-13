import { Link, useLocation } from "react-router-dom";

export default function ServicesTabs() {
  const location = useLocation();
  const tabs = [
    { name: "Hospital Finder", path: "/services/hospitals" },
    { name: "Lab Tests", path: "/services/labs" }
  ];
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map(t => (
        <Link 
          key={t.path} 
          to={t.path} 
          className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border"
          style={location.pathname === t.path ? { background: "var(--accent-dim)", color: "var(--accent-light)", borderColor: "var(--accent)" } : { background: "var(--surface-1)", color: "var(--text-2)", borderColor: "var(--border-subtle)" }}
        >
          {t.name}
        </Link>
      ))}
    </div>
  );
}
