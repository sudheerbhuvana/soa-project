export type Carrier = { carrierId: number; companyName: string; email: string; vesselIdentifier: string };
export type Container = { containerId: number; carrierId: number; weight: number; cargoType: string; currentStatus: string };
export type YardSlot = { slotId: number; zoneCode: string; rowNumber: number; isOccupied: boolean; containerId?: number | null };
export type GateTransaction = { gateTransactionId: number; containerId: number; transactionType: string; truckLicense: string; timestamp: string };
