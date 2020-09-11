import React, { Component } from 'react';
import './footer.css';
import { Container, Row, Col } from 'react-bootstrap';

class Footer extends Component {
    render() {
        let d = new Date(); 
        let currentYear = d.getFullYear(); 
        return (
            <footer id="footer">
                <Container>
                    <Row>
                        <Col>
                            <small>&copy; Copyright {currentYear}, Toni Mahilainen</small>
                        </Col>
                    </Row>
                </Container>
            </footer>
        );
    }
}

export default Footer;