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

        let emailAddress = document.getElementById("resetPasswordEmailInput").value;

        const settings = {
            url: 'https://localhost:5001/api/user/passwordreset/' + emailAddress,
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
                    title: "Great!",
                    text: "Everything is fine!",
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
                console.log(err.data);
                swal({
                    title: "Error occured!",
                    text: "Incorrect password",
                    icon: "error",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                });
            })
    }

    render() {
        return (
            <main className="forgotPassword">
                <Container id="forgotPasswordContainer">
                    <Row>
                        <Col id="resetPasswordCol">
                            <h3>Forgot your password?</h3>
                            <form id="forgotPasswordForm" onSubmit={this.handleEmailSend}>
                                <input id="resetPasswordEmailInput" type="email" placeholder="Type your email to reset your password" onChange={this.handleValueChange} /><br />
                                <button id="resetPasswordsendBtn" type="submit"><b>SEND</b></button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </main>
        )
    }
}

export default ForgotPassword;