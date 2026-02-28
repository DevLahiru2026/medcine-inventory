"use client";

import { useState, useMemo } from "react";
import { Medicine, deriveStatus } from "@/lib/medicines";
import { useMedicines } from "@/context/MedicineContext";

const STATUS_STYLES: Record<Medicine["status"], string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

interface GRNItem {
  id: number;
  drugName: string;
  quantity: number;
  expiryDate: string;
  packSize: number;
  rate: number;
}

export default function MedicineGRNForm() {
  const { medicines: drugs, setMedicines: setDrugs } = useMedicines();
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDateTime, setInvoiceDateTime] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("");
  const [drugSearch, setDrugSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [receiveQuantity, setReceiveQuantity] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [packSize, setPackSize] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [lastReceivedDrug, setLastReceivedDrug] = useState("");
  const [grnItems, setGrnItems] = useState<GRNItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState<GRNItem | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // --- derived ---
  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    const list = drugs.filter((d) => d.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
    if (!lastReceivedDrug) return list;
    return list.sort((a, b) => (b.name === lastReceivedDrug ? 1 : 0) - (a.name === lastReceivedDrug ? 1 : 0));
  }, [drugs, filter, lastReceivedDrug]);

  const drugDropdown = useMemo(() => {
    if (!drugSearch) return [...drugs].sort((a, b) => a.name.localeCompare(b.name));
    const q = drugSearch.toLowerCase();
    return drugs.filter((d) => d.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
  }, [drugs, drugSearch]);

  // --- handlers ---
  const handleAddItem = () => {
    if (!selectedDrug || receiveQuantity <= 0) return;

    if (editingItem) {
      // Update existing item
      setGrnItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, quantity: receiveQuantity, expiryDate, packSize, rate }
            : item
        )
      );
      setEditingItem(null);
    } else {
      // Check if drug already exists in current GRN
      const isDuplicate = grnItems.some((item) => item.drugName === selectedDrug);
      if (isDuplicate) {
        setErrorMessage("This drug is already added to the GRN! Each drug can only be added once per invoice.");
        return;
      }

      const newItem: GRNItem = {
        id: Date.now(),
        drugName: selectedDrug,
        quantity: receiveQuantity,
        expiryDate,
        packSize,
        rate,
      };

      setGrnItems((prev) => [...prev, newItem]);
      setLastReceivedDrug(selectedDrug);
    }

    setSelectedDrug("");
    setDrugSearch("");
    setReceiveQuantity(0);
    setExpiryDate("");
    setPackSize(0);
    setRate(0);
    setErrorMessage("");
  };

  const handleEditItem = (item: GRNItem) => {
    setEditingItem(item);
    setSelectedDrug(item.drugName);
    setReceiveQuantity(item.quantity);
    setExpiryDate(item.expiryDate);
    setPackSize(item.packSize);
    setRate(item.rate);
    setErrorMessage("");
  };

  const handleRemoveItem = (id: number) => {
    setGrnItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
      setSelectedDrug("");
      setDrugSearch("");
      setReceiveQuantity(0);
      setExpiryDate("");
      setPackSize(0);
      setRate(0);
    }
  };

  const handleSubmitGRN = () => {
    if (!invoiceNo || !invoiceDateTime || grnItems.length === 0) return;
    setShowSubmitConfirm(true);
  };

  const confirmSubmitGRN = () => {
    setDrugs((prev) =>
      prev.map((d) => {
        const itemsForDrug = grnItems.filter((item) => item.drugName === d.name);
        if (itemsForDrug.length > 0) {
          const totalQty = itemsForDrug.reduce((sum, item) => sum + item.quantity, 0);
          const newQty = d.quantity + totalQty;
          const totalAmount = itemsForDrug.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
          const avgPrice = totalAmount / totalQty;
          return { ...d, quantity: newQty, price: avgPrice, status: deriveStatus(newQty) };
        }
        return d;
      })
    );

    // Clear everything
    setInvoiceNo("");
    setInvoiceDateTime("");
    setGrnItems([]);
    setSelectedDrug("");
    setDrugSearch("");
    setReceiveQuantity(0);
    setExpiryDate("");
    setPackSize(0);
    setRate(0);
    setErrorMessage("");
    setShowSubmitConfirm(false);
  };

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-800">Medicine GRN</h3>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Receive quantity form */}
      <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        {/* Invoice fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice No</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. INV-2026-001"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Date & Time</label>
            <input
              type="datetime-local"
              value={invoiceDateTime}
              onChange={(e) => setInvoiceDateTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <h4 className="text-base font-semibold text-gray-800 mb-4">
          {editingItem ? "Edit Item" : "Receive Quantity"}
        </h4>

        {/* Select Drug */}
        <div className="relative mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Select Drug</label>
          <div className="relative">
            <input
              type="text"
              autoComplete="off"
              value={selectedDrug || drugSearch}
              disabled={!!editingItem}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onChange={(e) => {
                setSelectedDrug("");
                setDrugSearch(e.target.value);
                setShowDropdown(true);
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                      if (errorMessage) {
                        setErrorMessage("");
                      }
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
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

        {/* Detail fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={receiveQuantity || ""}
              onChange={(e) => setReceiveQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pack Size</label>
            <input
              type="number"
              min="1"
              value={packSize || ""}
              onChange={(e) => setPackSize(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rate ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate || ""}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              setSelectedDrug("");
              setDrugSearch("");
              setReceiveQuantity(0);
              setExpiryDate("");
              setPackSize(0);
              setRate(0);
              setErrorMessage("");
              setEditingItem(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {editingItem ? "Cancel" : "Clear Item"}
          </button>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!selectedDrug || receiveQuantity <= 0}
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editingItem ? "Update Item" : "Add to GRN"}
          </button>
        </div>
      </div>

      {/* GRN Items Table */}
      {grnItems.length > 0 && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-1">
                Invoice ({grnItems.length} items)
              </h4>
              <div className="flex gap-4 text-xs text-gray-600">
                {invoiceNo && (
                  <span>
                    <span className="font-medium">Invoice No:</span> {invoiceNo}
                  </span>
                )}
                {invoiceDateTime && (
                  <span>
                    <span className="font-medium">Date & Time:</span>{" "}
                    {new Date(invoiceDateTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmitGRN}
              disabled={!invoiceNo || !invoiceDateTime}
              className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit GRN
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Item Code</th>
                  <th className="px-4 py-3 font-medium">Drug Name</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Expiry Date</th>
                  <th className="px-4 py-3 font-medium">Pack Size</th>
                  <th className="px-4 py-3 font-medium">Rate (Rs)</th>
                  <th className="px-4 py-3 font-medium">Total (Rs)</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grnItems.map((item) => {
                  const drug = drugs.find((d) => d.name === item.drugName);
                  return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      editingItem?.id === item.id
                        ? "bg-indigo-50 border-l-4 border-indigo-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono">{drug?.id || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{drug?.itemCode || "-"}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.drugName}</td>
                    <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">{item.expiryDate || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{item.packSize || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{item.rate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{(item.rate * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  );
                })}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-gray-800">Total</td>
                  <td className="px-4 py-3 text-gray-800">{grnItems.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-gray-800">{grnItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0).toFixed(2)}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter input */}
      <div className="mb-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No drugs match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submit GRN Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm GRN Submission
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Have you completed adding all products to this invoice? This action will update the inventory.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-32">Invoice No:</span>
                  <span className="text-sm font-semibold text-gray-900">{invoiceNo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-32">Total Items:</span>
                  <span className="text-sm font-semibold text-gray-900">{grnItems.length}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-32">Total Amount:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Rs {grnItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmitGRN}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
