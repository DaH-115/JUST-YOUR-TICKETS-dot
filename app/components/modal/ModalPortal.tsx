"use client";

import { ReactNode } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-11/12 max-w-2xl rounded-2xl bg-white p-4 shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
