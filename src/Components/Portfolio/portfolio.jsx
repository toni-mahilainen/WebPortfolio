import React, { Component, Fragment } from 'react';
import './portfolio.css';
import Home from './Home/home';
import IAm from './IAm/iAm';
import ICan from './ICan/iCan';
import Questbook from './Questbook/questbook';
import Contact from './Contact/contact';
import AuthService from '../LoginHandle/AuthService';
import Axios from 'axios';

class Portfolio extends Component {
    constructor() {
        super();
        this.state = {
            User: "",
            Content: "",
            Emails: ""
        }
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // re-position a footer
        let footer = document.getElementById("footer");
        if (footer.classList.contains("absolute")) {
            footer.classList.remove("absolute");
        }

        // Checks if user is already logged in and then sets users profile (or null) into state variable according to logged in status
        if (!this.Auth.loggedIn()) {
            this.setState({
                User: null
            });
        }
        else {
            try {
                const profile = this.Auth.getProfile()
                this.setState({
                    User: profile
                });
            }
            catch (err) {
                this.Auth.logout()
            }
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