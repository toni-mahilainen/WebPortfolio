import React, { Component } from 'react';
import './iCan.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

class ICan extends Component {
    constructor(props) {
        super(props);
    }

    getProjects(skillId) {
        console.log(skillId);
    }

    render() {
        // Body for table
        let tbody = [];
        if (this.props.skills.length > 0) {
            for (let index = 0; index < this.props.skills.length; index++) {
                const element = this.props.skills[index];
                tbody.push(
                    <tr key={element.skillId}>
                            <td>
                                <Button id="skillBtn" onClick={this.getProjects.bind(this, element.skillId)}>
                                    {element.skill}
                                </Button>
                            </td>
                    </tr>
                );
            }
        }
        return (
            <section className="iCan">
                <Container>
                    <Row>
                        <h1>I Can</h1>
                    </Row>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            <table>
                                <tbody>
                                    {tbody}
                                </tbody>
                            </table>
                        </Col>
                        <Col>
                            <table>

                                <tbody>
                                    <tr>
                                        <td>Taso</td>
                                        <td>Projekti</td>
                                    </tr>
                                    <tr>
                                        <td>Taso</td>
                                        <td>Projekti</td>
                                    </tr>
                                    <tr>
                                        <td>Taso</td>
                                        <td>Projekti</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default ICan;