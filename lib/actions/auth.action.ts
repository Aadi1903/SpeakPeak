"use server";
import { db, auth } from '@/firebase/admin';
// import { CollectionReference } from 'firebase-admin/firestore';
// import { documentId } from 'firebase/firestore';
import {cookies} from "next/headers";

const ONE_WEEK =  60 * 60 * 24 * 7;


// Add or update this interface/type definition above your functions
interface SignUpParams {
    name?: string;
    email: string;
    password: string;
    uid?: string;
    idToken?: string;
}


export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
try{
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK* 1000,
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.MODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
    console.log('Session cookie set successfully');
  } catch (error) {
    console.error('Error setting session cookie:', error);
    throw error;
  }
}






export async function signUp(params: SignUpParams){
    const { uid, name, email } = params;

    if (!uid) {
        return {
            success: false,
            message: 'User ID is required to create a user.'
        }
    }

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please try logging in.'
            }
        }

        await db.collection('users').doc(uid).set({
            name,email
        });

        return {
            success: true,
            message: 'Account created successfully. Please sign in.',
        };

    }catch (e: unknown){
        console.error('Error creating a user', e);

        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email already in use. Please try a different email.'
            };
        }

        return {
            success: false,
            message: 'An error occurred while creating the user. Please try again later.'
        };
    }
}



export async function signIn(params: SignUpParams){
    const {email, idToken } = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return{
                success: false,
                message: 'User does not exist. Create an account instead.',
            };
        }

        if (!idToken) {
            return {
                success: false,
                message: 'ID token is required to sign in.'
            }
        }
        await setSessionCookie(idToken);
return { success: true, message: 'Sign in successful.' };
    }catch (error :unknown){
        console.log(error);

        return{
            success: false,
            message: 'Failed to log into an account',
        };
    }
}


export async function signout(){
    const cookieStore = await cookies();
    cookieStore.delete("session");
}





export async function getCurrentUser(): Promise<User | null>{
    try{
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie) 
        {
    console.log('No session cookie found');
    return null;
  }

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log('Session cookie verified for user:', decodedClaims.uid);

        const userRecord = await db.
        collection('users')
        .doc(decodedClaims.uid)
        .get();

        if(!userRecord.exists) 
            {
      console.log('User record not found in Firestore for UID:', decodedClaims.uid);
      return null;
    }
        return{
            ...userRecord.data(),
            id: userRecord.id,

        }as User;

    }catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}


export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;   
}