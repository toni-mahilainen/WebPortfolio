import React, { Component } from 'react';
import './home.css';
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {
    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.homePicUrl + ")",
            backgroundSize: "100 % 100 %"
        }
        
        return (
            <section className="home" style={background} >
                <Container>
                    <Row>
                        <Col>
                            <h1>{this.props.punchline}</h1>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Home;