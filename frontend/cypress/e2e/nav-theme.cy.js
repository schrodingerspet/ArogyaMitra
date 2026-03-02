const profile = {
  id: 1,
  name: "Cypress User",
  email: "cypress@arogyamitra.dev",
};

function stubApi() {
  cy.intercept("GET", "**/auth/profile", { statusCode: 200, body: profile });
  cy.intercept("GET", "**/analytics/summary", {
    statusCode: 200,
    body: { total_calories_burned: 620, total_workouts: 4, current_weight: 72, weight_change: -0.8 },
  });
  cy.intercept("GET", "**/analytics/weekly", {
    statusCode: 200,
    body: {
      daily_breakdown: [
        { date: "2026-03-01", calories_burned: 180, workouts_completed: 1 },
        { date: "2026-03-02", calories_burned: 210, workouts_completed: 1 },
      ],
    },
  });
  cy.intercept("GET", "**/analytics/streak", {
    statusCode: 200,
    body: { current_streak: 3, longest_streak: 8, total_workout_days: 26 },
  });
  cy.intercept("GET", "**/chat/sessions", { statusCode: 200, body: [] });
}

function visitDashboard() {
  stubApi();
  cy.visit("/dashboard", {
    onBeforeLoad(win) {
      win.localStorage.setItem("token", "cypress-token");
      win.localStorage.setItem("arogyamitra-theme", "dark");
    },
  });
}

describe("navigation and theme controls", () => {
  it("has no hamburger in desktop topbar and keeps title alignment locked", () => {
    cy.viewport(1440, 900);
    visitDashboard();
    cy.get(".topbar").within(() => {
      cy.get("[data-mobile-nav-trigger]").should("not.exist");
      cy.get(".page-title").should("be.visible");
    });

    cy.get(".page-title").then(($title) => {
      const titleLeft = $title[0].getBoundingClientRect().left;
      cy.get(".primary-column").then(($primary) => {
        const contentLeft = $primary[0].getBoundingClientRect().left;
        expect(Math.abs(titleLeft - contentLeft)).to.be.lessThan(3);
      });
    });
  });

  it("opens mobile drawer from sidebar header trigger and closes with Escape", () => {
    cy.viewport(390, 844);
    visitDashboard();
    cy.get("[data-sidebar-header]").within(() => {
      cy.get("[data-mobile-nav-trigger]").should("be.visible");
    });
    cy.get("[data-mobile-nav-trigger]").click();
    cy.get(".mobile-nav-backdrop").should("be.visible");
    cy.get("[data-mobile-nav-panel='true']").should("be.visible");
    cy.get(".topbar").within(() => {
      cy.get("[data-mobile-nav-trigger]").should("not.exist");
    });

    cy.get("[data-mobile-nav-panel='true']")
      .find("a[href],button:not([disabled]),[tabindex]:not([tabindex='-1'])")
      .then(($nodes) => {
        const first = $nodes[0];
        const last = $nodes[$nodes.length - 1];
        cy.wrap(last).focus();
        cy.get("body").trigger("keydown", { key: "Tab" });
        cy.focused().should("have.prop", "tagName", first.tagName);
      });

    cy.get("body").trigger("keydown", { key: "Escape" });
    cy.get(".mobile-nav-backdrop").should("not.exist");
  });

  it("toggles theme and utility panel behavior across breakpoints", () => {
    cy.viewport(1366, 900);
    visitDashboard();
    cy.get(".utility-panel-desktop").should("be.visible");

    cy.get("[data-theme-toggle]").click();
    cy.get("html").should("have.attr", "data-theme", "light");
    cy.get("[data-theme-toggle]").click();
    cy.get("html").should("have.attr", "data-theme", "dark");

    cy.viewport(900, 900);
    cy.get("[data-utility-toggle]").click();
    cy.get(".utility-panel-tablet").should("be.visible");
    cy.get("body").trigger("keydown", { key: "Escape" });
    cy.get(".utility-panel-tablet").should("not.exist");
  });
});
