// app/layout.jsx
import React from "react";
import "./globals.css"
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}
      </body>
    </html>
  );
}
