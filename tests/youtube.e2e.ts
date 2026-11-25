import { test, expect } from "@playwright/test";

// Contract simulation only: real playback is checked separately against YouTube.
const apiStub = `
window.__youtubeContract={loads:(window.__youtubeContract?.loads||0)+1,players:[],destroyed:0};
window.YT={Player:class {
 constructor(element, options){
  const frame=document.createElement('iframe');
  frame.src=options.host+'/embed/'+options.videoId+'?enablejsapi=1&origin='+encodeURIComponent(options.playerVars.origin);
  element.replaceWith(frame);
  window.__youtubeContract.players.push(options);
  this.destroy=()=>{frame.remove();window.__youtubeContract.destroyed++};
  setTimeout(()=>options.events.onReady(),0);
 }
}};
window.onYouTubeIframeAPIReady();`;

test("YouTube : contrat API, consentement, erreurs et lecteur partagé", async ({
  page,
}) => {
  let apiCalls = 0;
  await page.route("https://www.youtube.com/iframe_api", (route) => {
    apiCalls++;
    return route.fulfill({ contentType: "text/javascript", body: apiStub });
  });
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Lecteur simulé pour le test du contrat API.</p>",
    }),
  );
  await page.route("https://i.ytimg.com/**", (route) =>
    route.fulfill({ status: 204 }),
  );
  await page.goto("/videos");
  await page.getByLabel("Durée des vidéos").selectOption("all");
  await page.getByLabel("Rechercher une vidéo").fill("EXCEL - TRIER");
  const first = page.locator(".video-card").first();
  expect(apiCalls).toBe(0);
  await first
    .getByRole("button", { name: "Autoriser l’aperçu YouTube" })
    .click();
  expect(apiCalls).toBe(0);
  await first
    .getByRole("button", { name: "Lire ici · contenu à valider" })
    .click();
  await expect(first.getByRole("status")).toContainText("Lecteur prêt");
  expect(apiCalls).toBe(1);
  const frame = first.locator("iframe");
  await expect(frame).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/BekWLEcfwfk/,
  );
  await expect(frame).toHaveAttribute(
    "referrerpolicy",
    "strict-origin-when-cross-origin",
  );
  await expect(frame).toHaveAttribute("title", /EXCEL - TRIER/);
  expect((await frame.boundingBox())!.height).toBeGreaterThanOrEqual(200);
  await page.evaluate(
    "window.__youtubeContract.players[0].events.onStateChange({data:1})",
  );
  await expect(first.getByRole("status")).toContainText("Lecture en cours");
  await page.evaluate(
    "window.__youtubeContract.players[0].events.onError({data:101})",
  );
  await expect(first.getByRole("alert")).toContainText("désactivé la lecture");
  await first.getByRole("button", { name: "Réessayer le lecteur" }).click();
  await expect(first.getByRole("status")).toContainText("Lecteur prêt");
  await expect(first.getByRole("alert")).toHaveCount(0);
  await page.evaluate(
    "window.__youtubeContract.players[1].events.onError({data:153})",
  );
  await expect(first.getByRole("alert")).toContainText("identifier le site");
  await page.getByLabel("Rechercher une vidéo").fill("");
  const second = page.locator(".video-card").first();
  await second
    .getByRole("button", { name: "Autoriser l’aperçu YouTube" })
    .click();
  await second
    .getByRole("button", { name: "Lire ici · contenu à valider" })
    .click();
  await expect(second.getByRole("status")).toContainText("Lecteur prêt");
  expect(apiCalls).toBe(1);
});

test("YouTube : échec réseau du script annoncé, sans faux état de lecture", async ({
  page,
}) => {
  await page.route("https://www.youtube.com/iframe_api", (route) =>
    route.abort(),
  );
  await page.route("https://i.ytimg.com/**", (route) =>
    route.fulfill({ status: 204 }),
  );
  await page.goto("/videos");
  const first = page.locator(".video-card").first();
  await first
    .getByRole("button", { name: "Autoriser l’aperçu YouTube" })
    .click();
  await first
    .getByRole("button", { name: "Lire ici · contenu à valider" })
    .click();
  await expect(first.getByRole("alert")).toContainText(
    "service YouTube ne répond pas",
  );
  await expect(first.getByRole("status")).not.toContainText("Lecture en cours");
  await expect(
    first.getByRole("link", { name: "Voir sur YouTube" }),
  ).toBeVisible();
});
