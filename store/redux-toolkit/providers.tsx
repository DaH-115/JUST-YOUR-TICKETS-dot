"use client";

import { Provider } from "react-redux";
import store from "store/redux-toolkit";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
