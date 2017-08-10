/**
 * @author lusinabrian on 10/08/17.
 * @notes: Suggestion Box that will contain all suggestions from Github API
 */

import React, {Component} from 'react';
import SuggestionItem from './SuggestionItem';
import Rx from 'rxjs/Rx';
import { GITHUB_API_URL, GITHUB_API_USERS_URL_}from '../../constants/constants'
import $ from 'jquery';

export default class SuggestionBox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            responseObservable: undefined,
            refreshObservable: undefined,
            githubUsers : []
        };

        this._onRefreshSuggestions = this._onRefreshSuggestions.bind(this);
        this._createSuggestionObservable = this._createSuggestionObservable.bind(this);
        this._closeButtonHandler = this._closeButtonHandler.bind(this);
        this._renderSuggestion = this._renderSuggestion.bind(this);
        this._createSuggestions = this._createSuggestions.bind(this);
    }


    /**
     * Callback to refresh suggestions from Github
     * */
    _onRefreshSuggestions(event) {
        event.preventDefault();
        let refreshObservable = Rx.Observable.fromEvent(event, "click");

        // request observable that will get a random offset from github api
        let requestObservable = refreshObservable.startWith("startup click")
            .map(() => {
                let randomOffset = Math.floor(Math.random() * 500);
                return GITHUB_API_URL + randomOffset
            });

        // response observable
        let responseObservable = requestObservable.flatMap((requestUrl) => {
            return Rx.Observable.fromPromise($.getJSON(requestUrl))
        });

        this.setState({refreshObservable, responseObservable});
    }

    /**
     * Callback that will be passed down to each close button for suggestions
     * @param {Object} event
     * */
    _closeButtonHandler(event) {
        event.preventDefault();
        let closeObservable = Rx.Observable.fromEvent(event, "click");
        let suggestedObservable = this._createSuggestionObservable(closeObservable);

        suggestedObservable.subscribe((suggestedUser) => {
            this._renderSuggestion(suggestedUser, ".suggestion1")
        })
    }

    /**
     * Creates a suggestion list from the responseObservable we get
     * This will return a suggestion observable
     * */
    _createSuggestionObservable(closeClickObservable) {
        return closeClickObservable.startWith("startup click")
            .combineLatest(this.state.responseObservable, (click, listUsers) => {
                return listUsers[Math.floor(Math.random() * listUsers.length)];
            }).merge(
                this.state.refreshObservable.map(
                    () => {
                        return null
                    }
                )
            ).startWith(null);
    }

    /**
     * Renders a suggestion to be displayed
     * @param {Object} suggestedUser user suggested by Github API
     * @param {String} selector, DOM selector
     * */
    _renderSuggestion(suggestedUser, selector) {
        let suggestedEl = document.querySelector(selector);
        if (suggestedUser === null) {
            suggestedEl.style.visibility = 'hidden';
        } else {
            suggestedEl.style.visibility = 'visible';
            let usernameEl = suggestedEl.querySelector('.username');
            usernameEl.href = suggestedUser.html_url;
            usernameEl.textContent = suggestedUser.login;
            let imgEl = suggestedEl.querySelector('img');
            imgEl.src = "";
            imgEl.src = suggestedUser.avatar_url;
        }
    }

    /**
     * perform network request to update suggestions to the DOM
     * This will be used to update suggestions on every mount
     * */
    componentDidMount(){
        let requestObservable = Rx.Observable.of(GITHUB_API_USERS_URL_);
        let responseObservable = requestObservable.flatMap((requestUrl) => {
            return Rx.Observable.fromPromise($.getJSON(requestUrl));
        });

        // now we can render to DOM
        responseObservable.subscribe((response) => {
            this._createSuggestions(response);
        })
    }

    /**
     * This will be used to create suggestions from the API, will take in a github User object
     * and render to DOM.
     * This will populate the github users array in the state of this component
     * @param {Object} githubUserList
     * */
    _createSuggestions(githubUserList){

        console.log(githubUserList);
    }

    render() {
        const suggestions = [];
        for (let n = 1; n < 4; n++) {
            suggestions.push(<SuggestionItem key={n}
                                             suggestionPos={n}
                                             closeBtnHandler={this._closeButtonHandler}/>)
        }
        return (
            <div className="container">
                <div className="header">
                    <h2>Who to follow</h2>
                    <a href="#" className="refresh" onClick={this._onRefreshSuggestions}>Refresh</a>
                </div>
                <ul className="suggestions">
                    {suggestions}
                </ul>
            </div>
        );
    }
}

// SuggestionBox.propTypes = {
//     myProps: PropTypes.string.isRequired
// };
