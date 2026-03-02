import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Sidebar from "./Sidebar";
import RightUtilityPanel from "./RightUtilityPanel";
import useAuthStore from "../stores/authStore";
import { applyTheme, resolveInitialTheme } from "../lib/theme";

const routeMeta = {
  "/dashboard": { title: "Dashboard", crumbs: [] },
  "/workouts": { title: "Workouts", crumbs: [] },
  "/workouts/generate": { title: "Generate Plan", crumbs: [{ label: "Workouts", to: "/workouts" }] },
  "/nutrition": { title: "Nutrition", crumbs: [] },
  "/nutrition/generate": { title: "Generate Plan", crumbs: [{ label: "Nutrition", to: "/nutrition" }] },
  "/health": { title: "Health Assessment", crumbs: [] },
  "/progress": { title: "Progress", crumbs: [] },
  "/profile": { title: "Profile", crumbs: [] },
};

const getRouteMeta = (pathname: string) => {
  if (routeMeta[pathname as keyof typeof routeMeta]) return routeMeta[pathname as keyof typeof routeMeta];
  if (pathname.startsWith("/workouts/")) {
    return { title: "Plan Details", crumbs: [{ label: "Workouts", to: "/workouts" }] };
  }
  if (pathname.startsWith("/nutrition/")) {
    return { title: "Plan Details", crumbs: [{ label: "Nutrition", to: "/nutrition" }] };
  }
  return { title: "", crumbs: [] };
};

const getViewport = (): "desktop" | "tablet" | "mobile" => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

function SunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2V4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 19.5V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.9 4.9L6.7 6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.3 17.3L19.1 19.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.3 6.7L19.1 4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.9 19.1L6.7 17.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.5 17H8.5C7.39543 17 6.5 16.1046 6.5 15V10.5C6.5 7.46243 8.96243 5 12 5C15.0376 5 17.5 7.46243 17.5 10.5V15C17.5 16.1046 16.6046 17 15.5 17Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9.5 19C10.0335 19.6 10.8978 20 12 20C13.1022 20 13.9665 19.6 14.5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Layout() {
  const { fetchProfile, user } = useAuthStore();
  const location = useLocation();
  const [theme, setTheme] = useState(() => resolveInitialTheme());
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(getViewport);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);

  const isDesktop = viewport === "desktop";
  const panelMode = isDesktop ? "desktop" : viewport;

  useEffect(() => {
    if (!user) fetchProfile();
  }, [fetchProfile, user]);

  useEffect(() => {
    const onResize = () => setViewport(getViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (viewport !== "mobile") setMobileNavOpen(false);
    if (viewport === "desktop") setUtilityOpen(false);
  }, [viewport]);

  useEffect(() => {
    setMobileNavOpen(false);
    setUtilityOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!(viewport === "mobile" && mobileNavOpen)) return;
    const panel = document.querySelector("[data-mobile-nav-panel='true']");
    if (!panel) return;

    const focusables = () =>
      [...panel.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")] as HTMLElement[];
    const start = focusables()[0];
    start?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileNavOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [viewport, mobileNavOpen]);

  const meta = useMemo(() => getRouteMeta(location.pathname), [location.pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div className="min-h-screen app-bg">
      <div className="app-layout">
        <Sidebar mode={viewport} mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

        <div className="layout-center">
          <header className="topbar surface-frosted">
            <div className="topbar-inner">
              <div className="title-cluster" aria-label="Breadcrumb">
                {meta.crumbs.map((crumb) => (
                  <span key={crumb.to} className="flex items-center gap-2 shrink-0">
                    <Link
                      to={crumb.to}
                      className="text-xs hover:opacity-90 transition font-medium focus-ring"
                      style={{ color: "var(--text-3)" }}
                    >
                      {crumb.label}
                    </Link>
                    <FiChevronRight size={12} style={{ color: "var(--text-4)" }} />
                  </span>
                ))}
                <h1 className="text-base font-semibold truncate page-title" style={{ color: "var(--text-1)" }}>
                  {meta.title}
                </h1>
              </div>

              <div className="topbar-actions surface-frosted">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="utility-action-btn focus-ring"
                  data-theme-toggle
                  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isDesktop) setUtilityOpen((state) => !state);
                  }}
                  className="utility-action-btn focus-ring"
                  data-utility-toggle
                  aria-label="Toggle utility panel"
                  aria-expanded={!isDesktop ? String(utilityOpen) : undefined}
                >
                  <BellIcon />
                </button>

                {user && (
                  <div className="profile-chip">
                    <span className="avatar-chip" aria-hidden="true">{user.name?.[0]?.toUpperCase() || "U"}</span>
                    <span className="hidden sm:block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                      {user.name?.split(" ")[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="primary-column">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <RightUtilityPanel pathname={location.pathname} mode={panelMode} open={utilityOpen} onClose={() => setUtilityOpen(false)} />
      </div>
    </div>
  );
}
