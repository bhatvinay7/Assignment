import axios from 'axios';

const BASE_URL='https://assignment-ten-self-27.vercel.app'
export default  axios.create({
    baseURL: BASE_URL
})



export const axioPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});
