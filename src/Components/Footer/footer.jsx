import React, { Component } from 'react';
import './footer.css';
import { Container, Row, Col } from 'react-bootstrap';

class Footer extends Component {
    render() {
        return (
            <footer id="footer">
                <Container>
                    <Row>
                        <Col>
                            <h4>Developed by Toni Mahilainen</h4>
                        </Col>
                    </Row>
                </Container>
            </footer>
        );
    }
}

export default Footer;