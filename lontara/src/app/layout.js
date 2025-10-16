import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

const albertSans = Albert_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lontara - Email Classification System",
  description: "Sistem klasifikasi email otomatis UNPAD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${albertSans.className} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
