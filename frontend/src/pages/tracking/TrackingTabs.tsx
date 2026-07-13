import { Link, useLocation } from "react-router-dom";

export default function TrackingTabs() {
  const location = useLocation();
  const tabs = [
    { name: "Symptoms", path: "/tracking/symptoms" },
    { name: "Medications", path: "/tracking/medications" },
    { name: "Vaccinations", path: "/tracking/vaccinations" },
    { name: "Notifications", path: "/tracking/notifications" }
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
