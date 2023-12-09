import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { AuthContext } from "../../providers/AuthProvider";
import { MdOutlineWatchLater } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi";
import useSecureAxios from "../../hooks/useSecureAxios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import Reviews from "../reviews/Reviews";
import { Helmet } from "react-helmet";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const { productImage, productName, description, tags, postDate, specifications, ownerName, ownerImage } = product;
    const { user } = useContext(AuthContext);
    const secureAxios = useSecureAxios();
    const [isLoading, setIsLoading] = useState(true);

    const [upVote, setUpVote] = useState();
    const [downVote, setDownVote] = useState();
    const currentLocation = useLocation().pathname;
    const navigate = useNavigate();
    const [voteStatus, setVoteStatus] = useState();

    useEffect(() => {
        setIsLoading(true)
        window.scrollTo(0, 0);
        secureAxios.get(`/product/${id}`)
            .then(res => {
                setIsLoading(false);
                setProduct(res?.data);
                setUpVote(res?.data?.upvote);
                setDownVote(res?.data?.downvote);

            })

    }, [secureAxios, id]);


    //Get vote status for the user.
    useEffect(() => {
        if (user?.uid && id) {
            // console.log(`/vote-info?productId=${_id}&firebaseUserId=${user?.uid}`);
            secureAxios.get(`/vote-info?productId=${id}&firebaseUserId=${user?.uid}`)
                .then(res => {
                    setVoteStatus(res.data);
                })
        }
        else
            setVoteStatus("noVote");
    }, [secureAxios, user, id])

    const isUserToVote = () => {
        if (!user?.uid) {
            Swal.fire({
                title: "Login is required.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Continue"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login", { state: currentLocation });
                }
            });
            return false;
        }
        return true;
    }

    const voteStoreToDB = (voteStatusToDB, currentUpVote, currentDownVote) => {
        // console.log(currentUpVote, currentDownVote, voteStatusToDB);
        if (voteStatusToDB === "upVote") {
            const voteInfo = {
                productId: id,
                typeOfVote: "upVote",
                firebaseUserId: user?.uid,
                upVote: currentUpVote,
                downVote: currentDownVote
            }
            secureAxios.post('/vote', voteInfo).then();
        }
        else if (voteStatusToDB === "downVote") {
            const voteInfo = {
                productId: id,
                typeOfVote: "downVote",
                firebaseUserId: user?.uid,
                upVote: currentUpVote,
                downVote: currentDownVote
            }
            secureAxios.post('/vote', voteInfo).then();

        }
        else if (voteStatusToDB === "noVote") {
            const voteInfo = {
                productId: id,
                typeOfVote: "noVote",
                firebaseUserId: user?.uid,
                upVote: currentUpVote,
                downVote: currentDownVote
            }
            secureAxios.post('/vote', voteInfo).then();
        }
    }


    const handlerUpVoteAdd = () => {

        if (!isUserToVote())
            return;

        setVoteStatus("upVote");
        setUpVote(upVote + 1);
        let currentUpVote = upVote + 1;

        let currentDownVote = downVote;
        if (voteStatus === "downVote") {
            setDownVote(downVote - 1);
            currentDownVote = downVote - 1;
        }
        voteStoreToDB("upVote", currentUpVote, currentDownVote);
    }

    const handlerUpVoteRemove = () => {
        if (!isUserToVote())
            return;

        setUpVote(upVote - 1);
        let currentUpVote = upVote - 1;
        let currentDownVote = downVote;
        setVoteStatus("noVote");
        voteStoreToDB("noVote", currentUpVote, currentDownVote);
    }

    const handlerDownVoteAdd = () => {
        if (!isUserToVote())
            return;

        setVoteStatus("downVote");
        setDownVote(downVote + 1);
        let currentDownVote = downVote + 1;

        let currentUpVote = upVote;
        if (voteStatus === "upVote") {
            setUpVote(upVote - 1);
            currentUpVote = upVote - 1;
        }
        voteStoreToDB("downVote", currentUpVote, currentDownVote);
    }

    const handlerDownVoteRemove = () => {

        if (!isUserToVote())
            return;
        setDownVote(downVote - 1);
        let currentDownVote = downVote - 1;
        let currentUpVote = upVote;
        setVoteStatus("noVote")
        voteStoreToDB("noVote", currentUpVote, currentDownVote);
    }

    // console.log(upVote, downVote);

    return (
        <div>
            <Helmet>
                <title>Tech Discover | Details</title>
            </Helmet>
            {
                isLoading && <div className="w-full min-h-screen flex justify-center items-center"><span className="loading loading-dots loading-lg"></span></div>
            }
            <div className="min-h-screen p-10 max-md:pt-24 md:p-28">

                <div className="grid lg:grid-cols-2 gap-16 max-lg:pb-8">
                    <div className="">
                        <Carousel className="w-[80%] md:w-[60%] lg:w-[70%] mx-auto">
                            {
                                productImage && productImage.map((image, index) =>
                                    <div key={index}>
                                        <img src={image} />
                                    </div>
                                )
                            }
                        </Carousel>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl gradient-text font-bold inline-block">{productName}</h1>
                            <div className='flex justify-start gap-16 items-center'>
                                <div className='flex gap-1 justify-start items-center'>
                                    <img src={ownerImage} className='w-8 h-8 rounded-full' />
                                    <p className="text-gray-500 text-sm font-bold">{ownerName}</p>
                                </div>
                                <div className='flex gap-1 justify-end items-center'>
                                    <MdOutlineWatchLater className='text-gray-500 text-sm' />
                                    <p className="text-gray-500 text-sm">{postDate}</p>
                                </div>
                            </div>
                            <div className='flex flex-wrap'>
                                {
                                    tags && tags.map((tag, index) => <span key={index} className={`pr-1 text-sm text-gray-500`}>#{tag}</span>)
                                }
                            </div>
                        </div>
                        <div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Property</th>
                                            <th className="text-center">Specification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            specifications && Object.entries(specifications).map(([key, value], index) =>
                                                <tr key={index}>
                                                    <td>{key}</td>
                                                    <td className="flex justify-center" >{
                                                        typeof value === "boolean" ?
                                                            (
                                                                value ?
                                                                    <TiTick className="text-success text-xl" /> :
                                                                    <RxCross2 className="text-error text-xl" />
                                                            )
                                                            : value
                                                    }</td>
                                                </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div >
                            {
                                (voteStatus === "upVote") ?
                                    <button
                                        onClick={handlerUpVoteRemove}
                                        className='btn btn-sm rounded-l-full'>
                                        <BiSolidUpvote />
                                        {upVote?.toString().length > 3 ? (upVote / 1000).toFixed(1) + "k" : upVote}
                                    </button>
                                    :
                                    <button
                                        onClick={handlerUpVoteAdd}
                                        className='btn btn-sm rounded-l-full'>
                                        <BiUpvote />
                                        {upVote?.toString().length > 3 ? (upVote / 1000).toFixed(1) + "k" : upVote}
                                    </button>
                            }
                            {
                                (voteStatus === "downVote") ?
                                    <button
                                        onClick={handlerDownVoteRemove}
                                        className='btn btn-sm rounded-r-full'>
                                        <BiSolidDownvote />
                                        {downVote?.toString().length > 3 ? (downVote / 1000).toFixed(1) + "k" : downVote}
                                    </button>
                                    :
                                    <button
                                        onClick={handlerDownVoteAdd}
                                        className='btn btn-sm rounded-r-full'>
                                        <BiDownvote />
                                        {downVote?.toString().length > 3 ? (downVote / 1000).toFixed(1) + "k" : downVote}
                                    </button>
                            }

                        </div>
                    </div>

                </div>
                <div>
                    <div role="tablist" className="tabs tabs-lifted">
                        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Description" />
                        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">{description}</div>

                        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Reviews" checked />
                        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                            {
                                <Reviews product={product}></Reviews>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;