import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiActivity, FiHeart, FiHome, FiLogOut, FiTrendingUp, FiUser, FiUsers, FiFileText } from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import useAuthStore from "../stores/authStore";

const navItems = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/workouts", icon: FiActivity, label: "Workouts" },
  { to: "/nutrition", icon: GiMeal, label: "Nutrition" },
  { to: "/health", icon: FiHeart, label: "Health" },
  { to: "/progress", icon: FiTrendingUp, label: "Progress" },
  { to: "/profile", icon: FiUser, label: "Profile" },
  { to: "/contributors", icon: FiUsers, label: "Contributors" },
  { to: "/license", icon: FiFileText, label: "License" },
];

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({
  mode,
  mobileOpen,
  setMobileOpen,
}: {
  mode: "desktop" | "tablet" | "mobile";
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const compact = mode === "tablet";
  const showMobileDrawer = mode === "mobile";
  const showLabels = !compact;

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {showMobileDrawer && !mobileOpen && (
        <div className="mobile-sidebar-launcher surface-frosted" data-sidebar-header>
          <button
            type="button"
            className="sidebar-hamburger focus-ring"
            data-mobile-nav-trigger
            aria-label="Open navigation"
            aria-controls="mobile-nav-drawer"
            aria-expanded="false"
            onClick={() => setMobileOpen(true)}
          >
            <HamburgerIcon />
          </button>
        </div>
      )}

      {showMobileDrawer && mobileOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="mobile-nav-drawer"
        className={`sidebar-panel ${showMobileDrawer ? "sidebar-mobile" : "sidebar-fixed"} ${
          showMobileDrawer && mobileOpen ? "mobile-open" : ""
        }`}
        data-mobile-nav-panel={showMobileDrawer && mobileOpen ? "true" : "false"}
        aria-label="Primary navigation"
      >
        <div className="sidebar-body surface-frosted flex flex-col">
          <div className={`sidebar-header ${compact ? "compact" : ""}`}>
            {showMobileDrawer && (
              <button
                type="button"
                className="sidebar-hamburger focus-ring"
                aria-label="Close navigation"
                aria-controls="mobile-nav-drawer"
                aria-expanded={mobileOpen ? "true" : "false"}
                onClick={() => setMobileOpen(false)}
              >
                <HamburgerIcon />
              </button>
            )}
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ArogyaMitra logo" className="w-9 h-9 rounded-xl object-cover shrink-0" />
            {showLabels && <span className="text-base font-bold text-gradient whitespace-nowrap">ArogyaMitra</span>}
          </div>

          <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${compact ? "px-2" : "px-3"}`} aria-label="Sidebar">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (showMobileDrawer) setMobileOpen(false);
                  }}
                  title={compact ? item.label : undefined}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 focus-ring ${
                    compact ? "justify-center w-12 h-11 mx-auto" : "gap-3 px-3 py-2.5"
                  } ${
                    active
                      ? "text-cyan-200"
                      : "text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-white/[0.03]"
                  }`}
                  style={active ? { background: "var(--accent-dim)", color: "var(--accent-light)" } : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                  <item.icon size={24} className="shrink-0" strokeWidth={1.6} />
                  {showLabels && <span className="text-sm font-medium">{item.label}</span>}
                  {compact && (
                    <span
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60]"
                      style={{
                        background: "var(--surface-3)",
                        color: "var(--text-1)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={`${compact ? "p-2" : "p-3"} shrink-0`} style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {showLabels && user && (
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--text-1)",
                    border: "1px solid var(--border-subtle)",
                  }}
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
              type="button"
              onClick={handleLogout}
              title={compact ? "Logout" : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 focus-ring ${
                compact ? "justify-center w-12 h-11 mx-auto" : "gap-3 px-3 py-2.5 w-full"
              }`}
              style={{ color: "#ff8a8a" }}
              aria-label="Logout"
            >
              <FiLogOut size={22} strokeWidth={1.6} />
              {showLabels && "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
