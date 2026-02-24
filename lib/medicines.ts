export interface Medicine {
  id: number;
  itemCode: string;
  name: string;
  quantity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastIssueDate?: string;
}

export const initialMedicines: Medicine[] = [
  { id: 1, itemCode: "MED-001", name: "Paracetamol 500mg", quantity: 150, price: 2.5, status: "In Stock" },
  { id: 2, itemCode: "MED-002", name: "Amoxicillin 250mg", quantity: 45, price: 8.0, status: "In Stock" },
  { id: 3, itemCode: "MED-003", name: "Ibuprofen 400mg", quantity: 12, price: 3.75, status: "Low Stock" },
  { id: 4, itemCode: "MED-004", name: "Cetirizine 10mg", quantity: 0, price: 4.2, status: "Out of Stock" },
  { id: 5, itemCode: "MED-005", name: "Omeprazole 20mg", quantity: 80, price: 6.5, status: "In Stock" },
  { id: 6, itemCode: "MED-006", name: "Metformin 500mg", quantity: 5, price: 5.0, status: "Low Stock" },
  { id: 7, itemCode: "MED-007", name: "Vitamin C 500mg", quantity: 200, price: 1.8, status: "In Stock" },
  { id: 8, itemCode: "MED-008", name: "Aspirin 100mg", quantity: 3, price: 2.0, status: "Low Stock" },
];

export function deriveStatus(quantity: number): Medicine["status"] {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= 10) return "Low Stock";
  return "In Stock";
}
