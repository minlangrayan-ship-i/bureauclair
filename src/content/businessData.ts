export const services = ["RH", "Achats", "Support"] as const;
export type Service = (typeof services)[number];
export type Invoice = {
  id: string;
  service: Service;
  status: "Payée" | "À payer";
  amount: number;
  supplier: string;
  due: string;
};
export const invoices: Invoice[] = Array.from({ length: 24 }, (_, i) => ({
  id: `FAC-${String(i + 1).padStart(3, "0")}`,
  service: services[i % 3],
  status: i % 4 === 0 ? "Payée" : "À payer",
  amount: (i + 1) * 25,
  supplier: `F00${(i % 4) + 1}`,
  due: `2026-12-${String(i + 1).padStart(2, "0")}`,
}));
export const suppliers = [
  { code: "F001", name: "Entreprise fictive A" },
  { code: "F002", name: "Entreprise fictive B" },
  { code: "F003", name: "Entreprise fictive C" },
  { code: "F004", name: "Entreprise fictive D" },
];
export function invoiceSum(rows: Invoice[], service: string, status: string) {
  return rows
    .filter(
      (row) =>
        (service === "Tous" || row.service === service) &&
        (status === "Tous" || row.status === status),
    )
    .reduce((total, row) => total + row.amount, 0);
}
export function pivotInvoices(
  rows: Invoice[],
  dimension: "service" | "status",
  operation: "sum" | "count",
) {
  return [...new Set(rows.map((row) => row[dimension]))].map((label) => ({
    label,
    value: rows
      .filter((row) => row[dimension] === label)
      .reduce(
        (value, row) => value + (operation === "sum" ? row.amount : 1),
        0,
      ),
  }));
}
export const presentationOrder = [
  "Objectif",
  "Chiffres vérifiés",
  "Risques",
  "Actions",
  "Sources",
];
export const demoMessages = [
  {
    id: "M1",
    from: "direction@interne.example",
    subject: "Valider le dossier avant 16 h",
    category: "Décision",
    urgent: true,
  },
  {
    id: "M2",
    from: "compta@fournisseurs.example",
    subject: "Facture FAC-002",
    category: "Facture",
    urgent: false,
  },
  {
    id: "M3",
    from: "equipe@interne.example",
    subject: "Compte rendu à relire demain",
    category: "Suivi",
    urgent: false,
  },
  {
    id: "M4",
    from: "lettre@actualites.example",
    subject: "Lettre mensuelle",
    category: "Information",
    urgent: false,
  },
  {
    id: "M5",
    from: "suivi@fournisseurs.example",
    subject: "Pièce complémentaire FAC-005",
    category: "Facture",
    urgent: false,
  },
  {
    id: "M6",
    from: "accueil@interne.example",
    subject: "Réunion déplacée : vérifier le créneau",
    category: "Agenda",
    urgent: true,
  },
];
