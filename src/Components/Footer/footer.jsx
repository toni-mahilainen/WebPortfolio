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
                                    <a id="downloadManualLinkFi" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_FI.pdf?sp=r&st=2020-10-27T12:16:16Z&se=2021-10-27T19:16:16Z&spr=https&sv=2019-12-12&sr=b&sig=k%2BzjG%2Bydb1BJBwZlR5cCFOAre9YgDbQ2NEfkUevTyZY%3D"><small>FI</small></a>
                                    <a id="downloadManualLinkEn" target="blank_" href="https://webportfolio.blob.core.windows.net/manuals/WebPortfolio_manual_EN.pdf?sp=r&st=2020-10-27T12:15:27Z&se=2021-10-27T19:15:27Z&spr=https&sv=2019-12-12&sr=b&sig=RBUQ0VswSbWI%2Bnc9ZXeyuA7IgWDztnqtSd%2B7ZEDFX04%3D"><small>EN</small></a>
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
                                    <li>In the portfolio, the user tells about themself, education, work history, accumulated know-how etc.</li>
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