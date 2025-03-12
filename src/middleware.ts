import {NextResponse,NextRequest} from 'next/server'
export const config = {
    matcher: ['/dashboard/:path*','/api/agentForm','/api/uploadFile'],
    };
    
export  async  function middleware(request:NextRequest){
    const token = request.cookies.get("next-auth.session-token")?.value || 
    request.cookies.get("__Secure-next-auth.session-token")?.value;

if (!token) {
return NextResponse.redirect(new URL("/signIn", request.url));
}
    
    const res= NextResponse.next();
        res.headers.set("Access-Control-Allow-Origin", "*"); // Change '*' to specific domains if needed
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
}
