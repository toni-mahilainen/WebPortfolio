import React, { Component } from 'react';
import './portfolio.css';
import HeaderLoggedIn from '../Header/HeaderLoggedIn/headerLoggedIn';
import Home from './Home/home';
import IAm from './IAm/iAm';
import ICan from './ICan/iCan';
import Questbook from './Questbook/questbook';
import Contact from './Contact/contact';
import Footer from '../Footer/footer';

class Portfolio extends Component {
    render() {
        return (
            <main className="portfolio">
                <HeaderLoggedIn />
                <Home />
                <IAm />
                <ICan />
                <Questbook />
                <Contact />
                <Footer />
            </main>
        );
    }
}

export default Portfolio;
// export default withRouter(withAuth(Portfolio));