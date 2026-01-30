"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const defaultOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
  currency: "USD",
  intent: "capture",
};

export function PayPalProvider({ children }) {
  return (
    <PayPalScriptProvider options={defaultOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
