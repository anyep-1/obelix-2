"use client";

import { useEffect } from "react";

const ModalSuccess = ({ isOpen, onClose, message = "Berhasil disimpan!" }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-white rounded-lg shadow dark:bg-gray-700 max-w-sm w-full p-5 text-center">
        <svg
          className="mx-auto mb-3 w-12 h-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {message}
        </h3>
      </div>
    </div>
  );
};

export default ModalSuccess;
