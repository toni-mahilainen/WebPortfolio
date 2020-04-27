import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col } from 'react-bootstrap';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            Username: "",
            Password: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {

    }

    handleValueChange(input) {
        let inputId = input.target.id;
        let inputValue = input.target.value;

        switch (inputId) {
            case "usernameInput":
                this.setState ({
                    Username: inputValue
                })
                console.log("Username");
                break;

            case "passwordInput":
                console.log("Password");
                break;

            default:
                break;
        }
        // console.log(input.target.id);
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