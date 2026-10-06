import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXUS RISK AI | Command Center',
  description: 'Real-time Geospatial Risk Tracking Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#05080e] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}

