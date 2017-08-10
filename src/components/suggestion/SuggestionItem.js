import React from 'react';
import PropTypes from 'prop-types';

/**
 * SuggestionItem stateless component
 * This is a single suggestion item from Github API
 * This will represent a single user from Github
 * avatar_url : "https://avatars0.githubusercontent.com/u/1?v=4"
 * events_url : "https://api.github.com/users/mojombo/events{/privacy}"
 * followers_url : "https://api.github.com/users/mojombo/followers"
 * following_url :"https://api.github.com/users/mojombo/following{/other_user}"
 * gists_url : "https://api.github.com/users/mojombo/gists{/gist_id}"
 * gravatar_id : ""
 * html_url : "https://github.com/mojombo"
 * id : 1
 * login : "mojombo"
 * organizations_url : "https://api.github.com/users/mojombo/orgs"
 * received_events_url : "https://api.github.com/users/mojombo/received_events"
 * repos_url : "https://api.github.com/users/mojombo/repos"
 * site_admin : false
 * starred_url : "https://api.github.com/users/mojombo/starred{/owner}{/repo}"
 * subscriptions_url : "https://api.github.com/users/mojombo/subscriptions"
 * type : "User"
 * url : "https://api.github.com/users/mojombo"
 */
const SuggestionItem = ({
                            avatar_url, events_url, followers_url, following_url, gists_url,
                            gravatar_id, html_url, id, login, organizations_url,
                            received_events_url, repos_url, site_admin, starred_url,
                            subscriptions_url, type, url, suggestionPos, closeBtnHandler
                        }) => {
    return (
        <li className={"suggestion "+suggestionPos}>
            <img alt="" src={avatar_url}/>
            <a href="#" target="_blank" className="username">{login}</a>
            <a href="#" className={"close close" + suggestionPos}
               onClick={closeBtnHandler}>x</a>
        </li>
    );
};

/**
 * Prop validation
 */
SuggestionItem.propTypes = {
    avatar_url: PropTypes.string,
    events_url: PropTypes.string,
    followers_url: PropTypes.string,
    following_url: PropTypes.string,
    gists_url: PropTypes.string,
    gravatar_id: PropTypes.string,
    html_url: PropTypes.string,
    id: PropTypes.number,
    login: PropTypes.string,
    organizations_url: PropTypes.string,
    received_events_url: PropTypes.string,
    repos_url: PropTypes.string,
    site_admin: PropTypes.bool,
    starred_url: PropTypes.string,
    subscriptions_url: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    suggestionPos: PropTypes.number.isRequired,
    closeBtnHandler: PropTypes.func.isRequired
};

export default SuggestionItem;