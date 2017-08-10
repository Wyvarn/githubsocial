import React, {Component} from 'react';
import logo from '../images/svg/logo.svg';
import SuggestionBox from './SuggestionBox';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Github Social</h2>
                </div>
                <SuggestionBox/>
            </div>
        );
    }
}

export default App;
