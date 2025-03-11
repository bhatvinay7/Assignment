export {}
declare global {
     interface userData{
        userName:string,
        email:string,
        password:string,
     }

     interface formDataError{  
         userName?: { _errors: string[] };
         email?: { _errors: string[] };
         password?: { _errors: string[] };
         mobile?: { _errors: string[] }
      }
      interface frontEndFormDataError{  
         userName?:string;
         email?:string;
         password?:string;
         mobile?:string
      }



}    