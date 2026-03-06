import { Dialog } from '@headlessui/react';

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            {/* Panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-gray-800">{title}</Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                    </div>
                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}