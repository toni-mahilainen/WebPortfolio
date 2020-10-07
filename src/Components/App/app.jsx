import React, { Component } from 'react';
import './app.css';
import Portfolio from '../Portfolio/portfolio';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditPortfolio from '../EditPortfolio/editPortfolio';
import Main from '../Main/main';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import PortfolioPublic from '../PortfolioPublic/portfolioPublic';

class App extends Component {
    render() {
        return (
            <Router>
                <div id="backgroundWrapper">
                    <Header />
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route path="/portfolio" component={Portfolio} />
                        <Route path="/myportfolio" component={PortfolioPublic} />
                        <Route path="/editportfolio" component={EditPortfolio} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;