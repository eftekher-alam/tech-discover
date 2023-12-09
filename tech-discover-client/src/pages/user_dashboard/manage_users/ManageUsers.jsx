import { useQuery } from "@tanstack/react-query";
import useSecureAxios from "../../../hooks/useSecureAxios";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useState } from "react";


const ManageUsers = () => {
    const secureAxios = useSecureAxios();
    const [isLoading, setIsLoading] = useState(true);

    const { data: users = [], refetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            setIsLoading(false);
            const res = await secureAxios.get("/admin/users");
            return res.data;
        }
    })


    const handlerRoleChange = (event, oldRole, userEmail) => {
        setIsLoading(true);
        const newRole = event.target.value;

        // console.log(newRole, oldRole, userEmail);

        Swal.fire({
            title: "Are you sure?",
            text: `You want to change role ${oldRole} to ${newRole}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then((result) => {
            if (result.isConfirmed) {
                secureAxios.patch(`/admin/user-role-change?email=${userEmail}&role=${newRole}`)
                    .then(res => {
                        setIsLoading(false);
                        if (res?.data?.success) {
                            Swal.fire({
                                title: "Changed!",
                                text: `The user role ${newRole} now`,
                                icon: "success"
                            });
                        }
                    })
            }
        });
        setIsLoading(false);
        refetch()
    }

    const handlerDeleteUser = (userEmail) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                secureAxios.delete(`/admin/user/${userEmail}`)
                    .then(res => {
                        setIsLoading(false);
                        refetch();
                        if (res?.data?.success) {
                            Swal.fire({
                                title: "Deleted!",
                                text: `The user has been deleted`,
                                icon: "success"
                            });
                        }
                    })
            }
            else
                setIsLoading(false);
        });


    }

    return (
        <div className="p-10">
            {
                isLoading && <div className='absolute flex justify-center w-[70%] h-full z-50'>
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            }
            <div className="flex justify-evenly">
                <h1 className="text-xl md:text-3xl font-semibold gradient-text inline-block uppercase">All users</h1>
                <h1 className="text-xl md:text-3xl font-semibold gradient-text inline-block uppercase">total users : {users?.length}</h1>
            </div>
            <div className="mt-4">
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Picute</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users && users?.map((user, index) => <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td> <img src={user?.photoURL} alt="" className="w-10 h-10" /> </td>
                                    <td>{user?.displayName}</td>
                                    <td>{user?.email}</td>
                                    <td>
                                        <select
                                            disabled={user?.email === "admin@gmail.com"}
                                            onChange={(event) => handlerRoleChange(event, user?.role, user?.email)} className="select select-sm select-info max-w-xs">
                                            <option value={"Admin"} selected={user?.role === "Admin"}>Admin</option>
                                            <option value={"Moderator"} selected={user?.role === "Moderator"}>Moderator</option>
                                            <option value={"User"} selected={user?.role === "User"}>User</option>
                                        </select>
                                    </td>
                                    <td className="space-x-1 text-center max-md:space-y-1">
                                        <button
                                            disabled={user?.email === "admin@gmail.com"}
                                            className="btn btn-sm btn-circle"
                                            onClick={() => handlerDeleteUser(user?.email)}>
                                            <MdDelete></MdDelete>
                                        </button>
                                    </td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;