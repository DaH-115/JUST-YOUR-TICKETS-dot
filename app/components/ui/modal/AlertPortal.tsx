"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface AlertProps {
  onConfirm: () => void;
  children: ReactNode;
}

export default function Alert({ onConfirm, children }: AlertProps) {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onConfirm}
        static // AlertPortal handles mount/unmount
      >
        {/* 백드롭: 페이드 인/아웃 */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </TransitionChild>

        {/* 컨텐츠: Scale + fade */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="transition-all duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel>{children}</DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
