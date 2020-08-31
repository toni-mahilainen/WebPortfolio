import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';
import AuthService from '../LoginHandle/AuthService';


class Main extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: "",
            ConfirmPassword: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.Auth = new AuthService();
    }

    handleSubmit(e) {
        // If the page reload is not disabled, request will be canceled
        e.preventDefault();
        // Checks users input in password and confirm password fields
        // If they match, a post request is sent to backend
        if (this.state.Password === this.state.ConfirmPassword) {
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
            alert("Please type the right confirmed password.")
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
                this.setState({
                    ConfirmPassword: md5(input.target.value)
                });
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
                                <input id="usernameInput" type="text" placeholder="Username" onChange={this.handleValueChange} /><br />
                                <input id="passwordInput" type="password" placeholder="Password" onChange={this.handleValueChange} /><br />
                                <input id="confirmPasswordInput" type="password" placeholder="Confirm password" onChange={this.handleValueChange} /><br />
                                <input id="signUpEmailInput" type="email" placeholder="Email" /><br />
                                <input id="confirmEmailInput" type="email" placeholder="Confirm email" /><br />
                                <button id="signUpBtn" type="submit">SIGN UP</button>
                            </form>
                        </Col>
                        <Col id="sentenceCol">
                            <h1>Some<br /> awesome <br />sentence <br />here!</h1>
                        </Col>
                    </Row>
                </Container>
            </main>
        );
    }
}

export default Main;