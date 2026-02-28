import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiActivity, FiHeart, FiTrendingUp, FiUser, FiLogOut,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import useAuthStore from "../stores/authStore";

const navItems = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/workouts", icon: FiActivity, label: "Workouts" },
  { to: "/nutrition", icon: GiMeal, label: "Nutrition" },
  { to: "/health", icon: FiHeart, label: "Health" },
  { to: "/progress", icon: FiTrendingUp, label: "Progress" },
  { to: "/profile", icon: FiUser, label: "Profile" },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (to) =>
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(to);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          width: collapsed ? "72px" : "240px",
          background: "rgba(13,20,32,0.94)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRight: "1px solid var(--border-subtle)",
        }}
        aria-label="Primary navigation"
      >
        {/* Logo area */}
        <div
          className={`h-16 flex items-center shrink-0 ${
            collapsed ? "justify-center" : "px-5 gap-3"
          }`}
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <img
            src="/logo.png"
            alt="ArogyaMitra logo"
            className="w-9 h-9 rounded-xl object-cover shrink-0"
          />
          {!collapsed && (
            <span className="text-lg font-bold text-gradient whitespace-nowrap">
              ArogyaMitra
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`} role="navigation" aria-label="Sidebar">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center rounded-xl transition-all duration-200 focus-ring ${
                  collapsed
                    ? "justify-center w-12 h-11 mx-auto"
                    : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "text-cyan-200"
                    : "text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-white/[0.03]"
                }`}
                style={active ? { background: "var(--accent-dim)", color: "var(--accent-light)" } : undefined}
                aria-current={active ? "page" : undefined}
              >
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
                <item.icon size={collapsed ? 20 : 18} className="shrink-0" strokeWidth={2.2} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span
                    className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] shadow-xl"
                    style={{ background: "var(--surface-3)", color: "var(--text-1)", border: "1px solid var(--border-subtle)" }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex justify-center py-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg btn btn-ghost focus-ring"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        {/* User info + Logout */}
        <div className={`shrink-0 ${collapsed ? "p-2" : "p-3"}`} style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "var(--surface-2)", color: "var(--text-1)", border: "1px solid var(--border-subtle)" }}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{user.name}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--text-3)" }}>{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 focus-ring ${
              collapsed ? "justify-center w-12 h-11 mx-auto" : "gap-3 px-3 py-2.5 w-full"
            }`}
            style={{ color: "#ff8a8a" }}
            aria-label="Logout"
          >
            <FiLogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
