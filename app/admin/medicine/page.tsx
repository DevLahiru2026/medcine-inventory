"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MedicineIssueForm from "@/components/admin/MedicineIssueForm";

function MedicinePageContent() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      setShowSuccess(true);
      // Hide the message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="font-medium">Successfully logged in!</span>
        </div>
      )}
      <MedicineIssueForm />
    </>
  );
}

export default function MedicinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MedicinePageContent />
    </Suspense>
  );
}
