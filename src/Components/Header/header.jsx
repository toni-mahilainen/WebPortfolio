import React, { Component } from 'react';
import './header.css';
import { Navbar, Modal, Nav } from 'react-bootstrap';
import Axios from 'axios';
import md5 from 'md5';
import AuthService from '../LoginHandle/AuthService';
import { withRouter } from 'react-router-dom';
import logo from '../../Images/logo.png';
import swal from 'sweetalert';

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
        this.expandSearchInput = this.expandSearchInput.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.logIn = this.logIn.bind(this);
        this.openSignInModal = this.openSignInModal.bind(this);
        this.reduceSearchInput = this.reduceSearchInput.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.toEditPortfolio = this.toEditPortfolio.bind(this);
        this.toForgotPaswordPage = this.toForgotPaswordPage.bind(this);
        this.toMainPage = this.toMainPage.bind(this);
        this.toPortfolio = this.toPortfolio.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let header = document.getElementById("header");
        header.style.backgroundColor = "transparent";
        // Checks if a user is already logged in and then replace the path according to logged in status
        if (!this.Auth.loggedIn() && !this.Auth.getJustWatchingMark()) {
            if (this.props.location.pathname.startsWith("/resetpassword")) {
                this.props.history.replace('/resetpassword')
            } else {
                this.props.history.replace('/')
            }
        } else if (!this.Auth.loggedIn() && this.Auth.getJustWatchingMark()) {
            // If a user just want to watch someone´s profile
            this.props.history.replace('/myportfolio/' + this.Auth.getJustWatchingMark())
        } else {
            try {
                // If a user logins for the first time, edit portfolio page is rendered
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
            url: 'https://webportfolioapi.azurewebsites.net/api/user/checklogin',
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

    expandSearchInput() {
        document.getElementById("expandSearchBtn").style.display = "none";
        document.getElementById("searchUserForm").style.display = "flex";
        document.getElementById("searchUserInput").classList.remove("widthDown");
        document.getElementById("searchUserInput").classList.add("widthUp");
        document.getElementById("searchUserInput").focus();
    }

    // Get user ID for the public portfolio
    getUserId(username) {
        const settings = {
            url: 'https://webportfolioapi.azurewebsites.net/api/user/userid/' + username,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        Axios(settings)
            .then((response) => {
                // Marks to the localStorage for the public portfolio
                this.Auth.setJustWatchingMark(username, response.data)
                window.location.reload();
            })
            .catch(() => {
                swal({
                    title: "Oops!",
                    text: 'Can´t find any portfolio with username "' + username + '".\n\r\n\rCheck your spelling and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.',
                    icon: "info",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                })
            })
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
                swal({
                    title: "Error occured!",
                    text: "There was a problem trying to sign in!\n\rRefresh the page and try to sign in again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
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

    openSignInModal() {
        this.setState({
            ShowModal: true
        });
    }

    reduceSearchInput() {
        if (!document.getElementById("searchUserInput").value) {
            document.getElementById("searchUserInput").classList.remove("widthUp");
            document.getElementById("searchUserInput").classList.add("widthDown");
            setTimeout(() => {
                document.getElementById("searchUserForm").style.display = "none";
                document.getElementById("expandSearchBtn").style.display = "block";
            }, 800)
        }
    }

    searchUser(e) {
        e.preventDefault();
        let usernaame = document.getElementById("searchUserInput").value;
        this.getUserId(usernaame)
    }

    toForgotPaswordPage() {
        this.props.history.replace("/forgotpassword");
        this.closeSignInModal();
    }

    toEditPortfolio() {
        // Add a mark for editing
        this.Auth.setEditingMark();
        this.props.history.replace('/editportfolio');
    }

    // Remove "Just Watching"-mark and user ID from localStorage
    toMainPage() {
        this.Auth.removeJustWatchingMark();
        this.Auth.removeUserId();
        this.props.history.replace('/');
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



    render() {
        let headerSticky = {
            position: "sticky"
        }

        let headerFixed = {
            position: "fixed"
        }

        // Depending on logged in status, right header is rendered
        if (this.Auth.loggedIn() && !this.Auth.getJustWatchingMark()) {
            if (this.props.location.pathname === "/editportfolio") {
                return (
                    <header>
                        <Navbar id="header" style={headerSticky} >
                            <Navbar.Brand href="/">
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
                            <Navbar.Brand href="/">
                                <img src={logo} alt="WebPortfolio logo" />
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse>
                                <Nav>
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
        } else if (!this.Auth.loggedIn() && this.Auth.getJustWatchingMark()) {
            return (
                <header>
                    <Navbar id="header" expand="lg" collapseOnSelect style={headerFixed}>
                        <Navbar.Brand href="/">
                            <img src={logo} alt="WebPortfolio logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse>
                            <Nav>
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
                            <button id="toMainpageBtn" onClick={this.toMainPage}><b>BACK TO MAINPAGE</b></button>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
            );
        } else {
            return (
                <header>
                    <Navbar id="header" style={headerSticky}>
                        <Navbar.Brand href="/">
                            <img src={logo} alt="WebPortfolio logo" />
                        </Navbar.Brand>
                        <form id="searchUserForm">
                            <input id="searchUserInput" type="text" placeholder="Search with username" onBlur={this.reduceSearchInput} />
                            <button id="searchBtn"><span className="fas fa-search" onClick={this.searchUser}></span></button>
                        </form>
                        <button id="expandSearchBtn" onClick={this.expandSearchInput}><span className="fas fa-search"></span></button>
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
                                <b>Username</b>
                                <input id="usernameInput" type="text" onChange={this.handleValueChange} />
                                <b>Password</b>
                                <input id="passwordInput" type="password" onChange={this.handleValueChange} />
                                <small hidden id="loginCredentialsMatchWarning">Incorrect username or password!</small>
                                <button id="passwordForgotBtn" type="button" onClick={this.toForgotPaswordPage}>Forgot your password?</button>
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