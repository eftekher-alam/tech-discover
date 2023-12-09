import { useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import useSecureAxios from "../../hooks/useSecureAxios";
import { useState } from "react";
import Review from "./review";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { AuthContext } from "../../providers/AuthProvider";

const Reviews = ({ product }) => {
    const secureAxios = useSecureAxios();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const { user } = useContext(AuthContext);
    const [reviewPostPermission, setReviewPostPermission] = useState(false);

    useEffect(() => {
        if (product?._id) {
            secureAxios.get(`/reviews?productId=${product?._id}`)
                .then(res => {
                    setReviews(res?.data);
                })
        }

        if (user?.uid && product?._id) {
            // console.log(`/reviewPermission?userId=${user?.uid}&roomId=${room?._id}`);
            secureAxios.get(`/reviewPermission?firebaseUserId=${user?.uid}&productId=${product?._id}`)
                .then(res => {
                    setReviewPostPermission(res?.data?.success);
                })
        }

    }, [secureAxios, product, user])

    const handlerPostReview = (event) => {
        event.preventDefault();

        console.log("permission", reviewPostPermission);
        if (!reviewPostPermission) {
            Swal.fire({
                title: "You can post review for each product only once",
                icon: "error",
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }

        const reviewText = event.target.review.value;

        if (rating < 1) {
            Swal.fire({
                title: "Please, select rating",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (!reviewText) {
            Swal.fire({
                title: "Review can't be empty",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const review = {
            firebaseUserId: user?.uid,
            productId: product?._id,
            rating,
            review: reviewText
        }


        secureAxios.post("/review", review)
            .then(res => {
                event.target.reset();
                setRating(0);

                if (res?.data?.success) {
                    if (product?._id) {
                        secureAxios.get(`/reviews?productId=${product?._id}`)
                            .then(res => {
                                setReviews(res?.data);
                            })
                    }

                    Swal.fire({
                        title: "Your review is added.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setReviewPostPermission(false);
                }
            })

    }

    return (
        <div>
            <div>
                <div>
                    {
                        reviews && reviews?.map((review, index) => <Review key={index} reviewInfo={review}></Review>)

                    }
                    {
                        !reviews.length && <div className='text-gray-400'> This product has no reviews.</div>
                    }
                </div>

            </div>
            <hr></hr>
            <div className="pt-4">
                <div className='space-y-6'>
                    <div className='space-y-1'>
                        <p className="text-xl ">Overall, how would you rate the product?</p>
                        <Rating
                            style={{ maxWidth: 180 }}
                            value={rating}
                            onChange={setRating}
                            isRequired
                        />
                    </div>
                    <div>
                        <form onSubmit={handlerPostReview}>
                            <div className='space-y-2'>
                                <p className="text-xl">Let us know your thoughts!</p>
                                <textarea name="review" placeholder="Type here..." className="textarea textarea-bordered textarea-lg w-full " ></textarea>
                            </div>
                            <button type='submit' className="button mt-2">Submit Review
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

Reviews.propTypes = {
    product: PropTypes.object
}


export default Reviews;