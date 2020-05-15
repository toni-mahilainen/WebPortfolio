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
        console.log("Contact: " + typeof(this.props.links));
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
        return (
            <section className="contact">
                <Container>
                    <Row>
                        <Col>
                            <h2>Contact me with email...</h2>
                            <form onSubmit={this.handleSubmit}>
                                Name<br />
                                <input type="text" className="contactInput" id="contactNameInput" onChange={this.handleChangeInput}></input><br />
                                Email<br />
                                <input type="text" className="contactInput" id="contactEmailInput" onChange={this.handleChangeInput}></input><br />
                                Subject<br />
                                <input type="text" className="contactInput" id="contactSubjectInput" onChange={this.handleChangeInput}></input><br />
                                Message<br />
                                <textarea type="text" className="contactInput" id="contactMessageInput" onChange={this.handleChangeInput}></textarea><br />
                                <button type="submit">Submit</button>
                            </form>
                        </Col>
                        <Col>
                            <h2>...or in social media</h2>
                            <ul id="linkList"></ul>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Contact;