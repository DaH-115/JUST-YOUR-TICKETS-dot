"use client";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0" />

      <div className="fixed inset-0 flex items-start justify-center p-2 pt-20 md:items-center md:p-4 md:pt-0">
        <DialogPanel className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-3 shadow-xl transition-all scrollbar-hide data-[closed]:scale-95 data-[closed]:opacity-0 md:w-11/12 md:p-4">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
