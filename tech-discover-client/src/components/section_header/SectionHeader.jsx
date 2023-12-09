import PropTypes from 'prop-types';

const SectionHeader = ({ heading, subHeading }) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className="text-4xl inline-block uppercase gradient-text font-bold" data-aos="fade-up">{heading}</h1>
            <p className='font-semibold' data-aos="fade-up" data-aos-delay="50">{subHeading}</p>
        </div>
    );
};

SectionHeader.propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.string
}

export default SectionHeader;