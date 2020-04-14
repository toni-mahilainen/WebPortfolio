import React, { Component } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

class EditPortfolio extends Component {
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
                            <h4>Personal</h4>
                            <form>
                                Firstname <br />
                                <input type="text" /><br />
                                Lastname <br />
                                <input type="text" /><br />
                                Birthdate <br />
                                <input type="text" /><br />
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
            </main>
        );
    }
}

export default EditPortfolio;