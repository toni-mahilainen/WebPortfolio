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
            Skills: "",
            QuestbookMessages: "",
            SocialMediaLinks: ""
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

        const skillsSettings = {
            url: 'https://localhost:5001/api/skills/' + this.state.User.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const questbookSettings = {
            url: 'https://localhost:5001/api/questbook/' + this.state.User.nameid,
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
        const skillsGet = Axios(skillsSettings);
        const questbookGet = Axios(questbookSettings);
        const socialMediaGet = Axios(socialMediaSettings);

        Promise.all([contentGet, emailGet, skillsGet, questbookGet, socialMediaGet])
            .then((responses) => {
                this.setState({
                    Content: responses[0].data[0],
                    Emails: responses[1].data,
                    Skills: responses[2].data,
                    QuestbookMessages: responses[3].data,
                    SocialMediaLinks: responses[4].data
                });
            })
            .catch(errors => {
                console.log("Content error: " + errors[0]);
                console.log("Email error: " + errors[1]);
                console.log("Skills error: " + errors[2]);
                console.log("Questbook error: " + errors[3]);
                console.log("Social media error: " + errors[4]);
            })
    }

    render() {
        return (
            <Fragment>
                <main className="portfolio">
                    {/* Render a component when state(s) are not null */}
                    {this.state.Content.punchline ? <Home punchline={this.state.Content.punchline} /> : null}
                    {this.state.Content && this.state.Emails ? <IAm content={this.state.Content} emails={this.state.Emails} /> : null}
                    {this.state.Skills ? <ICan skills={this.state.Skills} /> : null}
                    {this.state.QuestbookMessages ? <Questbook messages={this.state.QuestbookMessages} /> : null}
                    {this.state.SocialMediaLinks ? <Contact links={this.state.SocialMediaLinks} /> : null}
                </main>
            </Fragment>
        );
    }
}

export default Portfolio;