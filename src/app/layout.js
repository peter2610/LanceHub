import { Inter } from "next/font/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "LanceHub | Professional Writing & Assignment Hub",
  description:
    "Submit assignments, track progress, pay securely, and download deliverables on LanceHub.",
};

const paypalOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
  currency: "USD",
  intent: "capture",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <PayPalScriptProvider options={paypalOptions}>
          {children}
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
