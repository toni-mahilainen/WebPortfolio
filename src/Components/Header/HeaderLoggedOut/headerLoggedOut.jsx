import React, { Component } from 'react';
import './headerLoggedOut.css';
import { Navbar, Button, Modal } from 'react-bootstrap';
import md5 from 'md5';
import AuthService from '../../LoginHandle/AuthService';


class HeaderLoggedOut extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ShowModal: false
        }
        this.openSignInModal = this.openSignInModal.bind(this);
        this.closeSignInModal = this.closeSignInModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.Auth = new AuthService();
    }

    closeSignInModal() {
        this.setState({
            ShowModal: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.Auth.login(this.state.Username, this.state.Password)
            .then(res => {
                alert("Signed in!");
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

    render() {
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

export default HeaderLoggedOut;