import React, { Component, Fragment } from 'react';
import './app.css';
import Main from '../Main/main';
import HeaderLoggedOut from '../Header/HeaderLoggedOut/headerLoggedOut';
import EditPortfolio from '../EditPortfolio/editPortfolio';
import Footer from '../Footer/footer';
import Portfolio from '../Portfolio/portfolio';

class App extends Component {
    render() {
        let temp = 0;
        if (temp === 1 /* jos on kirjauduttu sisään */) {
            return (
                <Portfolio />
            );
        } else {
            return (
                <Fragment>
                    <HeaderLoggedOut />
                    <Main />
                    <EditPortfolio />
                    <Footer />
                </Fragment>
            );
        }

    }
}

export default App;