// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormField} from "@/components/ui/form"
// import Image from "next/image"
// import Link from "next/link"
// import {toast} from "sonner";
// import { useRouter } from "next/navigation"



// const authFormSchema = (type: FormType) => {
//   return z.object({
//     name: type === 'sign-up' ? z.string().min(3) : z.string()
//     .optional(),
//     email: z.string().email(),
//     password: z.string().min(3),
//   })
// }

// const AuthForm = ({ type }: { type: FormType }) => {
//   const router = useRouter();
//   const formSchema = authFormSchema(type);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   })


//   function onSubmit(values: z.infer<typeof formSchema>) {
//       try{
//         if(type === 'sign-up') {
//           toast.success('Account created successfully! Please sign in.');
//           router.push('/sign-in');
//         } else {
//           toast.success('Sign in successful!');
//           router.push('/');
//         }
//       }catch (error) {
//         console.log(error);
//         toast.error(`There was an error: ${error}`);
//       }
//   }

//     const isSignIn = type === "sign-in"

//   return (
//     <div className="card-border lg:min-w-[566px]">
//         <div className="flex flex-col gap-6 card py-14 px-10">
//             <div className="flex flex-row gap-2 justify-center">
//                 <Image src="/logo.svg" alt="logo" height={32} width={38} />
//                 <h2 className="text-primary-100">PrepWise</h2>
//             </div>
//             <h3>Practice job interview with AI</h3>
        

//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt">
//                   {!isSignIn && (
//                     <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <div>
//                           <label htmlFor="name" className="block mb-1">Name</label>
//                           <input
//                             id="name"
//                             {...field}
//                             placeholder="Your Name"
//                             className="input"
//                           />
//                         </div>
//                       )}
//                     />
//                       )}
//                       <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                           <div>
//                             <label htmlFor="email" className="block mb-1">Email</label>
//                             <input
//                               id="email"
//                               {...field}
//                               placeholder="Your Email address"
//                               type="email"
//                               className="input"
//                             />
//                           </div>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="password"
//                         render={({ field }) => (
//                           <div>
//                             <label htmlFor="password" className="block mb-1">Password</label>
//                             <input
//                               id="password"
//                               {...field}
//                               placeholder="Enter your password"
//                               type="password"
//                               className="input"
//                             />
//                           </div>
//                         )}
//                       />
//                    <Button className="btn"
//                   type="submit">{!isSignIn ? 'Sign in' : 'Create an Account'}</Button>
//                 </form>
//               </Form>

//               <p className="text-center">
//                 {isSignIn ? 'No account yet?' : 'Have an account already?'}
//                 <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
//                 {!isSignIn ? "Sign in" : 'Sign up'}
//                 </Link>

//               </p>

//     </div>
//     </div>
//   )
// }
// export default AuthForm









"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormField } from "@/components/ui/form" // Adjust path as needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"

// Add this type definition if missing
type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) => {
  return z.object({
    // Make name required only for sign-up
    name: type === 'sign-up' ? z.string().min(3, {
      message: "Name must be at least 3 characters"
    }) : z.string().optional(),
    // Email validation
    email: z.string().email({
      message: "Please enter a valid email address"
    }),
    // Password validation
    password: z.string().min(4, {
      message: "Password must be at least 4 characters"
    }),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'sign-up') {
        // Add your sign-up API call here

        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if(!result?.success){
        toast.error(result?.message || 'Sign-up failed.');
          return;
        }

        toast.success('Account created successfully! Please sign in.')
        router.push('/sign-in')
      } else {
        // Add your sign-in API call here

        const { email, password }= values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if(!idToken){
          toast.error('Sign in failed')
          return;
        }

        // await signIn({
        //   email,
        //   password,
        //   idToken
        // })

        const result = await signIn({ email, password, idToken });
      if (!result?.success) {
        toast.error(result?.message || 'Sign-in failed.');
        return;
      }

        toast.success('Sign in successfully!')
        router.push('/')
      }
    } catch (error: unknown) {
  console.error('AuthForm error:', error);
  let message = 'An error occurred. Please try again.';
  if (typeof error === 'object' && error !== null && 'code' in error) {
    message = `Authentication failed: ${(error as { code: string }).code}`;
  }
  toast.error(message);
}
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">SpeakPeak</h2>
          
        </div>
        <h3 className="text-center text-muted-foreground text-base">
  {type === 'sign-in'
    ? 'Welcome back — let’s continue your prep!'
    : 'Practice your Job Interview with AI'}
</h3>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === 'sign-up' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <label htmlFor="name" className="block mb-1">Full Name</label>
                    <input
                      id="name"
                      {...field}
                      placeholder="Jerry Smith"
                      className="input-box"
                      required
                    />
                  </div>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <input
                    id="email"
                    {...field}
                    placeholder="example@email.com"
                    type="email"
                    className="input-box"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div>
                  <label htmlFor="password" className="block mb-1">Password</label>
                  <input
                    id="password"
                    {...field}
                    placeholder="••••"
                    type="password"
                    className="input-box"
                    required
                  />
                </div>
              )}
            />

            <Button type="submit" className="w-full mt-6">
              {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
          <Link 
            href={type === 'sign-in' ? '/sign-up' : '/sign-in'} 
            className="text-primary font-semibold ml-1"
          >
            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
        
      </div>
    </div>
  )
}



export default AuthForm