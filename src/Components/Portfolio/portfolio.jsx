import React, { Component, Fragment } from 'react';
import './portfolio.css';
import HeaderLoggedIn from '../Header/HeaderLoggedIn/headerLoggedIn';
import Home from './Home/home';
import IAm from './IAm/iAm';
import ICan from './ICan/iCan';
import Questbook from './Questbook/questbook';
import Contact from './Contact/contact';
import Footer from '../Footer/footer';
import withAuth from '../LoginHandle/withAuth';
import { withRouter } from 'react-router-dom';

class Portfolio extends Component {
    render() {
        return (
            <Fragment>
                <HeaderLoggedIn />
                <main className="portfolio">
                    <Home />
                    <IAm />
                    <ICan />
                    <Questbook />
                    <Contact />
                </main>
                <Footer />
            </Fragment>
        );
    }
}

// export default Portfolio;
export default withRouter(withAuth(Portfolio));