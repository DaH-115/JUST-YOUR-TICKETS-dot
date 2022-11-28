import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const PortalAlert = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>('#portal');
    setMounted(true);
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default PortalAlert;
