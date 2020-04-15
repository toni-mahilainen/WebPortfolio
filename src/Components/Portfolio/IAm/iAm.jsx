import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class IAm extends Component {
    render() {
        return (
            <section className="iAm">
                <Container>
                    <Row>
                        <Col>
                            <p>Kuva</p>
                            <ul>
                                <li>Firstname</li>
                                <li>Lastname</li>
                                <li>Birthdate</li>
                                <li>City</li>
                                <li>Country</li>
                                <li>Phonenumber</li>
                                <li>Email 1</li>
                                <li>Email 2</li>
                            </ul>
                        </Col>
                        <Col>
                            <ul>
                                <li>Basic Knowledge</li>
                                <li>Education</li>
                                <li>Work History</li>
                                <li>Language Skills</li>
                            </ul>
                        </Col>
                    </Row>

                </Container>
            </section>
        );
    }
}

export default IAm;