import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connect from "@/lib/db";
import jwt from "jsonwebtoken";
import authOption from '@/lib/auth'
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/model/user.model";
const authOptions :NextAuthOptions=authOption

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
