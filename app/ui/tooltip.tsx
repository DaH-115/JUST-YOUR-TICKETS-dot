export default function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="invisible absolute bottom-full right-0 z-[100] mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100">
      {children}
    </div>
  );
}
