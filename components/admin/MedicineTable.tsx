"use client";

import React, { useState } from "react";
import { Medicine } from "@/lib/medicines";
import { useMedicines } from "@/context/MedicineContext";

interface FormData {
  itemCode: string;
  name: string;
}

const STATUS_STYLES: Record<Medicine["status"], string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function MedicineTable() {
  const { medicines, setMedicines } = useMedicines();
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState<FormData>({ itemCode: "", name: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Medicine | null>(null);
  const [editConfirm, setEditConfirm] = useState<Medicine | null>(null);

  // --- handlers ---
  const openEdit = (medicine: Medicine) => {
    setEditConfirm(medicine);
  };

  const confirmEdit = () => {
    if (!editConfirm) return;
    setEditing(editConfirm);
    setForm({
      itemCode: editConfirm.itemCode,
      name: editConfirm.name,
    });
    setErrorMessage("");
    setEditConfirm(null);
  };

  const cancelEdit = () => {
    setEditConfirm(null);
  };

  const handleDelete = (id: number) => {
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) return;
    setDeleteConfirm(medicine);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setMedicines((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
    setDeleteConfirm(null);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous error
    setErrorMessage("");

    if (editing) {
      // Check if item code is unique (excluding current medicine being edited)
      const isDuplicate = medicines.some(
        (m) => m.itemCode === form.itemCode && m.id !== editing.id
      );

      if (isDuplicate) {
        setErrorMessage("Item code already exists! Please use a unique item code.");
        return;
      }

      setMedicines((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...form } : m))
      );
      setShowEditSuccess(true);
      setTimeout(() => setShowEditSuccess(false), 3000);
    } else {
      // Check if item code is unique for new medicine
      const isDuplicate = medicines.some((m) => m.itemCode === form.itemCode);

      if (isDuplicate) {
        setErrorMessage("Item code already exists! Please use a unique item code.");
        return;
      }

      const newId = Math.max(...medicines.map((m) => m.id), 0) + 1;
      setMedicines((prev) => [{ id: newId, ...form, quantity: 0, price: 0, status: "Out of Stock" as const }, ...prev]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setEditing(null);
    setForm({ itemCode: "", name: "" });
  };

  const updateForm = (key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // --- render ---
  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-800">Medicines</h3>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Drug was added successfully!
          </p>
        </div>
      )}

      {/* Edit Success Alert */}
      {showEditSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Drug was updated successfully!
          </p>
        </div>
      )}

      {/* Delete Success Alert */}
      {showDeleteSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Drug was deleted successfully!
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Inline form */}
      <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
        <h4 className="text-base font-semibold text-gray-800 mb-4">
          {editing ? "Edit Medicine" : "Add New Medicine"}
        </h4>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Item Code</label>
                <input
                  required
                  type="text"
                  value={form.itemCode}
                  onChange={(e) => updateForm("itemCode", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. MED-001"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. Paracetamol 500mg"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setForm({ itemCode: "", name: "" });
                  setErrorMessage("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editing ? "Save Changes" : "Add Medicine"}
              </button>
            </div>
          </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Item Code</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Price (Rs)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...medicines].sort((a, b) => a.name.localeCompare(b.name)).map((m) => (
              <React.Fragment key={m.id}>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 font-mono">{m.id}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{m.itemCode}</td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.name}</td>
                <td className="px-4 py-3 text-gray-700">{m.quantity}</td>
                <td className="px-4 py-3 text-gray-700">{m.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[m.status]}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openEdit(m)}
                    className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              </React.Fragment>
            ))}

            {medicines.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this medicine? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-24">Item Code:</span>
                  <span className="text-sm font-semibold text-gray-900">{deleteConfirm.itemCode}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-24">Name:</span>
                  <span className="text-sm font-semibold text-gray-900">{deleteConfirm.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Confirmation Modal */}
      {editConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Edit
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Do you want to edit this medicine?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-24">Item Code:</span>
                  <span className="text-sm font-semibold text-gray-900">{editConfirm.itemCode}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 w-24">Name:</span>
                  <span className="text-sm font-semibold text-gray-900">{editConfirm.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
