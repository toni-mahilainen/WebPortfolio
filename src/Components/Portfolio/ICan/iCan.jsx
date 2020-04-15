import React, { Component } from 'react';
import './iCan.css';
import { Container, Row, Col } from 'react-bootstrap';

class ICan extends Component {
    render() {
        return (
            <section className="iAm">
                <Container>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            <table>taulukko osaamisista{/* taulukko osaamisalueista, joka luodaan js:llä */}</table>
                        </Col>
                        <Col>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Osaamisen taso</th>
                                        <th>Esimerkkiprojekti</th>
                                    </tr>
                                </thead>
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