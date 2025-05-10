import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // selecciona los pesos que necesites
});
export const metadata = {
  title: "WALLY",
  description: "UN AGENT UNIQUE",
};
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="m-2">{children}</div>
      </body>
    </html>
  );
}
