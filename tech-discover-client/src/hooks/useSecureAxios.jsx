import axios from "axios";

const secureAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

const useSecureAxios = () => {
    // console.log("Data fetching from : ", import.meta.env.VITE_API_URL);
    return secureAxios;
};

export default useSecureAxios;