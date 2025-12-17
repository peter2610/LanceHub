import { Inter } from "next/font/google";
import "./globals.css";
import { PayPalProvider } from "../components/PayPalProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "LanceHub | Professional Writing & Assignment Hub",
  description:
    "Submit assignments, track progress, pay securely, and download deliverables on LanceHub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <PayPalProvider>{children}</PayPalProvider>
      </body>
    </html>
  );
}
