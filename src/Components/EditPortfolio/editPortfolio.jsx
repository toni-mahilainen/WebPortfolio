import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

class PictureEdit extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Pictures</h4>
                        <form>
                            Profile <br />
                            <input type="file" /><br />
                            Home background <br />
                            <input type="file" /><br />
                            I am background <br />
                            <input type="file" /><br />
                            I can background <br />
                            <input type="file" /><br />
                            Questbook background <br />
                            <input type="file" /><br />
                            Contact background <br />
                            <input type="file" /><br />
                        </form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

class InfoEdit extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Personal</h4>
                        <form>
                            Firstname <br />
                            <input type="text" /><br />
                            Lastname <br />
                            <input type="text" /><br />
                            Birthdate <br />
                            <input type="date" /><br />
                            City <br />
                            <input type="text" /><br />
                            Country <br />
                            <input type="text" /><br />
                            Phonenumber <br />
                            <input type="numbers" /><br />
                            Email 1 <br />
                            <input type="email" /><br />
                            Email 2 <br />
                            <input type="email" /><br />
                            Social media link 1 <br />
                            <input type="text" /><br />
                            Social media link 2 <br />
                            <input type="text" /><br />
                            Tyylikkäämpi toteutus sähköposteille ja somelinkeille
                        </form>
                        <h4>Homepage</h4>
                        <form>
                            Punchline <br />
                            <textarea type="text" /><br />
                        </form>
                    </Col>
                    <Col>
                        <h4>Basic</h4>
                        <form>
                            Basic Knowledge <br />
                            <textarea type="text" /><br />
                            Education <br />
                            <textarea type="text" /><br />
                            Work History <br />
                            <textarea type="text" /><br />
                            Language Skills <br />
                            <textarea type="text" /><br />
                        </form>
                        <h4>Skills</h4>
                        <form>
                            Skill <br />
                            <input type="text" /><br />
                            Skill level <br />
                            <input type="text" /><br />
                            Example project <br />
                            <textarea type="text" /><br />
                            Skill <br />
                            <input type="text" /><br />
                            Skill level <br />
                            <input type="text" /><br />
                            Example project <br />
                            <textarea type="text" /><br />
                            Tyylikkäämpi toteutus osaamisille
                        </form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button type="submit">Save changes</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

class EditPortfolio extends Component {
    constructor() {
        super();
        this.state = {
            BasicInfo: true,
            Pictures: ""
        };
        this.handleNavClick = this.handleNavClick.bind(this);
    }

    // Controls which form (info/pictures) will rendered on a screen
    handleNavClick(btn) {
        let btnId = btn.target.id;
        if (btnId === "basicInfo") {
            this.setState({
                BasicInfo: true,
                Pictures: false,
            });
        } else if (btnId === "pictures") {
            this.setState({
                BasicInfo: false,
                Pictures: true,
            });
        } else {
            alert("Error happened. Please refresh the page.");
        }
    }

    render() {
        return (
            <main>
                <Container>
                    <Row>
                        <Col>
                            <h3>Edit portfolio</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ul>
                                <li><button id="basicInfo" onClick={this.handleNavClick}>Basic Info</button></li>
                                <li><button id="pictures" onClick={this.handleNavClick}>Pictures</button></li>
                            </ul>
                        </Col>
                    </Row>
                    <Fragment>
                        {this.state.BasicInfo ? <InfoEdit /> : null}
                        {this.state.Pictures ? <PictureEdit /> : null}
                    </Fragment>
                </Container>
            </main>
        );
    }
}

export default EditPortfolio;