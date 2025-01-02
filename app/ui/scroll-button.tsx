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
      className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-md transition-colors duration-300 hover:bg-white hover:text-[#121212] hover:shadow-lg"
    >
      {children}
    </button>
  );
}
