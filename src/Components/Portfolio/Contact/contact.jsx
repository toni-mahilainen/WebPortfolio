import React, { Component } from 'react';
import './contact.css';
import { Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: "",
            Email: "",
            Subject: "",
            Message: ""
        }
        this.addSocialMediaLinks = this.addSocialMediaLinks.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.contactToBackend = this.contactToBackend.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.addSocialMediaLinks();
        console.log("Contact: " + typeof (this.props.links));
    }

    addSocialMediaLinks() {
        // ul
        let ul = document.getElementById("linkList");
        // Get through all links
        for (let index = 0; index < this.props.links.length; index++) {
            const element = this.props.links[index];
            // Service ID to get right icon
            let serviceId = element.serviceId;

            // Create elements
            let li = document.createElement("li");
            let a = document.createElement("a");
            let span = document.createElement("span");

            // Classes to a tag
            a.setAttribute("href", element.link);
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");

            // Right icon according to service ID
            switch (serviceId) {
                case 1:
                    span.className = "fab fa-facebook"
                    break;

                case 2:
                    span.className = "fab fa-instagram"
                    break;

                case 3:
                    span.className = "fab fa-twitter"
                    break;

                case 4:
                    span.className = "fab fa-github"
                    break;

                case 5:
                    span.className = "fab fa-youtube"
                    break;

                case 6:
                    span.className = "fab fa-linkedin"
                    break;

                default:
                    break;
            }

            // Some append stuff :)
            a.appendChild(span);
            li.appendChild(a);
            ul.appendChild(li);
        }
    }

    clearInputs() {
        let inputs = document.getElementsByClassName("contactInput");

        for (let index = 0; index < inputs.length; index++) {
            inputs[index].value = "";
        }
    }

    contactToBackend() {
        // Object for request
        const messageObj = {
            name: this.state.Name,
            senderEmail: this.state.Email,
            recipientEmail: this.props.email,
            subject: this.state.Subject,
            message: this.state.Message
        };

        // Settings for request
        const settings = {
            url: "https://webportfolioemailsender.azurewebsites.net/api/email",
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: messageObj
        };

        Axios(settings)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    // alertin tilalle viesti käyttäjällä käyttöliittymään
                    alert("Palaute lähetetty!");
                    this.clearInputs();
                } else {
                    alert("Jokin meni pieleen. Ole hyvä ja yritä uudelleen.")
                }
            })
    }

    handleChangeInput(input) {
        switch (input.target.id) {
            case "contactNameInput":
                this.setState({
                    Name: input.target.value
                });
                break;

            case "contactEmailInput":
                this.setState({
                    Email: input.target.value
                });
                break;

            case "contactSubjectInput":
                this.setState({
                    Subject: input.target.value
                });
                break;

            case "contactMessageInput":
                this.setState({
                    Message: input.target.value
                });
                break;

            default:
                break;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.contactToBackend();
    }

    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.contactPicUrl + ")",
            backgroundSize: "100% 100%"
        }

        return (
            <section id="contact" className="contact" style={background}>
                <Container>
                    <Row>
                        <div id="contactEmailCol">
                            <h2>Contact me with email...</h2>
                            <form onSubmit={this.handleSubmit}>
                                <div id="contactFormDiv">
                                    <input id="contactNameInput" className="contactInput" type="text" placeholder="Name" onChange={this.handleChangeInput}></input>
                                    <input id="contactEmailInput" className="contactInput" type="text" placeholder="Email" onChange={this.handleChangeInput}></input>
                                    <input id="contactSubjectInput" className="contactInput" type="text" placeholder="Subject" onChange={this.handleChangeInput}></input>
                                    <textarea id="contactMessageInput" className="contactInput" type="text" placeholder="Message" onChange={this.handleChangeInput}></textarea>
                                </div>
                                <button id="contactSendBtn" type="submit">SEND</button>
                            </form>
                        </div>
                        <div id="contactSocialMediaCol">
                            <h2>...or in social media</h2>
                            <ul id="linkList"></ul>
                        </div>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Contact;