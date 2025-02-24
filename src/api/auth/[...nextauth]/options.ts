import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req):Promise<any> {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          await dbConnect();

          // Find user by email
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.isVerified) {
            console.log("User not verified");
            return null;
          }

          // Compare password (plaintext first, hashed second)
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            console.log("Incorrect password");
            return null;
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks:{
    async session({ session,  token }) {
      if(token)
      {
        session.user._id= token._id;
        session.user.isVerified= token.isVerified
        session.user.username= token.username;
        session.user.isAcceptingMessage= token.isAcceptingMessage; 
      }
      return session
    },
    async jwt({ token, user }) {
      if(user)
      {
        token._id= user._id?.toString();
        token.isVerified= user.isVerified
        token.username= user.username;
        token.isAcceptingMessage= user.isAcceptingMessage;
      }
      return token
    }
  }
};
