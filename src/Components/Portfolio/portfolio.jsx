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
        this.getContent = this.getContent.bind(this);
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
                }, this.getContent);
            }
            catch (err) {
                this.Auth.logout()
            }
        }
    }

    getContent() {
        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + this.state.User.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const emailSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/emails/' + this.state.User.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);

        Promise.all([contentGet, emailGet])
            .then((responses) => {
                this.setState({
                    Content: responses[0].data[0],
                    Emails: responses[1].data
                });
            })
            .catch(errors => {
                console.log("Content error: " + errors[0].data);
                console.log("Email error: " + errors[1]);
            })

        // Axios(settings)
        //     .then(response => {
        //         console.log(response);
        //         this.setState({
        //             Content: response.data[0]
        //         });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    render() {
        return (
            <Fragment>
                <main className="portfolio">
                    <Home punchline={this.state.Content.punchline} />
                    <IAm content={this.state.Content} />
                    <ICan content={this.state.User.nameid} />
                    <Questbook content={this.state.User.nameid} />
                    <Contact content={this.state.User.nameid} />
                </main>
            </Fragment>
        );
    }
}

export default Portfolio;