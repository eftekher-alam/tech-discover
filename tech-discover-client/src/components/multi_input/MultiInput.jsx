import "./tags.css"
import { WithContext as ReactTags } from 'react-tag-input';
import PropTypes from 'prop-types';

const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const MultiInput = ({ tags, setTags, suggestTags, placeholderText }) => {

    console.log("suggestTags", suggestTags);

    const suggestions = suggestTags.map(tag => {
        return {
            id: tag,
            text: tag
        };
    });


    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        // console.log(tag);
        // return;
        setTags([...tags, tag]);
    };

    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };


    return (
        <ReactTags
            tags={tags}
            suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleTagClick={handleTagClick}
            inputFieldPosition="bottom"
            placeholder={placeholderText}
            autocomplete
        />
    );
};

MultiInput.propTypes = {
    tags: PropTypes.array,
    suggestTags: PropTypes.array,
    setTags: PropTypes.func,
    placeholderText: PropTypes.string
}

export default MultiInput;