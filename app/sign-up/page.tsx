import { Metadata } from "next";
import SignUpPage from "app/sign-up/SignUpPage";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return <SignUpPage />;
}
