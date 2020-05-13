import React, { Component } from 'react';
import './app.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import Portfolio from '../Portfolio/portfolio';
// import AuthService from '../LoginHandle/AuthService';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditPortfolio from '../EditPortfolio/editPortfolio';
import Main from '../Main/main';
// const Auth = new AuthService();

class App extends Component {
    render() {
        return (
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/portfolio" component={Portfolio} />
                    <Route path="/editportfolio" component={EditPortfolio} />
                </Switch>
                <Footer />
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