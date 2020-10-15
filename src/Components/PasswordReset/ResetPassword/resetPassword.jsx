import React, { Component } from 'react';
import './resetPassword.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';
import swal from 'sweetalert';
import LoadingCircle from '../../../Images/loading_rotating.png';
import LoadingText from '../../../Images/loading_text.png';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NewPassword: "",
            ConfirmNewPassword: "",
            ResetToken: props.location.pathname.split("/resetpassword/")[1],
            PasswordMatch: false,
            ShowLoadingModal: false
        }
        this.checkPasswordSimilarity = this.checkPasswordSimilarity.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
        this.handlePasswordReset = this.handlePasswordReset.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.openLoadingModal = this.openLoadingModal.bind(this);
    }

    componentDidMount() {
        if (this.props.location.pathname.split("/resetpassword/")[1] !== undefined) {
            this.checkToken(this.props.location.pathname.split("/resetpassword/")[1])
        } else {
            swal({
                title: "Error occured!",
                text: "Something went wrong!\n\rIf the problem does not dissappear please be contacted to the administrator.",
                icon: "error",
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
        }
    }

    // Checks the similarity of password and confirmed password
    checkPasswordSimilarity() {
        let small = document.getElementById("passwordResetMatchWarning");
        if (this.state.NewPassword === this.state.ConfirmNewPassword) {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: true
            });
        } else if (this.state.ConfirmNewPassword === "" || this.state.NewPassword === "") {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: false
            });
        } else {
            small.removeAttribute("hidden");
            this.setState({
                PasswordMatch: false
            });
        }
    }

    checkToken(token) {
        const passwordObj = {
            OldPassword: "",
            NewPassword: "",
            ResetToken: token
        };

        const settings = {
            url: 'https://webportfolioapi.azurewebsites.net/api/user/checkresettoken',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: passwordObj
        };

        Axios(settings)
            .then(response => {
                // Everything is fine
            })
            .catch(err => {
                swal({
                    title: "Attention!",
                    text: "The link might be expired.\n\rIf you don´t have the other link in your email, please generate a new one in ''Forgot your password?'' section and try again.\n\r\n\rIf the problem does not dissappear please be contacted to the administrator.",
                    icon: "error",
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
    }

    handlePasswordReset(e) {
        e.preventDefault();
        this.openLoadingModal();
        if (this.state.PasswordMatch === true) {
            const passwordObj = {
                OldPassword: "",
                NewPassword: this.state.NewPassword,
                ResetToken: this.state.ResetToken
            };

            const settings = {
                url: 'https://webportfolioapi.azurewebsites.net/api/user/passwordreset',
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: passwordObj
            };

            Axios(settings)
                .then(response => {
                    this.closeLoadingModal();
                    swal({
                        title: "Great!",
                        text: "Your password has changed successfully!",
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
                    this.closeLoadingModal();
                    swal({
                        title: "Error occured!",
                        text: "Something went wrong!\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "error",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                })
        } else {
            this.closeLoadingModal();
            swal({
                title: "Oops!",
                text: "The password and the confirmed password doesn't match.\r\nPlease type the right passwords and try again.",
                icon: "info",
                buttons: {
                    confirm: {
                        text: "OK",
                        closeModal: true
                    }
                }
            });
        }
    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
            case "resetPasswordNewInput":
                if (input.target.value === "") {
                    this.setState({
                        NewPassword: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        NewPassword: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            case "resetPasswordConfirmInput":
                if (input.target.value === "") {
                    this.setState({
                        ConfirmNewPassword: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        ConfirmNewPassword: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            default:
                break;
        }
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
            <main className="resetPassword">
                <Container id="resetPasswordContainer">
                    <Row>
                        <Col id="resetPasswordCol">
                            <h3>Reset your password</h3>
                            <form id="resetPasswordForm" onSubmit={this.handlePasswordReset}>
                                <input id="resetPasswordNewInput" type="password" placeholder="New password" onChange={this.handleValueChange} />
                                <input id="resetPasswordConfirmInput" type="password" placeholder="Confirm new password" onChange={this.handleValueChange} />
                                <small hidden id="passwordResetMatchWarning">The paswords doesn't match!</small>
                                <button id="resetPasswordBtn" type="submit"><b>RESET</b></button>
                            </form>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for loading sign */}
                <Modal id="loadingModal" show={this.state.ShowLoadingModal} onHide={this.closeLoadingModal}>
                    <Modal.Body>
                        <img id="loadingCircleImg" src={LoadingCircle} alt="" />
                        <img src={LoadingText} alt="" />
                    </Modal.Body>
                </Modal>
            </main>
        )
    }
}

export default ResetPassword;