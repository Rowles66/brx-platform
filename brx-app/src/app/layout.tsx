import type { Metadata } from "next";
// import "./globals.css"; // Temporarily disabled for build

export const metadata: Metadata = {
  title: "BRX Performance",
  description: "Training Programs and Workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
