import { Rating } from '@smastrom/react-rating';
import PropTypes from 'prop-types';
import '@smastrom/react-rating/style.css'
import moment from 'moment/moment';

const Review = ({ reviewInfo }) => {
    const { username, rating, review, reviewData } = reviewInfo;
    return (
        <div className='pb-4'>
            <h2 className='font-semibold text-xl'>{username}</h2>
            <div className='font-jost'>
                <div><Rating style={{ maxWidth: 100 }} value={rating} isDisabled /></div>
                <p className='text-gray-400'>Reviewed on {moment(reviewData).format("MMM DD, YYYY")}</p>
                <p>{review}</p>
            </div>
        </div>
    );
};

Review.propTypes = {
    reviewInfo: PropTypes.object
}

export default Review;