import ScrollToTopBtn from "app/components/ui/buttons/ScrollToTopBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTopBtn />
    </>
  );
}
