import React, { Component } from 'react';
import './forgotPassword.css';
import { Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import swal from 'sweetalert';

class ForgotPassword extends Component {
    constructor() {
        super();
        this.handleEmailSend = this.handleEmailSend.bind(this);
    }

    handleEmailSend(e) {
        e.preventDefault();

        let emailAddress = document.getElementById("forgotPasswordEmailInput").value;

        const settings = {
            url: 'https://webportfolioapi.azurewebsites.net/api/user/passwordreset/' + emailAddress,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        Axios(settings)
            .then(response => {
                console.log(response.data);
                swal({
                    title: "You got the mail!",
                    text: "A link for the password reset has been sent to an address:\n\r" + emailAddress,
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                })
                    .then(() => {
                        this.props.history.replace("/");
                    })
            })
            .catch(err => {
                console.log(err.response.status);
                if (err.response.status === 404 ) {
                    swal({
                        title: "Attention!",
                        text: "The email address was incorrect.\n\rPlease check the spelling and try again.\n\r\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "warning",
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

    render() {
        return (
            <main className="forgotPassword">
                <Container id="forgotPasswordContainer">
                    <Row>
                        <Col id="forgotPasswordCol">
                            <h3>Forgot your password?</h3>
                            <form id="forgotPasswordForm" onSubmit={this.handleEmailSend}>
                                <input id="forgotPasswordEmailInput" type="email" placeholder="Type your email to reset your password" onChange={this.handleValueChange} /><br />
                                <button id="forgotPasswordSendBtn" type="submit"><b>SEND</b></button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </main>
        )
    }
}

export default ForgotPassword;