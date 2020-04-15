import React, { Component } from 'react';
import './questbook.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

class Questbook extends Component {
    render() {
        return (
            <section className="questbook">
                <Container>
                    <Row>
                        <Col>
                            <h2>Questbook</h2>
                            <Button>New message</Button>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Visitor name</th>
                                        <th>Visitor company</th>
                                        <th>Message</th>
                                        <th>Date/time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Matti</td>
                                        <td>Teppo Oy</td>
                                        <td>Hei vain kaikki!</td>
                                        <td>1.1.2020</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Questbook;