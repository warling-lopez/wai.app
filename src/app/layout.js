import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // selecciona los pesos que necesites
})
export const metadata = {
  title: "Workai",
  description: "Generated by create next app",
};

export  default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
 
  return (
    <html lang="en">
      <body className={roboto.className }>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar/>
          <main className="w-full grid-rows-2">
            <SidebarTrigger style={{ fontSize: '8rem' }} className={'absolute text-4xl'}/>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
