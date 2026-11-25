import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from 'node:fs';
const cases = JSON.parse(fs.readFileSync('src/content/businessCases.json','utf8')) as Array<{slug:string;kind:string;files:string[][]}>;
test("Cinq cas métier : erreur, manipulation, correction, remise à zéro et fichiers", async ({
  page,
  request,
}) => {
  for (const lesson of cases) {
    await page.goto("/guides/" + lesson.slug);
    const lab = page.getByRole("region", { name: "Laboratoire métier" });
    const verify = lab.getByRole("button", { name: /Vérifier/ });
    await verify.click();
    await expect(lab.getByRole("status").last()).toContainText("À revoir");
    if (lesson.kind === "formulas") {
      await lab.getByLabel("Statut retenu").selectOption("À payer");
      await lab.getByLabel("Code fournisseur").selectOption("F999");
      await expect(lab.locator(".business-output")).toContainText(
        "code absent",
      );
      await lab.getByLabel("Code fournisseur").selectOption("F003");
      await lab.getByLabel("Introduire un doublon").check();
      await expect(lab.locator(".business-output")).toContainText("Ambigu");
      await lab.getByLabel("Introduire un doublon").uncheck();
    } else if (lesson.kind === "pivot") {
      await lab.getByLabel("Champ en lignes").selectOption("service");
      await lab.getByLabel("Valeur calculée").selectOption("sum");
      await lab
        .getByRole("button", { name: "Ajouter une facture de 100 €" })
        .click();
      await expect(lab.locator("tfoot")).toContainText("7 500");
      await lab.getByRole("button", { name: "Actualiser le TCD" }).click();
      await expect(lab.locator("tfoot")).toContainText("7 600");
    } else if (lesson.kind === "report") {
      await lab.getByLabel("Style du chapitre").selectOption("h1");
      await lab.getByLabel("Style du sous-titre").selectOption("h2");
      await lab.getByLabel("Rupture avant").selectOption("section");
      await lab.getByLabel("Passer l’annexe").check();
      await expect(lab.locator(".business-output")).toContainText(
        "Corps : portrait",
      );
    } else if (lesson.kind === "slides") {
      await lab
        .getByRole("button", { name: "Monter Chiffres vérifiés", exact: true })
        .click();
      await lab
        .getByRole("button", { name: "Monter Chiffres vérifiés", exact: true })
        .click();
      await lab.getByLabel("Afficher la vue destinée au public").check();
      await expect(
        lab.getByText("Notes orateur fictives :", { exact: false }),
      ).toHaveCount(0);
    } else {
      await lab.getByLabel("Condition de la règle").selectOption("suppliers");
      await lab.getByLabel("Action de la règle").selectOption("move");
      await lab
        .getByRole("button", { name: "Appliquer dans la simulation" })
        .click();
      await lab
        .getByLabel("Valider le dossier avant 16 h", { exact: false })
        .check();
      await lab
        .getByLabel("Réunion déplacée : vérifier le créneau", { exact: false })
        .check();
    }
    await verify.click();
    await expect(lab.getByRole("status").last()).toContainText("Réussi");
    await lab
      .getByRole("button", { name: "Recommencer le laboratoire" })
      .click();
    await expect(lab.getByRole("status").last()).toHaveText("");
    await verify.click();
    await expect(lab.getByRole("status").last()).toContainText("À revoir");
    const toc = page.locator('.detail-aside a[href*="#section-"]');
    await expect(toc).toHaveCount(9);
    await toc.last().click();
    await expect(page.locator("#section-8")).toBeInViewport();
    for (const [file] of lesson.files) {
      const response = await request.get("/assets/metier/" + file);
      expect(response.ok()).toBe(true);
      expect((await response.body()).length).toBeGreaterThan(100);
    }
  }
});
test("Vidéos courtes, langues, recherche vide et bibliothèque éditoriale", async ({
  page,
}) => {
  await page.goto("/videos");
  await expect(page.locator(".video-card")).toHaveCount(5);
  await page.getByLabel("Durée des vidéos").selectOption("micro");
  await expect(page.locator(".video-card")).toHaveCount(2);
  await page.getByLabel("Langue vidéo").selectOption("all");
  await expect(page.locator(".video-card")).toHaveCount(3);
  await page.getByLabel("Durée des vidéos").selectOption("all");
  await expect(page.locator(".video-card")).toHaveCount(9);
  await page.getByLabel("Rechercher une vidéo").fill("aucunevideoxyz");
  await expect(
    page.getByText("Aucune vidéo pour cette recherche."),
  ).toBeVisible();
  await page.goto("/blog");
  await expect(page.locator(".content-card")).toHaveCount(14);
  await page
    .getByRole("button", { name: "Cas pratiques", exact: true })
    .click();
  await expect(page.locator(".content-card")).toHaveCount(3);
  await page.goto("/blog/piece-jointe-douteuse");
  const check = page.getByRole("region", { name: "Mise en situation" });
  await check.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(check.getByRole("status")).toContainText("À revoir");
  await check
    .getByLabel("Confirmer par une coordonnée connue", { exact: false })
    .check();
  await check.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(check.getByRole("status")).toContainText("Réussi");
});
test("Nouveaux laboratoires lisibles en thème sombre, sans chargement du modèle de résumé", async ({
  page,
}) => {
  const external: string[] = [];
  const consoleErrors: string[]=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  page.on("request", (r) => {
    if (/huggingface|cdn-lfs|cas-bridge/.test(r.url())) external.push(r.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem("bureauclair-theme", "dark"),
  );
  for (const lesson of cases) {
    await page.goto("/guides/" + lesson.slug);
    await expect(page.locator(".business-lab")).toBeVisible();
    expect(await page.locator('.resource-actions .button.secondary').first().evaluate(element=>getComputedStyle(element).backgroundColor)).toBe('rgb(48, 43, 59)');
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations.map((v) => ({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await page.goto("/studio");
  await page.locator("#etude-compte-rendu summary").click();
  await expect(page.locator("#etude-compte-rendu")).toContainText("trois");
  expect(external).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
