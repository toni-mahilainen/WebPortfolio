import React, { Component, Fragment } from 'react';
import './portfolio.css';
import Home from './Home/home';
import IAm from './IAm/iAm';
import ICan from './ICan/iCan';
import Questbook from './Questbook/questbook';
import Contact from './Contact/contact';

class Portfolio extends Component {
    componentDidMount() {
        // re-position a footer
        let footer = document.getElementById("footer");
        if (footer.classList.contains("absolute")) {
            footer.classList.remove("absolute");
        }
    }

    render() {
        return (
            <Fragment>
                <main className="portfolio">
                    <Home />
                    <IAm />
                    <ICan />
                    <Questbook />
                    <Contact />
                </main>
            </Fragment>
        );
    }
}

export default Portfolio;