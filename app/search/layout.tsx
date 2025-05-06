import ScrollToTopBtn from "app/components/ScrollToTopBtn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollToTopBtn />
    </>
  );
}
