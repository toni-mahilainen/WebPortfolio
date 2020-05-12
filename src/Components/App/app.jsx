import React, { Component } from 'react';
import './app.css';
import Portfolio from '../Portfolio/portfolio';
// import AuthService from '../LoginHandle/AuthService';
import Frontpage from '../FrontPage/frontpage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// const Auth = new AuthService();

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Frontpage} />
                    <Route path="/portfolio" component={Portfolio} />
                </Switch>
            </Router>
        );
        // // If logged in, portfolio is rendered
        // if (Auth.loggedIn()) {
        //     return (
        //         <Portfolio />
        //     );
        // } else {
        //     return (
        //         <Frontpage />
        //     );
        // }
    }
}

export default App;