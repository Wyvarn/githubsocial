import React from 'react';
import PropTypes from 'prop-types';
import SuggestionItem from './SuggestionItem';

/**
 * SuggestionBox stateless component
 */
const SuggestionBox = ({}) => {
    return (
        <div className="container">
            <div className="header">
                <h2>Who to follow</h2>
                <a href="#" className="refresh">Refresh</a>
            </div>
            <ul className="suggestions">
                <SuggestionItem suggestionPos={1}/>
                <li className="suggestion2">
                    <img />
                    <a href="#" target="_blank" className="username">neither this</a>
                    <a href="#" className="close close2">x</a>
                </li>
                <li className="suggestion3">
                    <img />
                    <a href="#" target="_blank" className="username">nor this</a>
                    <a href="#" className="close close3">x</a>
                </li>
            </ul>
        </div>
    );
};

/**
 * Prop validation
 */
// SuggestionBox.propTypes = {
//     myProps: PropTypes.string.isRequired
// };

export default SuggestionBox;