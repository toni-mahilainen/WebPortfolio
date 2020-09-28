import React, { Component } from 'react';
import './app.css';
import Portfolio from '../Portfolio/portfolio';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditPortfolio from '../EditPortfolio/editPortfolio';
import Main from '../Main/main';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/portfolio" component={Portfolio} />
                    <Route path="/editportfolio" component={EditPortfolio} />
                </Switch>
            </Router>
        );
    }
}

export default App;