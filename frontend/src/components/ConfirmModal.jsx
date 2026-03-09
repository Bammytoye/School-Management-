import { Dialog } from '@headlessui/react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', confirmClass = 'btn-danger', loading = false }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700">

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>

                    <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                        {title || 'Are you sure?'}
                    </Dialog.Title>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-6">
                        {message || 'This action cannot be undone.'}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`${confirmClass} flex-1`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : confirmLabel}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}