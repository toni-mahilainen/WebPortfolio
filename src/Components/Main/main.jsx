import React, { Component } from 'react';
import './main.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

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
                                <input type="text"/><br />
                                Password <br />
                                <input type="password"/><br />
                                Confirm password <br />
                                <input type="password"/><br />
                                Email <br />
                                <input type="email"/><br />
                                Confirm email <br />
                                <input type="email"/><br />
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