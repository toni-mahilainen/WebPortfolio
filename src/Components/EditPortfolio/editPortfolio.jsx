import React, { Component } from 'react';
import './editPortfolio.css';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

class EditPortfolio extends Component {
    render() {
        return (
            <main>
                <Container>
                    <Row>
                        <Col>
                            <h3>Edit portfolio</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <form>
                                Firstname <br />
                                <input type="text" /><br />
                                Lastname <br />
                                <input type="text" /><br />
                                Birthdate <br />
                                <input type="text" /><br />
                                City <br />
                                <input type="text" /><br />
                                Country <br />
                                <input type="text" /><br />
                                Phonenumber <br />
                                <input type="text" /><br />
                            </form>
                        </Col>
                        <Col>
                            <form>
                                Username <br />
                                <input type="text" /><br />
                                Password <br />
                                <input type="password" /><br />
                                Confirm password <br />
                                <input type="password" /><br />
                                Email <br />
                                <input type="email" /><br />
                                Confirm email <br />
                                <input type="email" /><br />
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Edit</Button>
                        </Col>
                    </Row>
                </Container>
            </main>
        );
    }
}

export default EditPortfolio;