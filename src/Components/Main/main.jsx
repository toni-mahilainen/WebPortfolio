import React, { Component } from 'react';
import './main.css';
import { Container, Row, Col } from 'react-bootstrap';

class Main extends Component {
    render() {
        return (
            <main className="main">
                <Container>
                    <Row>
                        <Col>
                            <h3>Create an account</h3>
                            <form>
                                Username <br />
                                <input id="usernameInput" type="text"/><br />
                                Password <br />
                                <input id="passwordInput" type="password"/><br />
                                Confirm password <br />
                                <input id="confirmPasswordInput" type="password"/><br />
                                Email <br />
                                <input id="signUpEmailInput" type="email"/><br />
                                Confirm email <br />
                                <input id="confirmEmailInput" type="email"/><br />
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