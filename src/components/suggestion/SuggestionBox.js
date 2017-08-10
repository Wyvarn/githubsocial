/**
 * @author lusinabrian on 10/08/17.
 * @notes: Suggestion Box that will contain all suggestions from Github API
 * ref => https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
 * ref => http://jsfiddle.net/staltz/8jFJH/48/
 * ref => https://github.com/reactivex/rxjs
 * https://github.com/Reactive-Extensions/RxJS
 */

import React, {Component} from 'react';
import SuggestionItem from './SuggestionItem';
import Rx from 'rxjs/Rx';
import {GITHUB_API_URL, GITHUB_API_USERS_URL_}from '../../constants/constants'
import $ from 'jquery';

export default class SuggestionBox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            responseObservable: undefined,
            refreshObservable: undefined,
            githubUsers: []
        };

        this._onRefreshSuggestions = this._onRefreshSuggestions.bind(this);
        this._createSuggestionObservable = this._createSuggestionObservable.bind(this);
        this._closeButtonHandler = this._closeButtonHandler.bind(this);
        this._renderSuggestion = this._renderSuggestion.bind(this);
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
     * Will update the state with github users
     * */
    componentDidMount() {
        let requestObservable = Rx.Observable.of(GITHUB_API_USERS_URL_);
        let responseObservable = requestObservable.flatMap((requestUrl) => {
            return Rx.Observable.fromPromise($.getJSON(requestUrl));
        });

        // now we can render to DOM
        responseObservable.subscribe((githubUsers) => {
            let githubUsersArr = githubUsers.map((githubUser, index) => {
                return <SuggestionItem
                    key={index}
                    avatar_url={githubUser.avatar_url} events_url={githubUser.events_url}
                    followers_url={githubUser.followers_url}
                    following_url={githubUser.following_url} gists_url={githubUser.gists_url}
                    gravatar_id={githubUser.gravatar_id}
                    html_url={githubUser.html_url} id={githubUser.id}
                    login={githubUser.login} organizations_url={githubUser.organizations_url}
                    received_events_url={githubUser.received_events_url}
                    repos_url={githubUser.repos_url} site_admin={githubUser.site_admin}
                    starred_url={githubUser.starred_url}
                    subscriptions_url={githubUser.subscriptions_url}
                    type={githubUser.type} url={githubUser.url} suggestionPos={index}
                    closeBtnHandler={this._closeButtonHandler}/>
            });
            this.setState({githubUsers: githubUsersArr})
        });
    }

    render() {

        return (
            <div className="container">
                <div className="header">
                    <h2>Who to follow</h2>
                    <a href="#" className="refresh"
                       onClick={this._onRefreshSuggestions}>Refresh</a>
                </div>

                <ul className="suggestions">
                    {this.state.githubUsers}
                </ul>
            </div>
        );
    }
}
