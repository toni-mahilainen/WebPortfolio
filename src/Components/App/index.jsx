import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './index.css';
import Main from '../Main';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <nav id="nav" className="navbar navbar-expand-lg" onMouseEnter={this.heightUp} onMouseLeave={this.heightDown}>
                        <ul className="navbar-nav mr-auto ml-auto">
                            <li><Link id="etusivuLink" onClick={this.addActiveClass} to={"/"} className="nav-link">Main</Link></li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route exact path="/" component={Main} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;