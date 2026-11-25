/** Base unique : compatible domaine racine et sous-répertoire GitHub Pages. */
export const asset = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\//, "");
