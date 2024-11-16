interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
}

export default function ScrollButton({
  targetId,
  children,
}: ScrollButtonProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-white bg-black text-white shadow-md transition-all hover:bg-gray-500 hover:shadow-lg"
    >
      {children}
    </button>
  );
}
