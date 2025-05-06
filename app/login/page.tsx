import { Metadata } from "next";
import LoginPage from "app/login/components/LoginPage";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <LoginPage />;
}
