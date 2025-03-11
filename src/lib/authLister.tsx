'use client'
import { useEffect } from 'react';
// import {login,updateAccessToken } from '../redux/authSlice/auth'
// import {useDispatch} from 'react-redux'
// //import {AppDispatch} from '.redux/store'
// import useRefreshTokenGen from './useRefreshTokenGen';
//  function AuthListener(){
//    const refresh=useRefreshTokenGen()
  
//     const dispatch=useDispatch()
//     useEffect(() => {
//       const unsubscribe = onAuthStateChanged(auth,async(user) => {
//         if (user) {
          
//           await refresh()
//           dispatch(login(user)); // Dispatch user data to Redux store
//           console.log("User logged in, updating store");
          
//           // Optional: Fetch and decode token if needed
//           // const accessToken = await user.getIdToken();
//           // console.log(accessToken);
//           // const decodedToken = jwtDecode(accessToken);
//           // console.log(decodedToken);
//         } else {
//           console.log("No user is logged in.");
          
//         }
//       });
      
//       return () => unsubscribe(); // Cleanup on unmount
//       }, [dispatch,refresh])


//       return(
//        <>
      
       
//        </>
//       )
// }
// export default AuthListener