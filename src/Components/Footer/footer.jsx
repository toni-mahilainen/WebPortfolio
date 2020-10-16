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
                            <span id="footerDivider">|</span>
                            <a id="downloadManualLink" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_fi.pdf?sp=r&st=2020-10-16T08:31:04Z&se=2021-10-16T16:31:04Z&spr=https&sv=2019-12-12&sr=b&sig=%2FmE09dD8PUxJKeMpJx2VeVhfWOViuuvj1C%2FRhs5R%2FYs%3D">Download manual</a>
                        </Col>
                    </Row>
                </Container>
            </footer>
        );
    }
}

export default Footer;