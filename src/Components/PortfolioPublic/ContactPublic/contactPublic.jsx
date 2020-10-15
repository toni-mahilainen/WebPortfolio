import React, { Component } from 'react';
import { Container, Row, Modal } from 'react-bootstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import VisibilitySensor from "react-visibility-sensor";
import LoadingCircle from '../../../Images/loading_rotating.png';
import LoadingText from '../../../Images/loading_text.png';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: "",
            Email: "",
            Subject: "",
            Message: "",
            ShowLoadingModal: false
        }
        this.addSocialMediaLinks = this.addSocialMediaLinks.bind(this);
        this.changeContact = this.changeContact.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
        this.contactToBackend = this.contactToBackend.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openLoadingModal = this.openLoadingModal.bind(this);
        this.visibilitySensorOnChange = this.visibilitySensorOnChange.bind(this);
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


    changeContact(event) {
        if (event.target.id === "changeContactRightBtn") {
            document.getElementById("contactEmailCol").style.display = "none";
            document.getElementById("contactSocialMediaCol").style.display = "block";
        } else {
            document.getElementById("contactSocialMediaCol").style.display = "none";
            document.getElementById("contactEmailCol").style.display = "block";
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
                    this.closeLoadingModal();
                    swal({
                        title: "Great!",
                        text: "The message has sent succesfully!",
                        icon: "success",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                    this.clearInputs();
                } else {
                    this.closeLoadingModal();
                    swal({
                        title: "Error occured!",
                        text: "There was a problem sending the message!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "error",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
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

    handleSubmit(e) {
        e.preventDefault();
        this.openLoadingModal();
        this.contactToBackend();
    }

    closeLoadingModal() {
        this.setState({
            ShowLoadingModal: false
        });
    }

    openLoadingModal() {
        this.setState({
            ShowLoadingModal: true
        });
    }

    visibilitySensorOnChange(isVisible) {
        let a = document.getElementById("navLinkContact");
        isVisible ? a.classList.add("active") : a.classList.remove("active");
    }

    render() {
        let background = {
            backgroundImage: "url(" + this.props.contactPicUrl + ")"
        };

        return (
            <VisibilitySensor onChange={this.visibilitySensorOnChange} partialVisibility offset={{ top: 350, bottom: 350 }}>
                <section id="contact" className="contact" style={background}>
                    <Container>
                        <Row>
                            <div id="contactEmailCol">
                                <div className="contactHeaderWrapper">
                                    <button className="changeContactBtn"><span id="changeContactLeftBtn" className="fas fa-chevron-left" onClick={this.changeContact}></span></button>
                                    <h2>Contact me with email...</h2>
                                    <button className="changeContactBtn"><span id="changeContactRightBtn" className="fas fa-chevron-right" onClick={this.changeContact}></span></button>
                                </div>
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
                                <div className="contactHeaderWrapper">
                                    <button className="changeContactBtn"><span id="changeContactLeftBtn" className="fas fa-chevron-left" onClick={this.changeContact}></span></button>
                                    <h2>...or in social media</h2>
                                    <button className="changeContactBtn"><span id="changeContactRightBtn" className="fas fa-chevron-right" onClick={this.changeContact}></span></button>
                                </div>
                                <ul id="linkList"></ul>
                            </div>
                        </Row>
                    </Container>

                    {/* Modal window for loading sign */}
                    <Modal id="loadingModal" show={this.state.ShowLoadingModal} onHide={this.closeLoadingModal}>
                        <Modal.Body>
                            <img id="loadingCircleImg" src={LoadingCircle} alt="" />
                            <img src={LoadingText} alt="" />
                        </Modal.Body>
                    </Modal>
                </section>
            </VisibilitySensor>
        );
    }
}

export default Contact;