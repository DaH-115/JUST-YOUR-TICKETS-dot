"use client";

import { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";

interface AlertProps {
  onConfirm: () => void;
  children: ReactNode;
}

export default function Alert({ onConfirm, children }: AlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onConfirm();
    };
    if (mounted) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mounted, onConfirm]);

  if (!mounted) return null;
  const root = document.getElementById("alert-root");
  if (!root) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      {children}
    </div>,
    root,
  );
}
