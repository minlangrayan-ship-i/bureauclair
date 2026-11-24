import { describe, expect, it } from "vitest";
import { guides, articles, search, normalize } from "../src/lib/content";
import { prompts } from "../src/content/prompts";
import { timecode, validateFile } from "../src/lib/audio";
describe("Recherche de tâches", () => {
  it("comprend une tâche avec accents et mots courants", () =>
    expect(search(guides, "Je veux déplacer un fichier")[0].slug).toBe(
      "copier-un-fichier",
    ));
  it("renvoie la copie de fichier en premier", () =>
    expect(search(guides, "copier un fichier")[0].slug).toBe(
      "copier-un-fichier",
    ));
  it("ne fabrique pas de résultat", () =>
    expect(search(guides, "sous-marin introuvable")).toEqual([]));
  it("retrouve le compte rendu", () =>
    expect(search(prompts, "compte rendu")[0].slug).toBe("compte-rendu"));
  it("normalise les accents", () =>
    expect(normalize("Échéances !")).toBe("echeances"));
});
describe("Corpus initial et sources", () => {
  it("comprend les catégories demandées", () =>
    expect(new Set(guides.map((g) => g.category))).toEqual(
      new Set([
        "Windows 11",
        "Windows 10",
        "Word",
        "Excel",
        "Outlook",
        "PowerPoint",
        "PDF",
      ]),
    ));
  it("contient les contenus prévus sans doublons", () => {
    expect(guides.length).toBeGreaterThanOrEqual(15);
    expect(prompts).toHaveLength(20);
    expect(articles).toHaveLength(6);
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
  });
  it("rend les sources et limites contrôlables", () => {
    for (const item of [...guides, ...articles]) {
      expect(item.source).toMatch(/^https:\/\//);
      expect(item.updated).toBe("2026-11-24");
      expect(item.author).toBeTruthy();
      expect(item.version).toBeTruthy();
      expect(item.body).toContain("##");
    }
  });
});
describe("Validation audio", () => {
  it("rejette format, fichier vide et taille abusive", () => {
    expect(
      validateFile({
        name: "x.exe",
        size: 100,
        type: "application/x-msdownload",
      }),
    ).not.toBe("");
    expect(
      validateFile({ name: "x.wav", size: 0, type: "audio/wav" }),
    ).not.toBe("");
    expect(
      validateFile({
        name: "x.wav",
        size: 51 * 1024 * 1024,
        type: "audio/wav",
      }),
    ).toContain("50 Mo");
  });
  it("accepte les formats proposés sans présumer du codec", () =>
    expect(validateFile({ name: "x.m4a", size: 100, type: "audio/mp4" })).toBe(
      "",
    ));
  it("produit les repères temporels", () =>
    expect(timecode(125.7)).toBe("02:05"));
});
