import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import { bootstrapAdmin } from "../src/lib/account-admission";

test.describe("Gauth Full-Stack Feature Parity & Invite-Only Admission E2E", () => {
  test("1. Homework Helper, Math Keyboard Modal, and Step-by-Step Quadratic Solution", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Your AI Study Companion" })
    ).toBeVisible();

    // Open and interact with Math Keyboard modal
    await page.getByRole("button", { name: /Math Keyboard/i }).click();
    await expect(page.getByLabel("Interactive Math Keyboard")).toBeVisible();
    await page.getByRole("button", { name: "Calculus" }).first().click();
    await expect(
      page.getByRole("button", { name: "d/dx", exact: true })
    ).toBeVisible();
    await page.getByRole("button", { name: /Close/i }).click();

    // Submit quadratic equation scenario
    const textarea = page.getByPlaceholder(
      "Enter your homework question here or upload an image"
    );
    await textarea.fill(
      "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step"
    );
    await page.getByRole("button", { name: "Submit homework question" }).click();

    await expect(page).toHaveURL(/\/search-question/);
    await expect(page.getByText("x = 2, x = 3")).toBeVisible();
    await expect(page.getByText("Review of Key Concepts")).toBeVisible();
    await expect(
      page.getByText(/Step 1: Identify the coefficients/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Step 4: Apply the Zero Product Property/i)
    ).toBeVisible();

    // Trigger Gauth AI Pro Verification & Helpful feedback
    await page.getByRole("button", { name: "Get Gauth AI Pro Answers" }).click();
    await expect(
      page.getByText(/Gauth AI Pro Multi-Step Cross-Check/i)
    ).toBeVisible();
    await page.getByRole("button", { name: /Helpful/i }).first().click();
  });

  test("2. Gauth Academy: Science Labs, Math Curriculums, History Signature, Create a Course & Interactive Player", async ({
    page,
  }) => {
    // Science Labs (12 courses)
    await page.goto("/course/science");
    await expect(
      page.getByRole("heading", { name: "Science Labs" })
    ).toBeVisible();
    await expect(page.getByText("The Sweet Spot")).toBeVisible();
    await expect(
      page.getByText("Golgi Apparatus and Protein Sorting")
    ).toBeVisible();

    // Launch Interactive Course Player
    await page.getByText("The Sweet Spot").click();
    await expect(page).toHaveURL(/\/course\/science\/how-things-work-1\/learn/);

    // Dismiss Enable Audio modal
    await expect(page.getByRole("dialog", { name: "Enable Audio" })).toBeVisible();
    await page.getByRole("button", { name: "Enable Audio" }).click();

    // Verify Interactive Simulation Canvas, blocks, Settings popover, and Ask Tutor drawer
    await expect(
      page.getByText("Interactive Simulation Canvas")
    ).toBeVisible();
    await page.getByRole("button", { name: /Next Block/i }).click();
    await expect(page.getByText("Progress: 2 / 6")).toBeVisible();

    await page.getByRole("button", { name: /Settings/i }).click();
    await expect(
      page.getByRole("dialog", { name: "Player Settings" })
    ).toBeVisible();

    await page.getByRole("button", { name: /Ask Tutor/i }).click();
    await expect(page.getByLabel("Ask Tutor Drawer")).toBeVisible();

    // Math Curriculum (Algebra 1, Algebra 2, Geometry)
    await page.goto("/course/math");
    await expect(
      page.getByRole("heading", { name: "Math Curriculum" })
    ).toBeVisible();
    await expect(page.getByText("Real Numbers and Sets")).toBeVisible();

    await page.goto("/course/math/algebra-2");
    await expect(
      page.getByRole("heading", { name: "Algebra 2" })
    ).toBeVisible();

    await page.goto("/course/math/geometry");
    await expect(
      page.getByRole("heading", { name: "Geometry", exact: true })
    ).toBeVisible();

    // History Signature
    await page.goto("/course/history");
    await expect(
      page.getByRole("heading", { name: "History Signature" })
    ).toBeVisible();
    await expect(page.getByText("Smoke, Steam, and Progress")).toBeVisible();

    // Create a Course Modal from My Course
    await page.goto("/course/my");
    await page
      .getByRole("button", { name: /\+ Create a Course/i })
      .first()
      .click();
    const dialog = page.getByRole("dialog", { name: "Create a Course" });
    await expect(dialog).toBeVisible();
    await dialog
      .getByPlaceholder("Enter a topic you want to learn...")
      .fill("Fouriers Law of Heat Conduction");
    await dialog
      .getByRole("button", { name: "Generate Interactive Course" })
      .click();
    await expect(page).toHaveURL(/\/course\/my\/.*\/learn/);
    // Verify persisted CustomCourse title is rendered without the random timestamp slug suffix
    await expect(
      page.getByText("Fouriers Law of Heat Conduction").first()
    ).toBeVisible();
  });

  test("3. Gauth Atlas: Popular Stories, Interactive AP US History World Map (106 POIs), and Silk Roads Session", async ({
    page,
  }) => {
    await page.goto("/atlas");
    await expect(
      page.getByRole("heading", {
        name: "Everything turns clear when you see it",
      })
    ).toBeVisible();
    await expect(page.getByText("Apollo 11 Moon Mission Journey")).toBeVisible();
    await expect(page.getByText("Empires of the Silk Roads")).toBeVisible();

    // Generate a custom Atlas story and verify persisted title is rendered (not a raw CUID)
    await page
      .getByPlaceholder(/Enter any topic to explore visually/i)
      .fill("The Meiji Restoration Industrialization");
    await page.getByRole("button", { name: /Explore Visually/i }).click();
    await expect(page).toHaveURL(/\/atlas\/session\//);
    await expect(
      page.getByRole("heading", {
        name: "The Meiji Restoration Industrialization",
        exact: true,
      })
    ).toBeVisible();

    // Open Empires of the Silk Roads session (/atlas/session/2008824210280452)
    await page.goto("/atlas/session/2008824210280452");
    await expect(
      page.getByRole("heading", { name: "Empires of the Silk Roads" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Crucible's Breath" })
    ).toBeVisible();

    // Switch to Details mode and verify all 4 Silk Road chapters
    await page.getByRole("button", { name: "Details", exact: true }).click();
    await expect(page.getByText("Alchemy of Cobalt")).toBeVisible();
    await expect(page.getByText("The Vitrification Shield")).toBeVisible();
    await expect(page.getByText("A Legacy of Permanence")).toBeVisible();

    // Open 16-language Generate Video popover
    await page.getByRole("button", { name: /Generate Video/i }).click();
    await expect(
      page.getByRole("dialog", { name: "Generate Video Voiceover Language" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Japanese" }).click();
    await page.getByRole("button", { name: "Generate in Japanese" }).click();
    await expect(page.getByText(/generated in Japanese/i)).toBeVisible();

    // Interactive AP US History World Map (/atlas/world_map)
    await page.goto("/atlas/world_map");
    await expect(
      page.getByRole("heading", { name: "Interactive AP US History Map" })
    ).toBeVisible();
    await expect(page.getByText("Featured (106)")).toBeVisible();
    await expect(page.getByText("Compromise of 1877").first()).toBeVisible();
  });

  test("4. Resources, Gauth PLUS, Mobile Responsive Layout, and Invite-Only Admission Flow", async ({
    page,
  }) => {
    // Healthcheck endpoint verification
    const healthRes = await page.request.get("/api/health");
    expect(healthRes.status()).toBe(200);
    const healthJson = await healthRes.json();
    expect(healthJson.status).toBe("ok");
    expect(healthJson.database).toBe("connected");

    // Malformed JSON request body returns 400 Bad Request (not 500)
    const badJsonRes = await page.request.fetch("/api/auth/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: Buffer.from("{malformed"),
    });
    expect(badJsonRes.status()).toBe(400);

    // Unknown blog slug returns 404 NotFoundPage
    const notFoundBlogRes = await page.goto("/blog/non-existent-slug-404");
    expect(notFoundBlogRes?.status()).toBe(404);

    // Resources & Legal routes
    for (const route of [
      "/news",
      "/blog",
      "/trust-center",
      "/plus",
      "/download",
      "/aboutus",
      "/honor",
      "/policy",
      "/terms",
      "/writing-examples",
    ]) {
      const resp = await page.goto(route);
      expect(resp?.status()).toBe(200);
    }

    // Mobile Responsive Check (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByText("Gauth Academy", { exact: true })
    ).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Invite-Only Admission & RBAC E2E Flow
    await prisma.auditLog.deleteMany({});
    await prisma.invitation.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});

    // Verify /auth/signin has no public sign-up and no demo accounts
    await page.goto("/auth/signin");
    await expect(page.getByText(/Invite-Only Access/i).first()).toBeVisible();

    // Bootstrap CLI Admin
    await bootstrapAdmin({
      email: "admin.e2e@gauth.example.com",
      password: "AdminE2EPassword!2026",
      name: "E2E Admin",
    });

    // Sign in as Admin
    await page.getByLabel(/Email/i).fill("admin.e2e@gauth.example.com");
    await page.getByLabel(/Password/i).fill("AdminE2EPassword!2026");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // Navigate to Admin Invitations Console
    await page.goto("/admin/invitations");
    await expect(
      page.getByRole("heading", {
        name: /Gauth Admin — Invite-Only Admission, RBAC & Audit Console/i,
      })
    ).toBeVisible();

    // Issue an invitation via API while authenticated as Admin
    const createInviteRes = await page.request.post("/api/admin/invitations", {
      data: {
        email: "invited.scholar@gauth.example.com",
        role: "Creator",
        expiresInHours: 72,
      },
    });
    expect(createInviteRes.status()).toBe(201);
    const inviteJson = await createInviteRes.json();
    expect(inviteJson.invitePath).toContain("/invite/");

    // Sign out Admin and redeem the single-use invitation link
    await page.request.delete("/api/auth/credentials");
    await page.goto(inviteJson.invitePath);
    await expect(
      page.getByRole("heading", { name: "Accept Your Invitation" })
    ).toBeVisible();

    await page.getByLabel(/Full Name/i).fill("Invited Scholar");
    await page.getByLabel(/Create Password/i).fill("ScholarE2E!2026");
    await page.getByRole("button", { name: /Activate Gauth Account/i }).click();

    await expect(page).toHaveURL("/");

    // Sign back in as Admin and issue a Viewer invitation to verify 403 RBAC enforcement
    await page.request.delete("/api/auth/credentials");
    await page.request.post("/api/auth/credentials", {
      data: {
        email: "admin.e2e@gauth.example.com",
        password: "AdminE2EPassword!2026",
      },
    });
    const viewerInviteRes = await page.request.post("/api/admin/invitations", {
      data: {
        email: "viewer.only@gauth.example.com",
        role: "Viewer",
        expiresInHours: 24,
      },
    });
    expect(viewerInviteRes.status()).toBe(201);
    const viewerInviteJson = await viewerInviteRes.json();

    await page.request.delete("/api/auth/credentials");
    const acceptViewerRes = await page.request.post(
      `/api/invitations/${viewerInviteJson.rawToken}/accept`,
      {
        data: {
          email: "viewer.only@gauth.example.com",
          name: "Read Only Viewer",
          password: "ViewerPassword!2026",
        },
      }
    );
    expect(acceptViewerRes.status()).toBe(201);

    // Verify Viewer gets 403 Forbidden on mutation endpoints
    const viewerCourseRes = await page.request.post("/api/courses", {
      data: { prompt: "Unauthorized Viewer Course" },
    });
    expect(viewerCourseRes.status()).toBe(403);

    const viewerAtlasRes = await page.request.post("/api/atlas/sessions", {
      data: { prompt: "Unauthorized Viewer Story" },
    });
    expect(viewerAtlasRes.status()).toBe(403);

    const viewerPoiRes = await page.request.post("/api/atlas/pois", {
      data: { title: "Unauthorized Viewer POI" },
    });
    expect(viewerPoiRes.status()).toBe(403);

    const viewerPlusRes = await page.request.post("/api/plus/subscribe", {
      data: { plan: "annual" },
    });
    expect(viewerPlusRes.status()).toBe(403);

    // Clean up test DB state so zero pre-seeded demo users or test records remain
    await prisma.homeworkQuestion.deleteMany({});
    await prisma.customCourse.deleteMany({});
    await prisma.atlasSessionRecord.deleteMany({});
    await prisma.customWorldMapPoi.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.invitation.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
  });
});
