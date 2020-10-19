import React, { Component } from 'react';
import './footer.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';

class Footer extends Component {
    constructor() {
        super();
        this.state = {
            ShowAboutModal: false
        }
        this.closeAboutModal = this.closeAboutModal.bind(this);
        this.openAboutModal = this.openAboutModal.bind(this);
    }

    // Open modal window for project details
    closeAboutModal() {
        this.setState({
            ShowAboutModal: true
        });
    }

    openAboutModal() {
        this.setState({
            ShowAboutModal: true
        });
    }

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
                            <a id="showAboutModal" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_fi.pdf?sp=r&st=2020-10-16T08:31:04Z&se=2021-10-16T16:31:04Z&spr=https&sv=2019-12-12&sr=b&sig=%2FmE09dD8PUxJKeMpJx2VeVhfWOViuuvj1C%2FRhs5R%2FYs%3D">About</a>
                            <span id="footerDivider">|</span>
                            <a id="downloadManualLink" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_fi.pdf?sp=r&st=2020-10-16T08:31:04Z&se=2021-10-16T16:31:04Z&spr=https&sv=2019-12-12&sr=b&sig=%2FmE09dD8PUxJKeMpJx2VeVhfWOViuuvj1C%2FRhs5R%2FYs%3D">Download manual</a>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for project details */}
                <Modal id="projectDetailsModal" show={this.state.ShowAboutModal} onHide={this.closeAboutModal} centered>
                    <div id="projectDetailsModalWrapper">
                        <button id="upperCloseProjectDetailsModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeProjectDetailsModal}></span>
                        </button>
                        <Modal.Body>
                            <div id="linkDiv">
                                <h5>Link</h5>
                                <a href={this.state.Link} target="blank">{this.state.Link}</a>
                            </div>
                        </Modal.Body>
                        <button id="lowerCloseProjectDetailsModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeAboutModal}></span>
                        </button>
                    </div>
                </Modal>
            </footer>
        );
    }
}

export default Footer;