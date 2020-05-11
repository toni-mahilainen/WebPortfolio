import React, { Component } from 'react';
import './home.css';
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {
    render() {
        return (
            <section className="home">
                <Container>
                    <Row>
                        <h1>Home</h1>
                    </Row>
                    <Row>
                        <Col>
                            <h1>Punchline</h1>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Home;