import { Dialog } from '@headlessui/react'
import { FiX } from 'react-icons/fi'

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                            {title}
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <FiX />
                        </button>
                    </div>
                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}