"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Redirect to login page
    router.push("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
        {/* Hamburger — visible on mobile only */}
        <button
          className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-gray-800">Medicine Inventory</h2>

        {/* Spacer to push logout button to the right */}
        <div className="flex-1"></div>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
