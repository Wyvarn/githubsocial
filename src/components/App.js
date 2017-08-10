import React, {Component} from 'react';
import logo from '../images/svg/logo.svg';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Github Social</h2>
                </div>

                <div className="container">
                    <div className="header">
                        <h2>Who to follow</h2><a href="#" className="refresh">Refresh</a>
                    </div>
                    <ul className="suggestions">
                        <li className="suggestion1">
                            <img />
                            <a href="#" target="_blank" className="username">this will not be displayed</a>
                            <a href="#" className="close close1">x</a>
                        </li>
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

            </div>
        );
    }
}

export default App;
