import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "城市区块链管理平台BaaS",
  description: "BaaS",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
