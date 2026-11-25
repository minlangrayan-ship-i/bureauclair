import { describe, it, expect } from "vitest";
import fs from "node:fs";
import {
  invoices,
  invoiceSum,
  pivotInvoices,
} from "../src/content/businessData";
import cases from "../src/content/businessCases.json";
import { articles, guides } from "../src/lib/content";
describe("Contrôles métier contre résultats de référence", () => {
  it("préserve les 24 identifiants et réconcilie les montants du classeur natif", () => {
    expect(new Set(invoices.map((row) => row.id)).size).toBe(24);
    expect(invoiceSum(invoices, "Tous", "Tous")).toBe(7500);
    expect(invoiceSum(invoices, "Achats", "À payer")).toBe(1950);
    expect(
      invoices.filter(
        (row) => row.service === "Achats" && row.status === "À payer",
      ),
    ).toHaveLength(6);
    expect(
      Object.fromEntries(
        pivotInvoices(invoices, "service", "sum").map((x) => [
          x.label,
          x.value,
        ]),
      ),
    ).toEqual({ RH: 2300, Achats: 2500, Support: 2700 });
  });
  it("distingue nombre et montant, et ne modifie pas la source du cache", () => {
    const extended = [
      ...invoices,
      {
        ...invoices[0],
        id: "FAC-025",
        service: "Achats" as const,
        amount: 100,
      },
    ];
    expect(
      pivotInvoices(extended, "service", "sum").find(
        (row) => row.label === "Achats",
      )?.value,
    ).toBe(2600);
    expect(
      pivotInvoices(extended, "service", "count").reduce(
        (s, r) => s + r.value,
        0,
      ),
    ).toBe(25);
    expect(invoices).toHaveLength(24);
    expect(invoiceSum([], "Tous", "Tous")).toBe(0);
  });
  it("relie les cinq guides et leurs vrais fichiers, sans document fantôme", () => {
    expect(cases).toHaveLength(5);
    for (const lesson of cases) {
      expect(guides.some((g) => g.slug === lesson.slug)).toBe(true);
      expect(lesson.steps).toHaveLength(7);
      for (const [file] of lesson.files)
        expect(
          fs.statSync("public/assets/metier/" + file).size,
        ).toBeGreaterThan(100);
      if (lesson.capture)
        expect(
          fs
            .readFileSync("public/assets/metier/" + lesson.capture)
            .subarray(0, 4)
            .toString(),
        ).toBe("%PDF");
    }
  });
  it("conserve les six dossiers initiaux et les huit nouveaux", () => {
    for (const slug of [
      "windows-transition",
      "travail-hors-ligne",
      "transcription-relecture",
      "prompts-precis",
      "ia-confidentialite",
      "documents-accessibles",
    ])
      expect(articles.some((a) => a.slug === slug)).toBe(true);
    expect(
      articles.find((a) => a.slug === "compte-rendu-local-limites")?.body,
    ).toContain("Aucun des trois");
  });
});
