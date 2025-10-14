import React, { ReactNode } from "react";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex justify-center relative" style={{background:"rgba(0, 0, 0, 0.5)"}}>
      <div className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col">
        <div className="mb-14 w-full">{children}</div>
        <div className="fixed bottom-0 w-full z-10 ">
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default Layout;
