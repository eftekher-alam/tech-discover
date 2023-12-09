import { useQuery } from "@tanstack/react-query";
import useSecureAxios from "./useSecureAxios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useRole = () => {
    const { user } = useContext(AuthContext);
    const secureAxios = useSecureAxios();

    const { data: role } = useQuery({
        queryKey: [user?.email, 'role'],
        queryFn: async () => {
            const res = await secureAxios.get(`/user-role/${user?.email}`);
            return res.data;
        }
    })

    return role;
};

export default useRole;