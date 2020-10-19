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
            ShowAboutModal: false
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
                            <span className="footerDivider">|</span>
                            <button id="showAboutModal" onClick={this.openAboutModal}>About</button>
                            <span className="footerDivider">|</span>
                            <a id="downloadManualLink" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_fi.pdf?sp=r&st=2020-10-19T16:43:07Z&se=2021-10-19T00:43:07Z&spr=https&sv=2019-12-12&sr=b&sig=LiLm%2B8gGLN44EuAQi%2B54lwKGKcTJpCqDDxKFx2qmKqc%3D">Download manual</a>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for project details */}
                <Modal id="aboutModal" show={this.state.ShowAboutModal} onHide={this.closeAboutModal} centered>
                    <div id="aboutModalWrapper">
                        <button id="upperCloseAboutModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeAboutModal}></span>
                        </button>
                        <Modal.Body>
                            <div id="aboutWrapper">
                                <h3>About</h3>
                                <h4>- WebPortfolio in a nutshell -</h4>
                                <ul id="infoList">
                                    <li>WebPortfolio is the service, where a user can create a portfolio which could be shared to employee when the user is looking for a job</li>
                                    <li>In portfolio, the user tells about him-/herself, education, work history, accumulated know-how etc.</li>
                                    <li>The user can style the portfolio by switching the background image for the different sections and to choose for between two themes</li>
                                    <li>The portfolio is easy to share to employee just with the username. The employee can use the username to search the right portfolio from the service</li>
                                    <li>The employee can be contacted to owner of the portfolio with guest book, by sending an email with the Contact-section of WebPortfolio or directly using contacts which user has saved his/her portfolio </li>
                                </ul>
                            </div>
                        </Modal.Body>
                        <button id="lowerCloseAboutModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeAboutModal}></span>
                        </button>
                    </div>
                </Modal>
            </footer>
        );
    }
}

export default Footer;