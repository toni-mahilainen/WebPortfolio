import React, { Component } from 'react';
import './contact.css';
import { Container, Row, Col } from 'react-bootstrap';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.addSocialMediaLinks = this.addSocialMediaLinks.bind(this);
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