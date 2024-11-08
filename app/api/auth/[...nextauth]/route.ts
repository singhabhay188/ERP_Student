import { BASEURL } from "@/lib/const";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


const handler =  NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',

        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },

        async authorize(credentials, req) {
          if(credentials?.username === 'admin' && credentials?.password === 'admin') {
            return { id: 1, name: 'J Smith', email: '' }
          }
          return null;

          const res = await fetch(`${BASEURL}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          console.log('REs',res);
          const user = await res.json();
    
          if (user) {
            return user
          }
          return null;
        }
      })
  ],

  // pages: {
  //   signIn: '/',
  // }
});



export const GET = handler;
export const POST = handler;