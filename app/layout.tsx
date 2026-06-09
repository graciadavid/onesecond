import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "OneSecond",
  description: "Lo que pasa cada segundo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
