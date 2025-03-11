import { NextRequest,NextResponse } from "next/server";
import connectDB from '@/lib/db'
import {z} from 'zod'
import bcrypt from "bcryptjs";
import User from '@/lib/model/user.model'
const saltRounds = 10;

// export async function GET(request:NextRequest){
//     try{
//         const response = await connectDB()
//         const schema= z.object({
//             userName:z.string().min(3,"please enter your username"),
//             email: z.string().email("please provide a valid email"),
//             password:z.string().min(6,"password must be atleast 6 characters long")
      
//           })
        
         
//         return NextResponse.json({message:"Sign Up Successfull"},{status:200})
//     }
//     catch(error:any){

//         return NextResponse.json({message:error.message},{status:500})
//     }
// }


export async function POST(request:NextRequest){
    try{
        const response = await connectDB()
        const body=await request.json()
        const schema= z.object({
            userName:z.string().min(3,"please enter your username"),
            email: z.string().email("please provide a valid email"),
            password:z.string().min(6,"password must be atleast 6 characters long")
      
          })
          const {userName,email,password}=body
         const result=schema.safeParse({userName,email,password})

         if(!result.success){
       return NextResponse.json({error:result.error.format()},{status:400})
         }
         else{

            const user=await User.findOne({email:email})
            if(user){

                return NextResponse.json({message:"User already exists"},{status:409})
            }

            else {
                
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                console.log( hashedPassword )
                const newUser=new User({
                    userName:userName,
                    email:email,
                    password:hashedPassword
                })
                newUser.save().then((document:any)=>{
                    console.log(newUser)
                    return  NextResponse.json({message:"Sign Up Successfull"},{status:200})
                    
                
            
                }
            
            ).catch((error:any)=>{
                    return NextResponse.json({message:"Unable to Sign Up, Please try again"},{status:400})
                })
           
    
             }
             return  NextResponse.json({message:"Sign Up Successfull"},{status:200})
            }
           
    }
    catch(error:any){

        return NextResponse.json({message:error.message},{status:500})
    }
}