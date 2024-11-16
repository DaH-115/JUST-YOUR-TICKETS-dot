import { Metadata } from "next";
import LoginPage from "app/login/login-page";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <LoginPage />;
}
