import { Inter } from "next/font/google";
import "../modules/core/styles/globals.css";
import { PayPalProvider } from "../modules/shared/providers/PayPalProvider";
import { MockAuthProvider } from "../modules/shared/providers/MockAuthContext";
import { ThemeProvider } from "../modules/shared/providers/ThemeContext";
import { AssignmentProvider } from "../modules/shared/providers/AssignmentContext";
import HomepageNavigation from "../modules/core/layout/HomepageNavigation";

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
        <ThemeProvider>
          <MockAuthProvider>
            <AssignmentProvider>
              <HomepageNavigation />
              <main className="bg-white min-h-screen">
                <PayPalProvider>{children}</PayPalProvider>
              </main>
            </AssignmentProvider>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
