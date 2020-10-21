import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';
import AuthService from '../LoginHandle/AuthService';
import swal from 'sweetalert';
import LoadingCircle from '../../Images/loading_rotating.png';
import LoadingText from '../../Images/loading_text.png';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ConfirmPassword: "",
            PasswordMatch: false,
            UsernameCheck: false,
            ShowLoadingModal: false
        }
        this.checkPasswordSimilarity = this.checkPasswordSimilarity.bind(this);
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.isUsernameAlreadyInUse = this.isUsernameAlreadyInUse.bind(this);
        this.openLoadingModal = this.openLoadingModal.bind(this);
        this.signUp = this.signUp.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let header = document.getElementById("header");
        let footer = document.getElementById("footer");
        let footerDividers = document.getElementsByClassName("footerDivider");
        let downloadManualLink = document.getElementById("downloadManualLink");
        let showAboutModal = document.getElementById("showAboutModal");
        header.style.backgroundColor = "transparent";
        footer.classList.remove("darker");
        [...footerDividers].forEach(element => {
            element.classList.remove("darker")
        });
        downloadManualLink.classList.remove("darker");
        showAboutModal.classList.remove("darker");
    }

    // Checks the similarity of password and confirmed password
    checkPasswordSimilarity() {
        let small = document.getElementById("passwordMatchWarning");
        if (this.state.Password === this.state.ConfirmPassword) {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: true
            });
        } else if (this.state.ConfirmPassword === "" || this.state.Password === "") {
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

    handleSubmit(e) {
        // If the page reload is not disabled, request will be canceled
        e.preventDefault();
        this.openLoadingModal();
        // If the passwords match and the username is free to use, a post request is sent to backend
        this.isUsernameAlreadyInUse();
    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
            case "usernameInput":
                let small = document.getElementById("usernameInUsehWarning");
                small.setAttribute("hidden", "hidden");
                this.setState({
                    Username: input.target.value
                });
                break;

            case "passwordInput":
                if (input.target.value === "") {
                    this.setState({
                        Password: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        Password: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            case "confirmPasswordInput":
                if (input.target.value === "") {
                    this.setState({
                        ConfirmPassword: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        ConfirmPassword: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            default:
                break;
        }
    }

    isUsernameAlreadyInUse() {
        let small = document.getElementById("usernameInUsehWarning");
        const settings = {
            url: 'https://webportfolioapi.azurewebsites.net/api/user/usernamecheck/' + this.state.Username,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        Axios(settings)
            .then(response => {
                console.log("Response");
                console.log("Response data: " + response.data);
                console.log("Response status: " + response.status);
                small.setAttribute("hidden", "hidden");
                this.signUp();
            })
            .catch(err => {
                console.log("Error response");
                console.error("Error data: " + err.response.data);
                console.error("Error status: " + err.response.status);
                this.closeLoadingModal();
                small.removeAttribute("hidden");
            })
    }

    signUp() {
        if (this.state.PasswordMatch === true) {
            const userObj = {
                Username: this.state.Username,
                Password: this.state.Password
            };

            const settings = {
                url: 'https://webportfolioapi.azurewebsites.net/api/user/create',
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: userObj
            };

            Axios(settings)
                .then(response => {
                    this.Auth.login(this.state.Username, this.state.Password)
                        .then(res => {
                            // Add a mark because editing
                            this.Auth.setEditingMark();
                            // Add a mark because first login
                            this.Auth.setFirstLoginMark();
                            this.closeLoadingModal();
                            this.props.history.replace("/editportfolio");
                        })
                })
                .catch(err => {
                    console.log(err.data);
                    this.closeLoadingModal();
                    swal({
                        title: "Error occured!",
                        text: "There was a problem signing up at the first time!",
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
            <main className="main">
                <Container>
                    <Row>
                        <Col id="createAccountCol">
                            <h3>Create an account</h3>
                            <form onSubmit={this.handleSubmit}>
                                <div id="mainpageMobileWrapper1">
                                    <input id="usernameInput" type="text" placeholder="Username" onChange={this.handleValueChange} />
                                    <small hidden id="usernameInUsehWarning">The username is already in use!</small>
                                    <input id="passwordInput" type="password" placeholder="Password" onChange={this.handleValueChange} />
                                    <input id="confirmPasswordInput" type="password" placeholder="Confirm password" onChange={this.handleValueChange} />
                                    <small hidden id="passwordMatchWarning">The paswords doesn't match!</small>
                                </div>
                                <div id="mainpageMobileWrapper3">
                                    <button id="signUpBtn" type="submit"><b>SIGN UP</b></button>
                                </div>
                            </form>
                        </Col>
                        <Col id="sentenceCol">
                            <h1>Your<br />way to<br />work!</h1>
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
        );
    }
}

export default Main;