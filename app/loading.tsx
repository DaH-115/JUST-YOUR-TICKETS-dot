export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-accent-300 h-12 w-12 animate-spin rounded-full border-4 border-t-black" />
      </div>
    </div>
  );
}
