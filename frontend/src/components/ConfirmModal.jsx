import React from "react";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-zinc-700 w-[90%] max-w-md animate-fadeIn">
        
        {/*  Title */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 tracking-wide">
          {title}
        </h2>

        {/*  Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        {/*  Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold shadow"
          >
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
