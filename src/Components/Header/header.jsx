import React, { Component } from 'react';
import './header.css';
import { Navbar, Button, Modal, Nav } from 'react-bootstrap';
import md5 from 'md5';
import AuthService from '../LoginHandle/AuthService';
import { withRouter } from 'react-router-dom';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ShowModal: false
        }
        this.closeSignInModal = this.closeSignInModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.openSignInModal = this.openSignInModal.bind(this);
        this.toEditPortfolio = this.toEditPortfolio.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // Checks if user is already logged in and then replace the path according to logged in status
        if (!this.Auth.loggedIn()) {
            this.props.history.replace('/')
        }
        else {
            try {
                this.props.history.replace('/portfolio')
            }
            catch (err) {
                this.Auth.logout()
                this.props.history.replace('/')
            }
        }
    }

    closeSignInModal() {
        this.setState({
            ShowModal: false
        });
    }

    handleLogout() {
        this.Auth.logout();
        this.props.history.replace('/')
    }

    handleSubmit(e) {
        e.preventDefault();
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
                alert(err);
            })
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

    openSignInModal() {
        this.setState({
            ShowModal: true
        });
    }

    toEditPortfolio() {
        this.props.history.replace('/editportfolio');
    }

    render() {
        // According to logged in status, right header is rendered
        if (this.Auth.loggedIn()) {
            return (
                <header>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand href="/" className="mr-auto">
                            WebPortfolio
                        </Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <Nav.Link href="#home">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#iAm">I Am</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#iCan">I Can</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#questbook">Questbook</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#contact">Contact</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button variant="outline-info" onClick={this.toEditPortfolio}>Edit Portfolio</Button>
                        <span id="or">or</span>
                        <Button variant="outline-info" onClick={this.handleLogout}>Log Out</Button>
                    </Navbar>
                </header>
            );
        } else {
            return (
                <header>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand href="#home" className="mr-auto">
                            WebPortfolio
                        </Navbar.Brand>
                        <Button variant="outline-info" onClick={this.openSignInModal}>Sign In</Button>
                        {/* 
                        <span id="or">or</span>
                        <Button variant="outline-info">Sign Up</Button>
                        */}
                    </Navbar>

                    {/* Modal window for signing in */}
                    <Modal show={this.state.ShowModal} onHide={this.closeSignInModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.handleSubmit}>
                            <Modal.Body>
                                Username <br />
                                <input id="usernameInput" type="text" onChange={this.handleValueChange} /><br />
                                Password <br />
                                <input id="passwordInput" type="password" onChange={this.handleValueChange} /><br />
                                <hr />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="submit">Sign In</Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </header>
            );
        }
    }
}

export default withRouter(Header);