/**
 * @author lusinabrian on 10/08/17.
 * @notes: Suggestion Box that will contain all suggestions from Github API
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SuggestionItem from './SuggestionItem';
import Rx from 'rxjs/Rx';
import {GITHUB_API_URL}from '../../constants/constants'
import $ from 'jquery';

export default class SuggestionBox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            responseObservable : {},
            refreshObservable : {}
        };

        this._onRefreshSuggestions = this._onRefreshSuggestions.bind(this);
        this._createSuggestionObservable = this._createSuggestionObservable.bind(this);
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

        // response observable
        let responseObservable = requestObservable.flatMap((requestUrl) => {
            return Rx.Observable.fromPromise($.getJSON(requestUrl))
        });

        this.setState({refreshObservable, responseObservable});
    }

    /**
     * Creates a suggestion list from the responseObservable we get
     * */
    _createSuggestionObservable(closeClickObservable){
        return closeClickObservable.startWith("startup click")
            .combineLatest(this.state.responseObservable, (click, listUsers) => {
                return listUsers[Math.floor(Math.random()*listUsers.length)];
            }).merge(
                this.state.refreshObservable.map(
                    () => {return null}
                )
            ).startWith(null);
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
