import axios from "axios";

<<<<<<< HEAD
// const BASE_URL = process.env.NODE_ENV === "production" ? 
//                     "https://library-management-system-8k77.onrender.com/api/v1" :
//                     "http://localhost:5500/api/v1";

const BASE_URL = "https://library-management-system-8k77.onrender.com/api/v1"
=======
const BASE_URL = process.env.NODE_ENV === "production" ? 
                    "https://library-management-system-8k77.onrender.com/api/v1" :
                    "http://localhost:5500/api/v1";
>>>>>>> 97f8786139b5759ade18b947686983e6c7b9ccd6

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})