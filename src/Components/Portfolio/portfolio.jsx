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
            Emails: "",
            SocialMediaLinks: []
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

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + this.state.User.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);
        const socialMediaGet = Axios(socialMediaSettings);

        Promise.all([contentGet, emailGet, socialMediaGet])
            .then((responses) => {
                let linkArray = []
                for (let index = 0; index < responses[2].data.length; index++) {
                    const element = responses[2].data[index];
                    linkArray.push(element);                    
                }

                console.log(linkArray);
                console.log(responses[0].data[0]);
                
                this.setState({
                    Content: responses[0].data[0],
                    Emails: responses[1].data,
                    SocialMediaLinks: linkArray
                });
            })
            .catch(errors => {
                console.log("Content error: " + errors[0]);
                console.log("Email error: " + errors[1]);
                console.log("Social media error: " + errors[2]);
            })
    }

    render() {
        return (
            <Fragment>
                <main className="portfolio">
                    <Home punchline={this.state.Content.punchline} />
                    {/* Render component until both states are not null */}
                    {this.state.Content, this.state.Emails ? <IAm content={this.state.Content} emails={this.state.Emails} /> : null}
                    <ICan content={this.state.User.nameid} />
                    <Questbook content={this.state.User.nameid} />
                    {this.state.SocialMediaLinks ? <Contact links={this.state.SocialMediaLinks} /> : null}
                </main>
            </Fragment>
        );
    }
}

export default Portfolio;