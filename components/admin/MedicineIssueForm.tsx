"use client";

import { useState, useMemo } from "react";
import { Medicine, deriveStatus } from "@/lib/medicines";
import { useMedicines } from "@/context/MedicineContext";

const STATUS_STYLES: Record<Medicine["status"], string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function MedicineIssueForm() {
  const { medicines: drugs, setMedicines: setDrugs } = useMedicines();
  const [filter, setFilter] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("");
  const [drugSearch, setDrugSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [addQuantity, setAddQuantity] = useState<number>(0);
  const [lastIssuedDrug, setLastIssuedDrug] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- derived ---
  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    const list = drugs.filter((d) => d.name.toLowerCase().includes(q));
    if (!lastIssuedDrug) return list;
    return list.sort((a, b) => (b.name === lastIssuedDrug ? 1 : 0) - (a.name === lastIssuedDrug ? 1 : 0));
  }, [drugs, filter, lastIssuedDrug]);

  const drugDropdown = useMemo(() => {
    if (!drugSearch) return drugs;
    const q = drugSearch.toLowerCase();
    return drugs.filter((d) => d.name.toLowerCase().includes(q));
  }, [drugs, drugSearch]);

  const selectedDrugData = drugs.find((d) => d.name === selectedDrug);
  const stockError =
    selectedDrugData?.quantity === 0
      ? "This drug is out of stock."
      : selectedDrugData && addQuantity > selectedDrugData.quantity
      ? `Only ${selectedDrugData.quantity} available.`
      : null;

  // --- handlers ---
  const handleAdd = () => {
    if (!selectedDrug || addQuantity <= 0) return;

    const drug = drugs.find((d) => d.name === selectedDrug);
    if (!drug || addQuantity > drug.quantity) return;

    setDrugs((prev) =>
      prev.map((d) => {
        if (d.name === selectedDrug) {
          const newQty = d.quantity - addQuantity;
          return {
            ...d,
            quantity: newQty,
            status: deriveStatus(newQty),
            lastIssueDate: new Date().toISOString()
          };
        }
        return d;
      })
    );

    setLastIssuedDrug(selectedDrug);
    setSuccessMessage(`${selectedDrug} - ${addQuantity} units issued successfully!`);
    setSelectedDrug("");
    setDrugSearch("");
    setAddQuantity(0);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-800">Medicine</h3>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            {successMessage}
          </p>
        </div>
      )}

      {/* Add quantity form */}
      <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
        <h4 className="text-base font-semibold text-gray-800 mb-4">Issue Quantity</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">Select Drug</label>
            <div className="relative">
              <input
                type="text"
                autoComplete="off"
                value={selectedDrug || drugSearch}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onChange={(e) => {
                  setSelectedDrug("");
                  setDrugSearch(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search drug..."
              />
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {showDropdown && !selectedDrug && (
              <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md">
                {drugDropdown.length > 0 ? (
                  drugDropdown.map((d) => (
                    <li
                      key={d.id}
                      onMouseDown={() => {
                        setSelectedDrug(d.name);
                        setDrugSearch("");
                        setShowDropdown(false);
                      }}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                    >
                      <span>{d.name}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Qty: {d.quantity}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[d.status]}`}>
                          {d.status}
                        </span>
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-400">No matching drugs</li>
                )}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity to Issue</label>
            <input
              type="number"
              min="1"
              value={addQuantity || ""}
              onChange={(e) => setAddQuantity(Number(e.target.value))}
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-transparent ${
                stockError
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="0"
            />
            {stockError && (
              <p className="mt-1 text-xs text-red-500">{stockError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 col-span-full mt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedDrug("");
                setDrugSearch("");
                setAddQuantity(0);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedDrug || addQuantity <= 0 || !!stockError}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Issue
            </button>
          </div>
        </div>
      </div>

      {/* Filter input */}
      <div className="mb-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Filter drugs by name..."
        />
      </div>

      {/* Drug list table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Item Code</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price (Rs)</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Issue Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr
                key={d.id}
                className={[
                  "transition-colors",
                  d.status !== "In Stock" ? "bg-red-50/50" : "hover:bg-gray-50",
                ].join(" ")}
              >
                <td className="px-4 py-3 text-gray-400 font-mono">{d.id}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{d.itemCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{d.name}</td>
                <td className="px-4 py-3 text-gray-700">{d.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">{d.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[d.status]}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-xs">
                  {d.lastIssueDate
                    ? new Date(d.lastIssueDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No drugs match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
