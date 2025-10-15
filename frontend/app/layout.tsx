import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Recipes Browser',
  description: 'Browse and search recipes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <h1>Recipes</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
