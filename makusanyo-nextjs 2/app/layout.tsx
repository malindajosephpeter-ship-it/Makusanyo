import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Makusanyo — 941 Regt',
  description: 'Unit Financial Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-navy-950 antialiased">{children}</body>
    </html>
  );
}
