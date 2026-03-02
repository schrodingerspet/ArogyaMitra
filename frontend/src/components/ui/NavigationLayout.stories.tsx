import { useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import useAuthStore from "../../stores/authStore";
import { applyTheme } from "../../lib/theme";

const meta = {
  title: "Navigation/Layout",
  parameters: { layout: "fullscreen" },
};

export default meta;

function LayoutHarness({ theme = "dark", openMobile = false }) {
  useEffect(() => {
    applyTheme(theme);
    useAuthStore.setState({
      user: { name: "Storybook User", email: "storybook@arogyamitra.dev" },
      token: "storybook-token",
      loading: false,
      error: null,
    });
    if (!openMobile) return;
    const trigger = document.querySelector<HTMLButtonElement>("[data-mobile-nav-trigger]");
    trigger?.click();
  }, [theme, openMobile]);

  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={
              <section className="content-grid">
                <div className="surface-frosted p-6">
                  <h2 style={{ color: "var(--text-1)" }}>Dashboard content</h2>
                  <p style={{ color: "var(--text-2)" }}>Left-aligned layout preview for navigation states.</p>
                </div>
                <div className="surface-frosted p-6">
                  <h3 style={{ color: "var(--text-1)" }}>Card grid</h3>
                  <p style={{ color: "var(--text-2)" }}>Gap uses `--space-24` token.</p>
                </div>
              </section>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export const Desktop = {
  args: { theme: "dark" },
  parameters: {
    viewport: { defaultViewport: "desktop" },
    chromatic: { viewports: [1366] },
  },
  render: (args) => <LayoutHarness {...args} />,
};

export const TabletCompact = {
  args: { theme: "dark" },
  parameters: {
    viewport: { defaultViewport: "tablet" },
    chromatic: { viewports: [1024] },
  },
  render: (args) => <LayoutHarness {...args} />,
};

export const MobileOverlay = {
  args: { theme: "dark", openMobile: true },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: { viewports: [390] },
  },
  render: (args) => <LayoutHarness {...args} />,
};
