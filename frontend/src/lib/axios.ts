import axios from "axios";

const BASE_URL = process.env.NODE_ENV === "production" ? 
                    "https://library-management-system-8k77.onrender.com/api/v1" :
                    "http://localhost:5500/api/v1";

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})