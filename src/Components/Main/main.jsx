import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';
import AuthService from '../LoginHandle/AuthService';
import background from '../../Images/mainBackground.jpg';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ConfirmPassword: "",
            PasswordMatch: false
        }
        this.checkPasswordSimilarity = this.checkPasswordSimilarity.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let header = document.getElementById("header");
        header.className = "sticky";
        header.style.background = "transparent";
        // Background image to the root div
        document.getElementById("root").style.backgroundImage = "url(" + background + ")";
        document.getElementById("root").style.backgroundSize = "100% 100%";
    }

    checkPasswordSimilarity() {
        let small = document.getElementById("passwordMatchWarning");
        if (this.state.Password === this.state.ConfirmPassword) {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: true
            });
        } else if (this.state.ConfirmPassword === "") {
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
        // If the passwords match, a post request is sent to backend
        if (this.state.PasswordMatch === true) {
            const userObj = {
                Username: this.state.Username,
                Password: this.state.Password
            }

            const settings = {
                url: 'https://localhost:5001/api/user/create',
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
                            this.props.history.replace("/editportfolio");
                        })
                        .catch(err => {
                            alert(err);
                        })
                    // Add a mark because editing
                    this.Auth.setEditingMark();
                    // Add a mark because first login
                    this.Auth.setFirstLoginMark();
                })
                .catch(err => {
                    console.log(err.data);
                    alert("Problems!!")
                })
        } else {
            alert("The passwords doesn't match.")
        }
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

    render() {
        return (
            <main className="main">
                <Container>
                    <Row>
                        <Col id="createAccountCol">
                            <h3>Create an account</h3>
                            <form onSubmit={this.handleSubmit}>
                                <input id="usernameInput" type="text" placeholder="Username" onChange={this.handleValueChange} />
                                <input id="passwordInput" type="password" placeholder="Password" onChange={this.handleValueChange} />
                                <input id="confirmPasswordInput" type="password" placeholder="Confirm password" onChange={this.handleValueChange} /><br/>
                                <small hidden id="passwordMatchWarning">The paswords doesn't match!</small>
                                <input id="signUpEmailInput" type="email" placeholder="Email" />
                                <input id="confirmEmailInput" type="email" placeholder="Confirm email" /><br/>
                                <button id="signUpBtn" type="submit"><b>SIGN UP</b></button>
                            </form>
                        </Col>
                        <Col id="sentenceCol">
                            <h1>Your<br />way to<br />work!</h1>
                        </Col>
                    </Row>
                </Container>
            </main>
        );
    }
}

export default Main;