import { test, expect } from "@playwright/test";
import { learningTasks } from "../src/content/learning";
test("Sommaires des six guides approfondis reliés aux étapes affichées", async ({ page }) => {
  for (const task of learningTasks) {
    await page.goto(`/guides/${task.guide}`);
    const links = page.locator('.detail-aside a[href*="#section-"]');
    await expect(links).toHaveCount(task.steps.length + 2);
    for (let i = 0; i < task.steps.length + 2; i++) {
      const heading = page.locator(`#section-${i}`);
      await expect(heading).toHaveCount(1);
      await links.nth(i).click();
      await expect(heading).toBeInViewport();
    }
  }
  await page.goto('/blog/documents-accessibles');
  await expect(page.getByRole('heading', { name: '2. Décrire les images utiles', exact: true })).toBeVisible();
});
test("T01–T04 recherche, contexte et protection des notes", async ({
  page,
}) => {
  for (const q of [
    "copier un fichier",
    "copier des fichiers",
    "copier fichier",
    "copier fichierr",
  ]) {
    await page.goto("/guides?q=" + encodeURIComponent(q));
    await expect(page.locator(".content-card").first()).toContainText("Copier");
  }
  await page.goto("/guides?categorie=Excel&duree=6&q=filtre");
  await page.locator(".content-card a").first().click();
  await page.getByRole("link", { name: /Retour aux tutoriels/ }).click();
  await expect(page).toHaveURL(/categorie=Excel/);
  await expect(page).toHaveURL(/duree=6/);
  await expect(page.getByRole("searchbox")).toHaveValue("filtre");
  await page.goto("/studio");
  await page.getByRole("tab", { name: "Notes manuelles" }).click();
  await page
    .getByLabel("Votre compte rendu de travail")
    .fill("Note non exportée.");
  let confirmations = 0;
  page.on("dialog", async (d) => {
    confirmations++;
    await d.dismiss();
  });
  await page
    .getByRole("link", { name: "Blog", exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.getByLabel("Votre compte rendu de travail")).toHaveValue(
    "Note non exportée.",
  );
  await page
    .getByRole("button", { name: "Effacer la session", exact: true })
    .click();
  await expect(page.getByLabel("Votre compte rendu de travail")).toHaveValue(
    "Note non exportée.",
  );
  expect(confirmations).toBe(2);
});
test("T05 six laboratoires : erreur puis réussite", async ({ page }) => {
  for (const task of learningTasks) {
    await page.goto("/guides/" + task.guide);
    const lab = page.locator(".practice-lab");
    await lab.getByRole("button", { name: "Vérifier ma réponse" }).click();
    await expect(lab.getByRole("status").last()).toContainText("À revoir");
    if (task.kind === "files") {
      await lab
        .getByRole("button", { name: "Courrier.docx", exact: true })
        .click();
      await lab.getByRole("button", { name: "Copier", exact: true }).click();
      await lab.getByRole("button", { name: "Coller dans Archives" }).click();
    } else if (task.kind === "excel")
      await lab.getByLabel("Statut affiché").selectOption("En cours");
    else {
      const value =
        task.kind === "word"
          ? "objet"
          : task.kind === "mail"
            ? "regle"
            : task.kind === "shortcuts"
              ? "Windows + Maj + S"
              : "confirme";
      await lab.locator(`input[value="${value}"]`).check();
    }
    await lab.getByRole("button", { name: "Vérifier ma réponse" }).click();
    await expect(lab.getByRole("status").last()).toContainText("Réussi");
    await lab.getByRole("button", { name: "Recommencer", exact: true }).click();
    await expect(lab.getByRole("status").last()).toHaveText("");
  }
});
test("T07 constructeur, édition et copie sans API", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const external: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") external.push(r.url());
  });
  await page.goto("/atelier");
  await page
    .getByLabel("Format attendu", { exact: true })
    .fill("Tableau de validation sourcé");
  await expect(page.getByLabel("Votre prompt complet")).toHaveValue(
    /Tableau de validation sourcé/,
  );
  await page
    .getByLabel("Votre prompt complet")
    .fill("Consigne modifiée volontairement.");
  await page
    .getByRole("button", { name: "Copier et utiliser dans un outil autorisé" })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("Consigne modifiée volontairement.");
  expect(external).toEqual([]);
});
test("T06 YouTube opt-in, repli et hors ligne", async ({ page, context }) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (/youtube|ytimg/.test(r.url())) calls.push(r.url());
  });
  await page.goto("/videos");
  await expect(page.locator(".video-card").first()).toBeVisible();
  expect(calls).toEqual([]);
  const first = page.locator(".video-card").first();
  await page.route("**/i.ytimg.com/**", (r) => r.abort());
  await first
    .getByRole("button", { name: "Autoriser l’aperçu YouTube" })
    .click();
  await expect(first.getByRole("alert")).toBeVisible();
  await context.setOffline(true);
  await expect(first.getByRole("status")).toContainText("Internet requis");
  await context.setOffline(false);
});
test("T08 parcours métier, publipostage et blog", async ({ page }) => {
  await page.goto("/parcours/publipostage");
  await page.getByLabel("Destinataire", { exact: true }).selectOption("5");
  await expect(page.locator(".text-preview")).toContainText("Contact Démo 6");
  const lab = page.locator(".practice-lab");
  await lab.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(lab.getByRole("status")).toContainText("À revoir");
  await lab.locator('input[value="controle"]').check();
  await lab.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(lab.getByRole("status")).toContainText("Réussi");
  await page.goto("/blog/ia-confidentialite");
  await expect(page.locator(".article-case .practice-lab")).toBeVisible();
  await page
    .getByRole("link", { name: "Suivre la procédure associée" })
    .click();
  await expect(page).toHaveURL(/transcription-compte-rendu/);
});
