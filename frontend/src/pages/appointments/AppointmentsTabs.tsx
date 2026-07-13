import { Link, useLocation } from "react-router-dom";

export default function AppointmentsTabs() {
  const location = useLocation();
  const tabs = [
    { name: "Calendar", path: "/appointments/calendar" },
    { name: "Waiting List", path: "/appointments/waiting-list" },
    { name: "Reminders", path: "/appointments/reminders" },
    { name: "Follow-Ups", path: "/appointments/follow-ups" }
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
