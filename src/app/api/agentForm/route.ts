import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import  authOptions  from "@/lib/auth"
import User from '@/lib/model/user.model'
import connect from '@/lib/db'
import {z} from 'zod'
import Agent from '@/lib/model/agent.model'

import bcrypt from "bcryptjs";


export async function POST(req:NextRequest){
       try{
       await connect()
       const session = await getServerSession(authOptions);

       if (!session) {
         return Response.json({ error: "Unauthorized" }, { status: 401 });
       }

   const schema=z.object({
    userName:z.string().min(3,"please enter your username"),
    email: z.string().email("please provide a valid email"),
    password:z.string().min(6,"password must be atleast 6 characters long"),
    mobile:z.string().min(10,"Enter valid mobile number")
   })
   const body= await req.json()
   const {userName,email,password,mobile}=body
   const result=schema.safeParse({userName,email,password,mobile})

     if(!result.success){
        return NextResponse.json({error:result.error.format()},{status:400})
     }
     else{
        const user=await Agent.findOne({email:email})
        if(user){

            return NextResponse.json({message:"User already exists"},{status:409})
        }

        else {
            const owner=await User.findOne({email:session?.user?.email});
            const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(password, salt);
            console.log( hashedPassword )
            const newUser=new Agent({
                userName:userName,
                email:email,
                mobile:mobile,
                password:hashedPassword,
                user:owner._id
            })
            newUser.save().then((document:any)=>{

                return  NextResponse.json({message:"User  Successfully Added"},{status:200})
              }).catch((error:any)=>{
                return NextResponse.json({message:"Unable to add user, Please try again"},{status:400})
            })
       

         }
         return  NextResponse.json({message:"User  Successfully Added"},{status:200})
        }

     }
       catch(error:any){
        return NextResponse.json({message:error.message},{status:500})
       }

}


export async function GET(request:NextRequest){

  try{
    await connect()
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user=await User.findOne({email:session?.user?.email})
    const agents= await Agent.find({user:user._id})
    return NextResponse.json(agents,{status:200});
  }
  catch(error:any){
    return NextResponse.json({message:"Unable to fetch data"},{status:500});

  }
}