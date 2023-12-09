import { useState } from "react";
import useSecureAxios from "../../../hooks/useSecureAxios";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from "react-router-dom";
import { MdInfo } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

const ProdReviewQueue = () => {
    const { user } = useContext(AuthContext);
    const secureAxios = useSecureAxios();
    const [isLoading, setIsLoading] = useState(true);
    const redirectTo = useNavigate();

    const { data: products = [], refetch } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            setIsLoading(true);
            const res = await secureAxios.get("/prod-review-queue");
            setIsLoading(false);
            return res.data;
        }
    })

    const handlerProdMakeFeatured = (event, oldStatus, productId) => {
        const isFeatured = event.target.value;


        // console.log("changed to ", isFeatured);

        Swal.fire({
            title: "Are you sure?",
            text: `You want to make it ${isFeatured === "isFeatured" ? "Featured" : "Not Featured"}  product`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                secureAxios.patch(`/admin/prod-make-featured?productId=${productId}&featured=${isFeatured}`)
                    .then(res => {
                        setIsLoading(false);
                        refetch()
                        if (res?.data?.success) {
                            Swal.fire({
                                title: "Changed!",
                                text: `The product is ${isFeatured === "isFeatured" ? "Featured" : "Not Featured"} product now`,
                                icon: "success"
                            });
                        }
                    })
            }
            else {
                setIsLoading(false);
            }
        });
    }

    const handlerProdStatusChange = (event, oldStatus, productId) => {
        const newStatus = event.target.value;

        // console.log(newStatus, oldStatus, productId);

        Swal.fire({
            title: "Are you sure?",
            text: `You want to change status ${oldStatus} to ${newStatus}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                secureAxios.patch(`/admin/prod-status-change?productId=${productId}&status=${newStatus}`)
                    .then(res => {
                        setIsLoading(false);
                        refetch()
                        if (res?.data?.success) {
                            Swal.fire({
                                title: "Changed!",
                                text: `The product status is ${newStatus} now`,
                                icon: "success"
                            });
                        }
                    })
            }
            else {
                setIsLoading(false);
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
                                <tr className="bg-gradient-to-r from-[#ff6c6c] to-[#7d5fff] text-white">
                                    <th></th>
                                    <th>Product Name</th>
                                    <th className="text-center">Up Vote</th>
                                    <th className="text-center">Down Vote</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Featured</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    products && products.map((product, index) =>
                                        <tr
                                            key={index}
                                            className=
                                            {`${(product?.status === "reject")
                                                ?
                                                "bg-rose-200"
                                                : ((product?.status === "approve") ? "bg-green-300" : "bg-orange-200")}`}
                                        >
                                            <th>{index + 1}</th>
                                            <td>{product?.productName}</td>
                                            <td className="text-center" >{product?.upvote}</td>
                                            <td className="text-center">{product?.downvote}</td>
                                            <td className="text-center">
                                                <select
                                                    disabled={user?.email === "admin@gmail.com"}
                                                    onChange={(event) => handlerProdStatusChange(event, product?.status, product?._id)}
                                                    className="select select-sm select-info max-w-xs"
                                                >
                                                    <option value={"pending"} selected={product?.status === "pending"}>Pending</option>
                                                    <option value={"approve"} selected={product?.status === "approve"}>Approve</option>
                                                    <option value={"reject"} selected={product?.status === "reject"}>Reject</option>
                                                </select>
                                            </td>
                                            <td className="text-center">
                                                <select
                                                    disabled={user?.email === "admin@gmail.com"}
                                                    onChange={(event) => handlerProdMakeFeatured(event, product?.featured, product?._id)}
                                                    className="select select-sm select-info max-w-xs"
                                                >
                                                    <option value={"isFeatured"} selected={product?.featured === "isFeatured"}>Featured</option>
                                                    <option value={"notFeatured"} selected={product?.featured === "notFeatured"}>Not Featured</option>

                                                </select>
                                            </td>
                                            <td className="space-x-1 text-center max-md:space-y-1">
                                                <div className="tooltip tooltip-left" data-tip="Product Details">
                                                    <button
                                                        className="btn btn-sm btn-circle"
                                                        onClick={() => redirectTo(`/product-details/${product?._id}`)}
                                                    >
                                                        <MdInfo className="text-xl"></MdInfo>
                                                    </button>
                                                </div>
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

export default ProdReviewQueue;