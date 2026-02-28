import { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiChevronRight } from "react-icons/fi";
import Sidebar from "./Sidebar";
import useAuthStore from "../stores/authStore";
import useUiStore from "../stores/uiStore";

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

function getRouteMeta(pathname) {
  if (routeMeta[pathname]) return routeMeta[pathname];
  if (pathname.startsWith("/workouts/"))
    return { title: "Plan Details", crumbs: [{ label: "Workouts", to: "/workouts" }] };
  if (pathname.startsWith("/nutrition/"))
    return { title: "Plan Details", crumbs: [{ label: "Nutrition", to: "/nutrition" }] };
  return { title: "", crumbs: [] };
}

export default function Layout() {
  const { fetchProfile, user } = useAuthStore();
  const location = useLocation();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen);

  useEffect(() => {
    if (!user) fetchProfile();
  }, [fetchProfile, user]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  const meta = getRouteMeta(location.pathname);

  return (
    <div className="min-h-screen app-bg">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className="min-h-screen main-content relative z-10"
        style={{ "--current-sidebar-w": collapsed ? "72px" : "240px" }}
      >
        {/* Top header bar */}
        <header
          className="sticky top-0 z-30 h-16 shrink-0"
          style={{
            background: "rgba(13,20,32,0.82)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="content-shell h-full flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg btn btn-ghost focus-ring"
              aria-label="Open sidebar navigation"
            >
              <FiMenu size={20} />
            </button>

            {/* Breadcrumbs + Title */}
            <div className="flex items-center gap-2 min-w-0" aria-label="Breadcrumb">
              {meta.crumbs.map((c) => (
                <span key={c.to} className="flex items-center gap-2 shrink-0">
                  <Link
                    to={c.to}
                    className="text-xs hover:opacity-90 transition font-medium focus-ring"
                    style={{ color: "var(--text-3)" }}
                  >
                    {c.label}
                  </Link>
                  <FiChevronRight size={12} style={{ color: "var(--text-4)" }} />
                </span>
              ))}
              <h1 className="text-sm font-semibold truncate" style={{ color: "var(--text-1)" }}>
                {meta.title}
              </h1>
            </div>

            <div className="flex-1" />

            {/* User badge */}
            {user && (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border"
                  style={{ color: "var(--text-1)", background: "var(--surface-2)", borderColor: "var(--border-subtle)" }}
                  aria-hidden="true"
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  {user.name?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main content with page transitions */}
        <main className="content-shell py-6 sm:py-6 lg:py-6">
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
    </div>
  );
}
