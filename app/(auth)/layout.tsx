
import { ReactNode } from 'react'
import {redirect} from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action"
// import { usePathname } from 'next/navigation';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  // const pathname = usePathname();
  
      if(!isUserAuthenticated) redirect('/');
      // if (isUserAuthenticated && !['/sign-in', '/sign-up'].includes(pathname)) {
      // redirect('/');
    
    return <div className="auth-layout">{children}</div>;
  }

export default AuthLayout

