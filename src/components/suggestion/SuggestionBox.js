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
        const suggestions = [];
        for(let n = 1; n < 4; n++) {
            suggestions.push(<SuggestionItem suggestionPos={n}/>)
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

SuggestionBox.propTypes = {
    myProps: PropTypes.string.isRequired
};
