import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import LoadingBar from "@/components/loading-bar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ASTRO KIT - The ultimate toolkit for productivity',
  description: 'The ultimate open-source toolkit for creators and developers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingBar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
