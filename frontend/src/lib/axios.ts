import axios from "axios"

const BASE_URL = "https://library-management-system-8k77.onrender.com/api/v1"

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})