import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { MdOutlineWatchLater } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './../../providers/AuthProvider';
import useSecureAxios from './../../hooks/useSecureAxios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Rating } from '@smastrom/react-rating';

const Product = ({ product }) => {
    const { _id, productImage, productName, description, upvote, downvote, tags, postDate, ownerName, ownerImage } = product;
    // console.log(product);
    const secureAxios = useSecureAxios();
    const { user } = useContext(AuthContext);
    const currentLocation = useLocation().pathname;
    // console.log("user from product ", user);

    const navigate = useNavigate();
    const [voteStatus, setVoteStatus] = useState();
    const [upVote, setUpVote] = useState(upvote);
    const [downVote, setDownVote] = useState(downvote);


    //Get vote status for the user.
    useEffect(() => {
        if (user?.uid && _id) {
            // console.log(`/vote-info?productId=${_id}&firebaseUserId=${user?.uid}`);
            secureAxios.get(`/vote-info?productId=${_id}&firebaseUserId=${user?.uid}`)
                .then(res => {
                    setVoteStatus(res.data);
                })
        }
        else
            setVoteStatus("noVote");
    }, [secureAxios, user, _id])

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
                productId: _id,
                typeOfVote: "upVote",
                firebaseUserId: user?.uid,
                upVote: currentUpVote,
                downVote: currentDownVote
            }
            secureAxios.post('/vote', voteInfo).then();
        }
        else if (voteStatusToDB === "downVote") {
            const voteInfo = {
                productId: _id,
                typeOfVote: "downVote",
                firebaseUserId: user?.uid,
                upVote: currentUpVote,
                downVote: currentDownVote
            }
            secureAxios.post('/vote', voteInfo).then();

        }
        else if (voteStatusToDB === "noVote") {
            const voteInfo = {
                productId: _id,
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


    //review
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    useEffect(() => {
        if (product?._id) {
            secureAxios.get(`/reviews?productId=${product?._id}`)
                .then(res => {
                    setReviews(res?.data);
                })
        }
    }, [secureAxios, product])

    useEffect(() => {
        const ratingArray = reviews?.map((review) => {
            return review?.rating;
        })

        const total = ratingArray?.reduce((total, value) => total + value, 0);
        setAverageRating(Math.floor(total / reviews?.length));
    }, [reviews])


    return (
        <div data-aos="fade-up" data-aos-delay="100">
            <div className="card glass">
                <figure onClick={() => navigate(`/product-details/${_id}`)} className='hover:cursor-pointer' ><img src={productImage[0]} /></figure>
                <div className="card-body p-3">
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1 justify-start items-center'>
                            <img src={ownerImage} className='w-5 h-5 rounded-full' />
                            <p className="text-gray-500 text-xs">{ownerName}</p>
                        </div>
                        <div className='flex gap-1 justify-end items-center'>
                            <MdOutlineWatchLater className='text-gray-500 text-sm' />
                            <p className="text-gray-500 text-xs">{postDate}</p>
                        </div>
                    </div>
                    <h2 className="card-title text-lg hover:cursor-pointer" onClick={() => navigate(`/product-details/${_id}`)}>{productName}</h2>
                    <p>{description.slice(0, 50)}...<span onClick={() => navigate(`/product-details/${_id}`)} className='link text-violet-500'>read more</span> </p>
                    <div className='flex flex-wrap'>
                        {
                            tags && tags.map((tag, index) => <span key={index} className={`pr-1 text-sm text-gray-500`}>#{tag}</span>)
                        }
                    </div>
                    <div className="card-actions  justify-start">
                        <div className='flex justify-center items-center gap-2'>
                            <Rating style={{ maxWidth: 80 }} value={averageRating} isDisabled />
                            <p className='text-sm text-gray-500'>({reviews?.length} reviews)</p>
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
            </div>
        </div>
    );
};

Product.propTypes = {
    product: PropTypes.object
}

export default Product;