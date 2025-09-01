import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PorePal",
  description: "AI-powered skincare analysis",
};

export default function RootLayout({ children }) {
  const ResultsProvider = require("./ResultsContext").ResultsProvider;
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}> 
      <body className="font-sans antialiased bg-background text-foreground">
        <ResultsProvider>
          {children}
        </ResultsProvider>
      </body>
    </html>
  );
}
