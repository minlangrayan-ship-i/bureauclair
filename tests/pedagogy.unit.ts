import { describe, it, expect } from "vitest";
import { filterDossiers, dossiers } from "../src/components/PracticeLab";
import { expertPrompts, buildExpertPrompt } from "../src/content/expertPrompts";
import { learningTasks } from "../src/content/learning";
import { shortcuts } from "../src/content/shortcuts";
import { videos } from "../src/content/videos";
describe("Données pédagogiques et résultats attendus", () => {
  it("conserve 80 dossiers et trouve exactement 40 en cours", () => {
    expect(dossiers).toHaveLength(80);
    expect(filterDossiers("En cours")).toHaveLength(40);
    expect(new Set(dossiers.map((d) => d.id)).size).toBe(80);
  });
  it("six tâches distinctes possèdent un exercice et quatre étapes", () => {
    expect(learningTasks).toHaveLength(6);
    expect(new Set(learningTasks.map((t) => t.kind)).size).toBe(6);
    for (const t of learningTasks)
      expect(t.steps.length).toBeGreaterThanOrEqual(4);
  });
  it("douze prompts spécifiques incluent données, risque, sortie fictive et source", () => {
    expect(expertPrompts).toHaveLength(12);
    for (const p of expertPrompts) {
      expect(p.exemple_entree_fictive.length).toBeGreaterThan(60);
      expect(p.contraintes.length).toBeGreaterThan(100);
      expect(buildExpertPrompt(p, { format: "MON FORMAT" })).toContain(
        "MON FORMAT",
      );
      expect(buildExpertPrompt(p)).toContain("À confirmer");
    }
  });
  it("raccourcis documentés sans combinaison universelle de gras", () => {
    expect(shortcuts.length).toBeGreaterThan(20);
    for (const s of shortcuts)
      expect(s.source).toContain("support.microsoft.com");
  });
  it("ne prétend pas avoir validé intégralement les vidéos", () => {
    expect(videos.length).toBeGreaterThan(0);
    for (const v of videos) {
      expect(v.id).toMatch(/^[a-zA-Z0-9_-]{11}$/);
      expect(v.duration).toBeGreaterThan(0);
      expect(v.review).toContain("à terminer");
    }
  });
});
