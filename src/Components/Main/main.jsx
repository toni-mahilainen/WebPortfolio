import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col } from 'react-bootstrap';
import md5 from 'md5';
import Axios from 'axios';


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
    }

    componentDidMount() {
        // re-position a footer
        let footer = document.getElementById("footer");
        if (!footer.classList.contains("absolute")) {
            footer.className = "absolute";
        }
    }

    handleSubmit() {
        // Checks users input in password and confirm password fields
        // If they match, a post request is sent to backend
        if (this.state.Password === this.state.ConfirmPassword) {
            const userObj = {
                Username: this.state.Username,
                Password: this.state.Password
            }

            const settings = {
                url: 'https://localhost:5001/api/user',
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: userObj
            };
    
            Axios(settings)
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        alert("New user added succesfully!")
                    } else {
                        alert("Problems!!")
                    }
                });
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
                        <Col>
                            <h3>Create an account</h3>
                            <form onSubmit={this.handleSubmit}>
                                Username <br />
                                <input id="usernameInput" type="text" onChange={this.handleValueChange} /><br />
                                Password <br />
                                <input id="passwordInput" type="password" onChange={this.handleValueChange} /><br />
                                Confirm password <br />
                                <input id="confirmPasswordInput" type="password" onChange={this.handleValueChange} /><br />
                                Email <br />
                                <input id="signUpEmailInput" type="email" /><br />
                                Confirm email <br />
                                <input id="confirmEmailInput" type="email" /><br />
                                <button type="submit">Sign up</button>
                                <button type="button" onClick={this.handleSubmit}>Testi</button>
                            </form>
                        </Col>
                        <Col>
                            <h1>Some<br /> awesome <br />sentence <br />here!</h1>
                        </Col>
                    </Row>
                </Container>
            </main>
        );
    }
}

export default Main;