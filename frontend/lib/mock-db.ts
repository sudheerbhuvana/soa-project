// In-memory mock store. Used when backend is down. Persists between requests.
import type { Carrier, Container, YardSlot, GateTransaction } from "./api-types";

const g = globalThis as unknown as { __harborflowMock?: any };

function build(): {
  users: any[]; carriers: Carrier[]; containers: Container[]; slots: YardSlot[]; tx: GateTransaction[];
} {
  const carriers: Carrier[] = [
    { carrierId: 1, companyName: "Maersk Lines", email: "[email protected]", vesselIdentifier: "MAERSK-ALPHA-001" },
    { carrierId: 2, companyName: "MSC Shipping", email: "[email protected]", vesselIdentifier: "MSC-BRAVO-002" },
    { carrierId: 3, companyName: "CMA CGM", email: "[email protected]", vesselIdentifier: "CMA-CGM-CHARLIE-003" },
    { carrierId: 4, companyName: "Hapag-Lloyd", email: "[email protected]", vesselIdentifier: "HL-DELTA-004" },
  ];
  const containers: Container[] = [
    { containerId: 1, carrierId: 1, weight: 18.4, cargoType: "Electronics", currentStatus: "IN_YARD" },
    { containerId: 2, carrierId: 1, weight: 22.0, cargoType: "Apparel", currentStatus: "REGISTERED" },
    { containerId: 3, carrierId: 2, weight: 12.7, cargoType: "Auto parts", currentStatus: "IN_YARD" },
    { containerId: 4, carrierId: 3, weight: 31.5, cargoType: "Chemicals", currentStatus: "LOADED" },
    { containerId: 5, carrierId: 4, weight: 9.2, cargoType: "Food", currentStatus: "REGISTERED" },
  ];
  const slots: YardSlot[] = [];
  for (const z of ["A", "B", "C"]) for (let r = 1; r <= 6; r++) slots.push({ slotId: (slots.length + 1), zoneCode: z, rowNumber: r, isOccupied: false, containerId: null });
  slots[0].isOccupied = true; slots[0].containerId = 1;
  slots[2].isOccupied = true; slots[2].containerId = 3;
  slots[10].isOccupied = true; slots[10].containerId = 4;
  const now = Date.now();
  const tx: GateTransaction[] = [
    { gateTransactionId: 1, containerId: 1, transactionType: "CHECK_IN", truckLicense: "TN-39-AB-1234", timestamp: new Date(now - 45 * 60_000).toISOString() },
    { gateTransactionId: 2, containerId: 3, transactionType: "CHECK_IN", truckLicense: "TN-22-CD-5678", timestamp: new Date(now - 30 * 60_000).toISOString() },
    { gateTransactionId: 3, containerId: 4, transactionType: "CHECK_IN", truckLicense: "KA-01-EF-9012", timestamp: new Date(now - 120 * 60_000).toISOString() },
    { gateTransactionId: 4, containerId: 4, transactionType: "CHECK_OUT", truckLicense: "KA-01-EF-9012", timestamp: new Date(now - 60 * 60_000).toISOString() },
  ];
  return {
    users: [{ email: "admin@harborflow.com", password: "admin123", role: "ADMIN", companyName: "HarborFlow" }],
    carriers, containers, slots, tx,
  };
}

export function getStore() {
  if (!g.__harborflowMock) g.__harborflowMock = build();
  return g.__harborflowMock;
}
