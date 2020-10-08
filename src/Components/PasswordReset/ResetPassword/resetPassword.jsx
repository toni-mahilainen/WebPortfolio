import React, { Component } from 'react';
import './resetPassword.css';
import { Container, Row, Col } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';
import swal from 'sweetalert';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NewPassword: "",
            ConfirmNewPassword: "",
            ResetToken: props.location.pathname.split("/resetpassword/")[1],
            PasswordMatch: false
        }
        this.checkPasswordSimilarity = this.checkPasswordSimilarity.bind(this);
        this.handlePasswordReset = this.handlePasswordReset.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
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

    handlePasswordReset(e) {
        e.preventDefault();
        if (this.state.PasswordMatch === true) {
            console.log("ResetPassword");
            console.log(this.props.location.pathname.split("/resetpassword/")[1]);
            const passwordObj = {
                OldPassword: "",
                NewPassword: this.state.NewPassword,
                ResetToken: this.state.ResetToken
            };

            const settings = {
                url: 'https://localhost:5001/api/user/passwordreset',
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: passwordObj
            };

            Axios(settings)
                .then(response => {
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
                    console.log(err.data);
                    swal({
                        title: "Error occured!",
                        text: "Something went wrong!",
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
            </main>
        )
    }
}

export default ResetPassword;