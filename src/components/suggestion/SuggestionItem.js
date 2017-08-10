import React from 'react';
import PropTypes from 'prop-types';

/**
 * SuggestionItem stateless component
 * This is a single suggestion item from Github API
 */
const SuggestionItem = ({suggestionPos}) => {
    return (
        <li className={"suggestion" + suggestionPos}>
            <img />
            <a href="#" target="_blank" className="username">this will not be displayed</a>
            <a href="#" className={"close close" + suggestionPos}>x</a>
        </li>
    );
};

/**
 * Prop validation
 */
SuggestionItem.propTypes = {
    suggestionPos: PropTypes.number.isRequired
};

export default SuggestionItem;