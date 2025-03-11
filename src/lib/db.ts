import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.r3hyl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

const connect=async ()=>{
    console.log(process.env.USER_NAME)
    console.log(process.env.PASSWORD)
    console.log(process.env.DB_NAME)
    const connectionState=mongoose.connection.readyState
    if(connectionState===1){
        console.log("connected")
        return
    }
    if(connectionState===2){
        console.log("connecting")
        return
    }
    try{
        console.log(MONGODB_URI)
        await mongoose.connect(MONGODB_URI!,{
            //dbName:"nextassignment",
            bufferCommands:false
        })
        console.log("connected")
    }
    catch(error:any){
        // throw new Error("Error in connecting to database")
        console.log(error.message)
    }
}

export default connect;
