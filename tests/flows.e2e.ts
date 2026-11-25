import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const paths = [
  ...fs
    .readdirSync("src/content/guides")
    .map((n) => "/guides/" + n.replace(".md", "")),
  ...fs
    .readdirSync("src/content/articles")
    .map((n) => "/blog/" + n.replace(".md", "")),
  "/",
  "/guides",
  "/atelier",
  "/videos",
  "/exercices",
  "/raccourcis",
  "/competences",
  "/parcours",
  "/parcours/reunion-direction",
  "/parcours/suivi-dossiers",
  "/parcours/publipostage",
  "/prompts",
  "/blog",
  "/outils",
  "/annuaire",
  "/studio",
  "/confidentialite",
  "/accessibilite",
  "/editorial",
  "/a-propos",
  "/recherche?q=copier+un+fichier",
  "/n-existe-pas",
];
test("routes, responsive, accessibilité automatique et console", async ({
  page,
}, info) => {
  test.setTimeout(360000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const checks = [];
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(
      (await page.locator("h1").textContent()) + " — BureauClair",
    );
    await expect(page.locator("body")).not.toContainText(
      "Cette page n’a pas pu s’afficher",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      path,
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    checks.push({ path, violations: axe.violations });
  }
  fs.mkdirSync("docs/qa", { recursive: true });
  fs.writeFileSync(
    `docs/qa/axe-${info.project.name}.json`,
    JSON.stringify(checks, null, 2),
  );
  expect(errors).toEqual([]);
  expect(
    checks.flatMap((c) =>
      c.violations.map((v) => `${c.path}: ${v.id} (${v.nodes.length})`),
    ),
  ).toEqual([]);
});

test("saisie continue, recherche locale, impression et aide installation", async ({
  page,
}) => {
  await page.addInitScript(() =>
    window.addEventListener(
      "beforeinstallprompt",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      { capture: true },
    ),
  );
  await page.goto("/guides");
  const input = page.getByRole("searchbox");
  await input.pressSequentially("tableau", { delay: 30 });
  await expect(input).toHaveValue("tableau");
  await expect(input).toBeFocused();
  await page.goto("/");
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.getByRole("searchbox").fill("copier un fichier");
  await page.getByRole("button", { name: /Rechercher/ }).click();
  expect(urls.filter((u) => new URL(u).searchParams.has("q"))).toEqual([]);
  await page.goto("/guides/copier-un-fichier");
  await page.evaluate(() => {
    (window as unknown as { printed: boolean }).printed = false;
    window.print = () => {
      (window as unknown as { printed: boolean }).printed = true;
    };
  });
  await page.getByRole("button", { name: "Imprimer", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { printed: boolean }).printed,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Marquer comme lu", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Lecture terminée", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/");
  await page.getByRole("button", { name: /Installer/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Compris" }).click();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});
test("recherche, filtres, absence de résultat et retour conservé", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("copier un fichier");
  await page.getByRole("button", { name: /Rechercher/ }).click();
  await page
    .getByRole("heading", {
      name: "Copier, déplacer et retrouver un fichier",
      exact: true,
    })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Copier, déplacer et retrouver un fichier",
  );
  await expect(
    page.getByRole("heading", { name: "Repérer le document" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/q=copier/);
  await page.goto("/guides");
  await page.getByRole("button", { name: "Excel", exact: true }).click();
  await expect(page.locator(".content-card")).toHaveCount(6);
  await page.getByLabel("Durée").selectOption("4");
  await expect(page.locator(".content-card")).toHaveCount(3);
  await page.getByRole("searchbox").fill("introuvablexyz");
  await expect(
    page.getByRole("heading", { name: "Aucun résultat pour cette recherche" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Effacer la recherche et les filtres" })
    .click();
  await expect(page.locator(".content-card")).toHaveCount(
    fs.readdirSync("src/content/guides").length,
  );
});
test("personnalisation et copie avec repli sans presse-papiers", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    }),
  );
  await page.goto("/prompts");
  await page
    .getByRole("button", { name: /Adapter ce prompt/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Votre objectif et contexte non sensible")
    .fill("Préparer une réunion de suivi de 30 minutes.");
  await dialog
    .getByLabel("Ton", { exact: true })
    .selectOption("simple et direct");
  await expect(dialog.getByLabel("Votre prompt prêt à relire")).toHaveValue(
    /30 minutes/,
  );
  await dialog.getByRole("button", { name: "Copier mon prompt" }).click();
  await expect(dialog.getByLabel("Texte à copier manuellement")).toHaveValue(
    /simple et direct/,
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
test("annuaire et téléchargements réels", async ({ page }) => {
  await page.goto("/annuaire");
  await page.getByLabel("Options avec usage local").check();
  await expect(page.locator(".tool-card")).toHaveCount(5);
  await page.getByRole("searchbox").fill("Buzz");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /site officiel/ }),
  ).toHaveAttribute("href", "https://github.com/chidiwilliams/buzz");
  await page.goto("/outils");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger la trame" }).click();
  expect((await download).suggestedFilename()).toContain(".txt");
});
test("navigation et captures", async ({ page }, info) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  if (info.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Navigation principale" })
        .getByRole("link", { name: "Annuaire" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Annuaire" })
      .click();
    await expect(page).toHaveURL(/annuaire/);
  }
  await page.goto("/");
  await page.waitForTimeout(800);
  await page.screenshot({
    path: `docs/qa/home-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/studio");
  await page.screenshot({
    path: `docs/qa/studio-${info.project.name}.png`,
    fullPage: true,
  });
});
test("studio : aucun téléchargement automatique, fichier invalide, annulation", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/studio");
  await expect(
    page.getByRole("button", { name: "Charger le moteur local" }),
  ).toBeDisabled();
  expect(requests.filter((u) => u.includes("huggingface.co"))).toEqual([]);
  await page.locator("#audio-file").setInputFiles({
    name: "faux.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("not audio"),
  });
  await expect(page.getByRole("alert")).toContainText("Format non proposé");
  await page.getByRole("checkbox").check();
  await page.route("https://huggingface.co/**", async (route) => {
    await new Promise((r) => setTimeout(r, 3000));
    await route.abort();
  });
  await page.getByRole("button", { name: "Charger le moteur local" }).click();
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Opération annulée");
  await expect(
    page.getByRole("button", { name: "Charger le moteur local" }),
  ).toBeEnabled();
});
