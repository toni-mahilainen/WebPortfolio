import React, { Component } from 'react';
import './header.css';
import { Navbar, Modal, Nav } from 'react-bootstrap';
import Axios from 'axios';
import md5 from 'md5';
import AuthService from '../LoginHandle/AuthService';
import { withRouter } from 'react-router-dom';
import logo from '../../Images/logo.png';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ShowModal: false
        }
        this.checkLoginCredentialsCorrection = this.checkLoginCredentialsCorrection.bind(this);
        this.closeSignInModal = this.closeSignInModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.logIn = this.logIn.bind(this);
        this.openSignInModal = this.openSignInModal.bind(this);
        this.toEditPortfolio = this.toEditPortfolio.bind(this);
        this.toPortfolio = this.toPortfolio.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let header = document.getElementById("header");
        header.style.backgroundColor = "transparent";
        // Checks if user is already logged in and then replace the path according to logged in status
        if (!this.Auth.loggedIn()) {
            this.props.history.replace('/')
        }
        else {
            try {
                // If user logins for the first time, edit portfolio page is rendered
                if (this.Auth.getFirstLoginMark() !== null | this.Auth.getEditingMark() !== null) {
                    this.props.history.replace('/editportfolio')
                } else {
                    this.props.history.replace('/portfolio')
                }
            }
            catch (err) {
                this.Auth.logout()
                this.props.history.replace('/')
            }
        }
    }

    // Check the correction of username and password
    checkLoginCredentialsCorrection() {
        let small = document.getElementById("loginCredentialsMatchWarning");
        const credentialsObj = {
            username: this.state.Username,
            password: this.state.Password
        };

        const settings = {
            url: 'https://localhost:5001/api/user/checklogin',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: credentialsObj
        };

        Axios(settings)
            .then(response => {
                small.setAttribute("hidden", "hidden");
                this.logIn();
                console.log("Response");
                console.log("Response data: " + response.data);
                console.log("Response status: " + response.status);
            })
            .catch(err => {
                small.removeAttribute("hidden");
                console.log("Error response");
                console.error("Error data: " + err.response.data);
                console.error("Error status: " + err.response.status);
            })
    }

    closeSignInModal() {
        this.setState({
            ShowModal: false
        });
    }

    handleLogout() {
        this.Auth.logout();
        // Remove all the marks from localStorage
        this.Auth.removeEditingMark();
        this.Auth.removeFirstLoginMark();
        this.Auth.removeBasicsSavedMark();
        this.Auth.removeSkillsAddedMark();
        this.Auth.removeContainerCreatedMark();
        this.Auth.removeSas();
        this.props.history.replace('/')
    }

    handleSubmit(e) {
        e.preventDefault();
        this.checkLoginCredentialsCorrection();
    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
            case "usernameInput":
                this.setState({
                    Username: input.target.value
                });
                break;

            case "passwordInput":
                this.setState({
                    Password: md5(input.target.value)
                });
                break;

            default:
                break;
        }
    }

    logIn() {
        this.Auth.login(this.state.Username, this.state.Password)
            .then(res => {
                // If login is succeeded, clear username and password states
                this.setState({
                    Username: "",
                    Password: ""
                });
                this.props.history.replace('/portfolio');
                this.closeSignInModal();
            })
            .catch(err => {
                alert("Login: " + err.data);
            })
    }

    openSignInModal() {
        this.setState({
            ShowModal: true
        });
    }

    toPortfolio() {
        // Remove all the marks from localStorage
        this.Auth.removeEditingMark();
        this.Auth.removeFirstLoginMark();
        this.Auth.removeBasicsSavedMark();
        this.Auth.removeSkillsAddedMark();
        this.Auth.removeContainerCreatedMark();
        this.props.history.replace('/portfolio');
    }

    toEditPortfolio() {
        // Add a mark for editing
        this.Auth.setEditingMark();
        this.props.history.replace('/editportfolio');
    }

    render() {
        let headerSticky = {
            position: "sticky"
        }

        let headerFixed = {
            position: "fixed"
        }

        // Depending on logged in status, right header is rendered
        if (this.Auth.loggedIn()) {
            if (this.props.location.pathname === "/editportfolio") {
                return (
                    <header>
                        <Navbar id="header" style={headerSticky} >
                            <Navbar.Brand href="/" className="mr-auto">
                                <img src={logo} alt="WebPortfolio logo" />
                            </Navbar.Brand>
                            <button id="backToPortfolioBtn" onClick={this.toPortfolio}><b>BACK TO PORTFOLIO</b></button>
                            <span id="or">or</span>
                            <button id="editPortfolioLogOutBtn" onClick={this.handleLogout}><b>LOG OUT</b></button>
                            <button id="backToPortfolioBtnMobile" onClick={this.toPortfolio}><span className="fas fa-hand-point-left"></span></button>
                            <button id="editPortfolioLogOutBtnMobile" onClick={this.handleLogout}><span className="fas fa-sign-out-alt"></span></button>
                        </Navbar>
                    </header>
                );
            } else {
                return (
                    <header>
                        <Navbar id="header" expand="lg" collapseOnSelect style={headerFixed}>
                            <Navbar.Brand href="/" className="mr-auto">
                                <img src={logo} alt="WebPortfolio logo" />
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse>
                                <Nav className="m-auto">
                                    <Nav.Item>
                                        <Nav.Link className="navLink" href="#home">HOME</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="navLink" href="#iAm">I AM</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="navLink" href="#iCan">I CAN</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="navLink" href="#questbook">GUESTBOOK</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="navLink" href="#contact">CONTACT</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <button id="toEditPortfolioBtn" onClick={this.toEditPortfolio}><b>EDIT PORTFOLIO</b></button>
                                <span id="or">or</span>
                                <button id="portfolioLogOutBtn" onClick={this.handleLogout}><b>LOG OUT</b></button>
                            </Navbar.Collapse>
                        </Navbar>
                    </header>
                );
            }
        } else {
            return (
                <header>
                    <Navbar id="header" style={headerSticky}>
                        <Navbar.Brand className="mr-auto">
                            <img src={logo} alt="WebPortfolio logo" />
                        </Navbar.Brand>
                        <button id="signInBtn" onClick={this.openSignInModal}><b>SIGN IN</b></button>
                        <button id="signInBtnMobile" onClick={this.openSignInModal}><span className="fas fa-sign-in-alt"></span></button>
                    </Navbar>

                    {/* Modal window for signing in */}
                    <Modal id="signInModal" show={this.state.ShowModal} onHide={this.closeSignInModal} centered>
                        <Modal.Header id="signInModalHeader" closeButton>
                            <Modal.Title>Sign In</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.handleSubmit}>
                            <Modal.Body id="signInModalBody">
                                <b>Username</b> <br />
                                <input id="usernameInput" type="text" onChange={this.handleValueChange} /><br />
                                <b>Password</b> <br />
                                <input id="passwordInput" type="password" onChange={this.handleValueChange} /><br />
                                <small hidden id="loginCredentialsMatchWarning">Incorrect username or password!</small>
                            </Modal.Body>
                            <Modal.Footer id="signInModalFooter">
                                <button id="signInModalBtn" type="submit"><b>SIGN IN</b></button>
                                <button id="cancelSignIinModalBtn" type="button" onClick={this.closeSignInModal}><b>CANCEL</b></button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </header>
            );
        }
    }
}

export default withRouter(Header);