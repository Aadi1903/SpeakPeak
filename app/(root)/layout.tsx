import { ReactNode } from 'react'
import Image from "next/image"
import Link from "next/link"
import { isAuthenticated } from "@/lib/actions/auth.action"
import {redirect} from "next/navigation";

const Layout = async ({ children }: { children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated(); 

  if(!isUserAuthenticated) redirect("/sign-in");
 
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">SpeakPeak</h2>
        </Link>

       <small className="text-muted-foreground text-sm italic ml-10">
        Where preparation meets confidence.
      </small>

      </nav>

      {children}
    </div>
  );
};
export default Layout;






