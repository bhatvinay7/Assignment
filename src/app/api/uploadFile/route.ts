import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {NextResponse,NextRequest} from 'next/server'
import { existsSync } from "fs";
import mongoose from "mongoose";
import { unlink as fsUnlink } from "fs/promises";
import connect from '@/lib/db'
import { getServerSession } from "next-auth";
import  authOptions  from "@/lib/auth"
import fs from 'fs'
import { parse as csvParse } from 'csv-parse/sync';
import {uploadToS3} from '@/lib/s3'
import Agent from '@/lib/model/agent.model'
import User from '@/lib/model/user.model'
import agentList from '@/lib/model/agentList.model'

async function unlink(filePath: string) {
    try {
        await fsUnlink(filePath);
    } catch (error) {
        console.error(`Failed to delete file at ${filePath}:`, error);
    }
}


export async function POST(req:NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         await connect();
        const formData = await req.formData();
        const file = formData.get("file"); // Get file from FormData

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type (optional but recommended)
        // const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
        // if (!allowedTypes.includes(file.type)) {
        //   return Response.json({ error: "Invalid file type" }, { status: 400 });
        // }

        // Convert file to buffer
        const bytes = await (file as Blob).arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the upload directory
        const uploadDir = path.join(process.cwd(), "/tmp");

        // Ensure the directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname((file as File).name);
        const newFileName = `${timestamp}${fileExtension}`;
        const filePath = path.join(uploadDir, newFileName);

        // Save the file
        await writeFile(filePath, buffer);

        const csvContent = await fs.promises.readFile(filePath, "utf-8");
        const records = parse(csvContent, { columns: true, skip_empty_lines: true });

        // Split data into 5 groups (each containing 4 rows)
        if(records?.length==0){
            return NextResponse.json({message:"No data in the file"},{status:400})
        }
        const user=await User.findOne({email:session?.user?.email})
        const agentIds = await Agent.aggregate([
               { $match: { user: user._id } },
               {
                $project: { _id: 1 } // Only return `_id`
              }
        ]);

        if(agentIds.length==0){
            return NextResponse.json({message:"No agent is available to assign the data"},{status:400})
        }
        const userChunks =<any> [];
        let chunkSize = Math.floor(records.length / agentIds.length);
        let extra = records.length % agentIds.length; // Extra records to distribute
    
        let startIndex = 0;
        for (let i = 0; i < agentIds.length; i++) {
            let endIndex = startIndex + chunkSize + (extra > 0 ? 1 : 0); // Distribute extra items first
            userChunks[i] = records.slice(startIndex, endIndex);
            startIndex = endIndex;
            extra--;

        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file at ${filePath}:`, err);
            }
        });

   
        async function uploadAllChunks() {
            const uploadPromises = await userChunks?.filter((each:any)=>each.length>0).map(async (chunk:any, index:number) => {

              const fileName = `user_chunk_${index + 1}.csv`;
              return await uploadToS3(chunk, fileName);
            });
          
            const uploadedUrls = await Promise.all(uploadPromises);
            return uploadedUrls
          }
          
       const arrayLink=  await uploadAllChunks();
          

       await Promise.all(
        arrayLink.map((each: string, index: number) =>
          agentList.create({
            agenId: agentIds[index],
            userId: user._id,
            listURL: each,
          })
        )
      );
  

        return NextResponse.json({ 
            message: "File uploaded successfully!"
        }, { status: 200 });

    } catch (error:any) {
        console.log(error.message)

        return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
    }
}


function parse(csvContent: string, options: { columns: boolean; skip_empty_lines: boolean; }) {
    return csvParse(csvContent, options);
}


export async function GET(request:NextRequest){
   
        try {
            const session = await getServerSession(authOptions);

            if (!session) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
    
             await connect()
            const user=await User.findOne({email:session?.user?.email})
         const userId=user._id
            const groupedAgents = await agentList.aggregate([
                { $match: {userId} }, 
                {
                    $group: {
                        _id: "$agenId", // Group by agentId
                        fileUrls: { $push: "$listURL" } // Collect all URLs for the agent
                    }
                }
            ]);

            if (!groupedAgents.length) {
                return NextResponse.json({ message: "No agents found for this user in the group." },{status:400});
            }
    
            // Step 2: Extract agentIds
            const agentIds = groupedAgents.map((entry) => entry._id);
    
            // Step 3: Fetch agent details from the Agent model
            const agents = await Agent.find({ _id: { $in: agentIds } });
    
            // Step 4: Merge agent details with their respective file URLs
            const result = agents.map((agent) => {
                const agentData = groupedAgents.find((entry) => entry._id.toString() === agent._id.toString());
                return {
                    agentId: agent._id,
                    userName: agent.userName, // Assuming agent has 'name'
                    email: agent.email, // Assuming agent has 'email'
                    mobile: agent.mobile, // Assuming agent has 'phone'
                    fileUrls:agentData?.fileUrls
                };
            });
    
            return NextResponse.json(result,{status:200})
        } catch (error) {
            console.error("Error fetching agent files and info:", error);
            return NextResponse.json(error,{status:500})
        }
    }
