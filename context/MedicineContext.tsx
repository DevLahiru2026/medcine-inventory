"use client";

import { createContext, useContext, useState } from "react";
import { Medicine, initialMedicines } from "@/lib/medicines";

interface MedicineContextType {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

const MedicineContext = createContext<MedicineContextType | null>(null);

export function MedicineProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);

  return (
    <MedicineContext.Provider value={{ medicines, setMedicines }}>
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicines() {
  const context = useContext(MedicineContext);
  if (!context) throw new Error("useMedicines must be used within MedicineProvider");
  return context;
}
