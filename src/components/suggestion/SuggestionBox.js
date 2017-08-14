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
import {GITHUB_API_URL_WITH_OFFSET, GITHUB_API_USERS_URL}from '../../constants/constants'
import $ from 'jquery';

export default class SuggestionBox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            responseObservable: undefined,
            refreshObservable: undefined,
            githubUsers: []
        };

        this._closeButtonHandler = this._closeButtonHandler.bind(this);
        this._renderSuggestion = this._renderSuggestion.bind(this);
        this._createOrRefreshObservables = this._createOrRefreshObservables.bind(this)
    }

    /**
     * Creates observables refresh and response observables for use
     * */
    _createOrRefreshObservables(event) {
        let refreshObservable;
        if (event !== undefined) {
            refreshObservable = Rx.Observable.fromEvent(event, "click");
        } else {
            refreshObservable = Rx.Observable.of(GITHUB_API_USERS_URL);
        }

        // request observable that will get a random offset from github api
        let requestObservable = refreshObservable.startWith("startup click")
            .map(() => {
                let randomOffset = Math.floor(Math.random() * 500);
                return GITHUB_API_URL_WITH_OFFSET + randomOffset
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
        let target = event.target.parentNode;
        let selector = target.classList[0];

        let closeObservable = Rx.Observable.fromEvent(event, "click");
        let suggestedObservable = closeObservable.startWith("startup click")
            .combineLatest(this.state.responseObservable, (click, listUsers) => {
                return listUsers[Math.floor(Math.random() * listUsers.length)];
            }).merge(
                this.state.refreshObservable.map(
                    () => {
                        return null
                    })
            ).startWith(null);

        //console.log(suggestedObservable);
        suggestedObservable.subscribe((suggestedUser) => {
            console.log(suggestedUser);
            console.log("in observable")
        })
        // suggestedObservable.subscribe((suggestedUser) => {
        //     console.log(suggestedUser);
        //     //this._renderSuggestion(suggestedUser, selector)
        // })
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
        let requestObservable = Rx.Observable.of(GITHUB_API_USERS_URL);
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

        this._createOrRefreshObservables()
    }

    render() {

        return (
            <div className="container">
                <div className="header">
                    <h2>Who to follow</h2>
                    <a href="#" className="refresh"
                       onClick={this._createOrRefreshObservables}>Refresh</a>
                </div>

                <ul className="suggestions">
                    {this.state.githubUsers}
                </ul>
            </div>
        );
    }
}
