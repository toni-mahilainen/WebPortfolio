import React, { Component } from 'react';
import './app.css';
import Portfolio from '../Portfolio/portfolio';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditPortfolio from '../EditPortfolio/editPortfolio';
import Main from '../Main/main';
import Header from '../Header/header';
import Footer from '../Footer/footer';

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
    }
}

export default App;