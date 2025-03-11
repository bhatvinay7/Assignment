import {v2 as cloudinary} from "cloudinary";
import fs from 'fs'

    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME as string, 
        api_key:process.env.CLOUDINARY_API_KEY as string, 
        api_secret:process.env.CLOUDINARY_API_SECRET  as string // Click 'View API Keys' above to copy your API secret
    });
     console.log(process.env.CLOUDINARY_CLOUD_NAME as string)
     console.log(process.env.CLOUDINARY_API_KEY as string)
     console.log(process.env.CLOUDINARY_API_SECRET  as string)
    const uploadOnCloudinary=async(localFilePath:string)=>{
        try{
     if(!localFilePath){
        return null
     }
     console.log(localFilePath);
     //upload the file on clodinary
     const response=await cloudinary.uploader.upload(localFilePath,{
        resourece_type:"auto"
     })
     //file has been uploaded successfully
     console.log(localFilePath)
     fs.unlink(localFilePath,(err)=>{
        if(err){
            console.log(err.message);
        }
        else{
            console.log("file deleted");
        }
        })
     console.log(response.secure_url)   
     return response.secure_url
        }catch(err){

fs.unlink(localFilePath,(err:any)=>{
    if(err){
        console.log(err.message);
    }
    else{
        console.log("file deleted");
    }
    })

//return null
//remove the locally saved temporary file as the upload operation got failed
        }
        
    }
export default uploadOnCloudinary;