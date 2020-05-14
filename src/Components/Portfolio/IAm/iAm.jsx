import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class IAm extends Component {
    constructor() {
        super();
        this.convertToDate = this.convertToDate.bind(this);
    }

    convertToDate(date) {
        // Convert datetime to date format
        let birthdate = new Date(date);
        let formatedDate = birthdate.toLocaleDateString('fi-FI', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        }).replace(/ /g, '-');
        return formatedDate;
    }

    render() {
        return (
            <section className="iAm">
                <Container>
                    <Row>
                        <h1>I Am</h1>
                    </Row>
                    <Row>
                        <Col>
                            <p>Kuva</p>
                            <ul>
                                <li>{this.props.content.firstname}</li>
                                <li>{this.props.content.lastname}</li>
                                <li>{this.convertToDate(this.props.content.birthdate)}</li>
                                <li>{this.props.content.city}</li>
                                <li>{this.props.content.country}</li>
                                <li>{this.props.content.phonenumber}</li>
                                <li>Email 1</li>
                                <li>Email 2</li>
                            </ul>
                        </Col>
                        <Col>
                            <ul>
                                <li>{this.props.content.basicKnowledge}</li>
                                <li>{this.props.content.education}</li>
                                <li>{this.props.content.workHistory}</li>
                                <li>{this.props.content.languageSkills}</li>
                            </ul>
                        </Col>
                    </Row>

                </Container>
            </section>
        );
    }
}

export default IAm;