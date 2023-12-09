import { useEffect } from "react";
import { useState } from "react";
import useSecureAxios from "../../../hooks/useSecureAxios";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);
    const secureAxios = useSecureAxios();
    const [isLoading, setIsLoading] = useState(true);
    const redirectTo = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        if (user?.uid) {
            secureAxios.get(`/products/${user?.uid}`)
                .then(res => {
                    setIsLoading(false);
                    setProducts(res?.data);
                })
        }
    }, [secureAxios, user])



    const handlerDeleteProduct = (_id) => {


        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                secureAxios.delete(`product/${_id}`)
                    .then(res => {
                        if (res?.data?.success) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Product deleted successfully",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            if (user?.uid) {
                                secureAxios.get(`/products/${user?.uid}`)
                                    .then(res => {
                                        setIsLoading(false);
                                        setProducts(res?.data);
                                    })
                            }
                        }
                    })
            }
        });



    }


    return (
        <div className="min-h-screen">
            {
                isLoading && <div className="w-full min-h-screen flex justify-center items-center"><span className="loading loading-dots loading-lg"></span></div>
            }
            {
                !isLoading && <div className="p-10">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Product Name</th>
                                    <th className="text-center">Up Vote</th>
                                    <th className="text-center">Down Vote</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    products && products.map((product, index) =>
                                        <tr key={index}>
                                            <th>{index + 1}</th>
                                            <td>{product?.productName}</td>
                                            <td className="text-center" >{product?.upvote}</td>
                                            <td className="text-center">{product?.downvote}</td>
                                            <td className="text-center">{product?.status}</td>
                                            <td className="space-x-1 text-center max-md:space-y-1">
                                                <button
                                                    className="btn btn-sm btn-circle"
                                                    onClick={() => redirectTo(`/user-dashboard/product/${product?._id}`)}
                                                >
                                                    <BiEdit></BiEdit>
                                                </button>
                                                <button className="btn btn-sm btn-circle" onClick={() => handlerDeleteProduct(product?._id)}>
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
            }
        </div>
    );
};

export default MyProducts;