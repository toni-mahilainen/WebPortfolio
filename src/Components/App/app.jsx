import React, { Component } from 'react';
import './app.css';
import Portfolio from '../Portfolio/portfolio';
import AuthService from '../LoginHandle/AuthService';
import Frontpage from '../FrontPage/frontpage';
const Auth = new AuthService();

class App extends Component {
    render() {
        // If logged in, portfolio is rendered
        if (Auth.loggedIn()) {
            return (
                <Portfolio />
            );
        } else {
            return (
                <Frontpage />
            );
        }
    }
}

export default App;