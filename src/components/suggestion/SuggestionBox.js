/**
 * @author lusinabrian on 10/08/17.
 * @notes: Suggestion Box that will contain all suggestions from Github API
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SuggestionItem from './SuggestionItem';
import Rx from 'rxjs/Rx';
import {GITHUB_API_URL}from '../../constants/constants'

export default class SuggestionBox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};

        this._onRefreshSuggestions = this._onRefreshSuggestions.bind(this)
    }

    /**
     * Callback to refresh suggestions from Github
     * */
    _onRefreshSuggestions(event) {
        event.preventDefault();
        let refreshObservable = Rx.Observable.fromEvent(event, "click");

        // request observable that will get a random offset from github api
        let requestObservable = refreshObservable.startWith("startup click")
            .map( () => {
                let randomOffset = Math.floor( Math.random() * 500);
                return GITHUB_API_URL + randomOffset
            });

        console.log(requestObservable);

        // response observable
        let responseObservable = requestObservable.flatMap((requestUrl) => {
            return Rx.Observable.fromPromise()
        });
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    <h2>Who to follow</h2>
                    <a href="#" className="refresh" onClick={this._onRefreshSuggestions}>Refresh</a>
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
    }
}

SuggestionBox.propTypes = {
    myProps: PropTypes.string.isRequired
};
