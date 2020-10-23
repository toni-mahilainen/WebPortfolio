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
        return (
            <footer id="footer">
                <Container>
                    <Row>
                        <Col>
                            <small>Copyright &copy; 2020 Toni Mahilainen</small>
                            <small className="footerDivider">|</small>
                            <button id="showAboutModal" onClick={this.openAboutModal}><small>About</small></button>
                            <small className="footerDivider">|</small>
                            <div>
                                <small>Download manual</small>
                                <div id="linkWrapper">
                                    <a id="downloadManualLinkFi" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_fi.pdf?sp=r&st=2020-10-22T06:21:46Z&se=2021-10-22T14:21:46Z&spr=https&sv=2019-12-12&sr=b&sig=lz6QjTHcS0U0Hhfpmn%2BsB5xtd7kSgeF5wkMES5G1FrM%3D"><small>FI</small></a>
                                    <a id="downloadManualLinkEn" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_en.pdf?sp=r&st=2020-10-22T06:22:55Z&se=2021-10-22T14:22:55Z&spr=https&sv=2019-12-12&sr=b&sig=JLkLuW2kAyp4RCoB%2FO6BSi%2B8PzQDvy%2B%2FY%2FnOIaHaeEg%3D"><small>EN</small></a>
                                </div>
                            </div>
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
                                    <li>WebPortfolio is a service, where a user can create a portfolio which could be shared to employer when the user is looking for a job</li>
                                    <li>In the portfolio, the user tells about him-/herself, education, work history, accumulated know-how etc.</li>
                                    <li>The user can style the portfolio by switching the background image for the different sections and to choose for between two different themes</li>
                                    <li>The portfolio is easy to share to the employer just with the username. The employer can use the username to search the right portfolio from the service</li>
                                    <li>The employer can be contacted to owner of the portfolio with a guestbook, by sending an email with the Contact-section of the WebPortfolio or directly using contacts which user has saved to his/her portfolio</li>
                                </ul>
                                <h5>Contact us: contact@webportfolio.fi</h5>
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