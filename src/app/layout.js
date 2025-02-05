import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // Store as a CSS variable
  weight: ["400", "500", "600", "700", "900"], // Load specific font weights
});

export const metadata = {
  title: "Webomo Business Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`font-montserrat antialiased `}>{children}</body>
    </html>
  );
}
