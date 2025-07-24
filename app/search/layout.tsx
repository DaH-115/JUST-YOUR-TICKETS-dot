import ScrollToTopButton from "app/components/ui/buttons/ScrollToTopButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTopButton />
    </>
  );
}
