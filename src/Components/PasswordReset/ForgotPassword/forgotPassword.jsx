import React, { Component } from 'react';
import './forgotPassword.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import LoadingCircle from '../../../Images/loading_rotating.png';
import LoadingText from '../../../Images/loading_text.png';

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            ShowLoadingModal: false
        }
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
        this.handleEmailSend = this.handleEmailSend.bind(this);
        this.openLoadingModal = this.openLoadingModal.bind(this);
    }

    handleEmailSend(e) {
        e.preventDefault();
        this.openLoadingModal();
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
                this.closeLoadingModal();
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
                this.closeLoadingModal();
                if (err.response.status === 404) {
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
                } else {
                    swal({
                        title: "Error occured!",
                        text: "There was a problem reseting the password!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
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

                {/* Modal window for loading sign */}
                <Modal id="loadingModal" show={this.state.ShowLoadingModal} onHide={this.closeLoadingModal}>
                    <Modal.Body>
                        <img id="loadingCircleImg" src={LoadingCircle} alt="" />
                        <img id="loadingTextImg" src={LoadingText} alt="" />
                    </Modal.Body>
                </Modal>
            </main>
        )
    }
}

export default ForgotPassword;