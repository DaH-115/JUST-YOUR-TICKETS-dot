"use client";

import { usePathname } from "next/navigation";
import Header from "app/ui/layout/header/Header";
import Footer from "app/ui/layout/Footer";
import LoginHeader from "app/login/components/LoginHeader";
import ScrollToTopBtn from "app/components/ScrollToTopBtn";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/sign-up";

  if (isAuthPage) {
    // 로그인/회원가입 페이지: 전용 헤더 사용, 푸터는 유지, 패딩 없이
    return (
      <>
        <LoginHeader />
        <main className="flex-1">{children}</main>
        <div id="modal-root" />
        <div id="alert-root" />
        <Footer />
        <ScrollToTopBtn />
      </>
    );
  }

  // 일반 페이지: 헤더/푸터 포함, 상단 패딩 적용
  return (
    <div className="pt-12 md:pt-28">
      <Header />
      <main className="flex-1">{children}</main>
      <div id="modal-root" />
      <div id="alert-root" />
      <Footer />
      <ScrollToTopBtn />
    </div>
  );
}
