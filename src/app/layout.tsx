import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from 'next/font/google'
import "./globals.css";

const cinzel = Cinzel({
   subsets: ['latin'],
   weight: ['400', '700'], // or whatever weights you plan to use
   variable: '--font-cinzel',
   display: 'swap',
 })
 
 const cormorant = Cormorant_Garamond({
   subsets: ['latin'],
   weight: ['400', '700'],
   variable: '--font-cormorant',
   display: 'swap',
 })
 
export const metadata: Metadata = {
  title: "Followly",
  description: "traces in the dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
