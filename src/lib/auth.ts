import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/model/user.model";
import bcrypt from "bcryptjs";
import connect from "@/lib/db";
import jwt from "jsonwebtoken";
const authOption :NextAuthOptions ={
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: "openid email profile",
          },
        },
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connect();
          if (credentials) {
            const email = credentials.email;
            const password = credentials.password;
            const user = await User.findOne({ email: email });
            if (!user) {
              throw new Error("Please sign up,user credentials are not found!");
            } else {
              const result = await bcrypt.compare(password, user.password);
              console.log(result);
              if (!result) {
                throw new Error("Incorrect password was entered");
              }
            }
            return {
              id: user._id.toString(),
              name: user.userName,
              email: user.email,
            };
          }
          throw new Error("user credentials are missing");
          
        },
      }),
    ],
  
    secret: process.env.NEXTAUTH_SECRET,
  
    callbacks: {
      async signIn({ account, profile }) {
        console.log(process.env.NEXTAUTH_SECRET);
        await connect();
        if (profile) {
          const email = profile?.email;
          const picture = (profile as { picture?: string })?.picture;
          const user = await User.findOne({ email: email });
  
          if (!user) {
            const newUser = await User.create({
              userName: profile.name,
              email: profile.email,
              picture: picture,
            });
          }
        }
        return true;
      },
      async jwt({ token, account }) {
        // Persist the OAuth access_token and or the user id to the token right after signin
        await connect();
        if (account) {
          const user = await User.findOne({ email: token?.email });
  
          token.accessToken = jwt.sign(
            { name: user.userName, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
          );
  
          // Generate Refresh Token
          token.refreshToken = jwt.sign(
            { name: user.userName },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "2d" }
          );
          const updateUser = await User.findByIdAndUpdate(user._id, {
            refreshToken: token.refreshToken,
          });
        }
  
        return token;
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token and user id from a provider.
        if (session && session.user) {
        }
        return session;
      },
    },
    pages: {
      signIn: "/signIn",
      // signOut: "/auth/signout", // Custom Sign-out Page
      error: "/signIn", // Error Page
      // verifyRequest: "/auth/verify-request", // Email Verification Page
      // newUser: "/auth/new-user", // New User Page (for first-time signups)
    },
  };

export default authOption