import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class IAm extends Component {
    constructor(props) {
        super(props);
        this.convertToDate = this.convertToDate.bind(this);
        this.addEmails = this.addEmails.bind(this);
    }

    componentDidMount() {
        this.addEmails();
    }

    addEmails() {
        // div
        let basicInfoUl = document.getElementById("basicInfoUl");

        for (let index = 0; index < this.props.emails.length; index++) {
            // li
            let li = document.createElement("li");
            let email = document.createTextNode(this.props.emails[index]);
            li.appendChild(email);
            basicInfoUl.appendChild(li);
        }
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
        // Background styling object
        const background = {
            // background: "url(" + this.props.iamPicUrl + ")",
            background: this.props.iamPicUrl,
            backgroundSize: "100 % 100 %"
        }

        return (
            <section className="iAm" style={background}>
                <Container>
                    <Row>
                        <Col>
                            <img src={this.props.profilePicUrl} alt="Profile"/>
                            <ul id="basicInfoUl">
                                <li>{this.props.content.firstname}</li>
                                <li>{this.props.content.lastname}</li>
                                <li>{this.convertToDate(this.props.content.birthdate)}</li>
                                <li>{this.props.content.city}</li>
                                <li>{this.props.content.country}</li>
                                <li>{this.props.content.phonenumber}</li>
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