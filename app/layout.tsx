import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import Chat from "@/components/chat/globalSupportChat";
import { ThemeProvider } from "@/context/context";
import { ToastContainer } from 'react-toastify';
import ConfirimModel from '@/components/main/ConfirmModel';
import ReduxProvider from "@/components/providers/ReduxProvider";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "webmedigital",
  description:
    "WEBME Information Technology, Your trusted IT Consultancy Provider. With a passion for technology and a commitment to excellence, WEBME is here to guide your business through every step of its IT journey, ensuring seamless operations and transformative growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-y-scroll overflow-x-hidden`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <ConfirimModel />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <StarsCanvas />
            <Navbar />
            {children}
            <Chat />
            <Footer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
