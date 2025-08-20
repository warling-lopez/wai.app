// app/layout.jsx
import React from "react";
import "./globals.css"
import "@/components/css/animation/chat-animations.css"
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}
      </body>
    </html>
  );
}
