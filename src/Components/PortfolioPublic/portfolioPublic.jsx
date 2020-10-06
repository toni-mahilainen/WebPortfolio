import React, { Component, Fragment } from 'react';
import './portfolioPublic.css';
import HomePublic from './HomePublic/homePublic';
import IAmPublic from './IAmPublic/iAmPublic';
import ICanPublic from './ICanPublic/iCanPublic';
import QuestbookPublic from './QuestbookPublic/questbookPublic';
import ContactPublic from './ContactPublic/contactPublic';
import AuthService from '../LoginHandle/AuthService';
import Axios from 'axios';

class PortfolioPublic extends Component {
    constructor() {
        super();
        this.state = {
            UserId: "",
            Profile: "",
            Content: "",
            Emails: "",
            Skills: "",
            QuestbookMessages: "",
            SocialMediaLinks: "",
            ProfilePicUrl: "",
            HomePicUrl: "",
            IamPicUrl: "",
            IcanPicUrl: "",
            QuestbookPicUrl: "",
            ContactPicUrl: ""
        }
        this.getContent = this.getContent.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.updateImageStates = this.updateImageStates.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // Classname to header
        let header = document.getElementById("header");
        if (window.screen.width >= 991) {
            header.style.background = "rgba(51,3,0,0.4)";
        } else {
            header.style.background = "rgba(51,3,0,0.6)";
        }

        // Re-position a footer
        let footer = document.getElementById("footer");
        if (!footer.classList.contains("relative")) {
            footer.className = "relative";
            footer.style.backgroundColor = "rgb(169, 168, 162)";
        }
        footer.classList.add("darker");

        this.getUserId(this.Auth.getJustWatchingMark());
    }

    // Build url for state of image depending on type ID
    updateImageStates(data) {
        let sasToken = "?" + this.Auth.getSas();
        for (let index = 0; index < data.length; index++) {
            let typeId = data[index].typeId;
            switch (typeId) {
                case 1:
                    this.setState({
                        ProfilePicUrl: data[index].url + sasToken
                    })
                    break;

                case 2:
                    this.setState({
                        HomePicUrl: data[index].url + sasToken
                    })
                    break;

                case 3:
                    this.setState({
                        IamPicUrl: data[index].url + sasToken
                    })
                    break;

                case 4:
                    this.setState({
                        IcanPicUrl: data[index].url + sasToken
                    })
                    break;

                case 5:
                    this.setState({
                        QuestbookPicUrl: data[index].url + sasToken
                    })
                    break;

                case 6:
                    this.setState({
                        ContactPicUrl: data[index].url + sasToken
                    })
                    break;

                default:
                    break;
            }
        }
    }

    getUserId(username) {
        const contentSettings = {
            url: 'https://localhost:5001/api/user/userid/' + username,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        Axios(contentSettings)
        .then((response) => {
            this.setState({
                UserId: response.data
            }, () => {
                this.getContent(response.data)
            });
            
        })
    }

    // Get all content for portfolio
    getContent(userId) {
        // Settings for requests
        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const emailSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/emails/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const skillsSettings = {
            url: 'https://localhost:5001/api/skills/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const questbookSettings = {
            url: 'https://localhost:5001/api/questbook/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const imagesSettings = {
            url: 'https://localhost:5001/api/images/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        // Requests
        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);
        const skillsGet = Axios(skillsSettings);
        const questbookGet = Axios(questbookSettings);
        const socialMediaGet = Axios(socialMediaSettings);
        const imagesGet = Axios(imagesSettings);

        // Promises
        Promise.all([contentGet, emailGet, skillsGet, questbookGet, socialMediaGet, imagesGet])
            .then((responses) => {
                this.updateImageStates(responses[5].data);
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
                <main id="portfolio">
                    {/* Render a component when state(s) are not null */}
                    {/* Home */}
                    {this.state.Content.punchline ?
                        <HomePublic
                            punchline={this.state.Content.punchline}
                            homePicUrl={this.state.HomePicUrl}
                        /> : null}
                    {/* I am */}
                    {this.state.Content && this.state.Emails ?
                        <IAmPublic
                            content={this.state.Content}
                            emails={this.state.Emails}
                            profilePicUrl={this.state.ProfilePicUrl}
                            iamPicUrl={this.state.IamPicUrl}
                        /> : null}
                    {/* I can */}
                    {this.state.Skills ?
                        <ICanPublic
                            skills={this.state.Skills}
                            icanPicUrl={this.state.IcanPicUrl}
                        /> : null}
                    {/* Questbook */}
                    {this.state.QuestbookMessages && this.state.UserId ?
                        <QuestbookPublic
                            messages={this.state.QuestbookMessages}
                            questbookPicUrl={this.state.QuestbookPicUrl}
                            userId={this.state.UserId}
                        /> : null}
                    {/* Contact */}
                    {this.state.SocialMediaLinks ?
                        <ContactPublic
                            links={this.state.SocialMediaLinks}
                            contactPicUrl={this.state.ContactPicUrl}
                            email={this.state.Emails[0].emailAddress}
                        /> : null}
                </main>
            </Fragment>
        );
    }
}

export default PortfolioPublic;