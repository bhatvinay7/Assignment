import {NextResponse,NextRequest} from 'next/server'
export async function GET(reuest:NextRequest){
    return NextResponse.json({message:"Successful"},{status:200})
}