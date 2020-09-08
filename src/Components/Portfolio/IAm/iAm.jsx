import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class Details extends Component {
    render() {
        if (this.props.detailsRequest === "basic") {
            return (
                <div id="infoDiv">
                    <p>
                        <b>{this.props.basicKnowledge}</b>
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "education") {
            return (
                <div id="infoDiv">
                    <p>
                        <b>{this.props.education}</b>
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "work") {
            return (
                <div id="infoDiv">
                    <p>
                        <b>{this.props.workHistory}</b>
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "language") {
            return (
                <div id="infoDiv">
                    <p>
                        <b>{this.props.languageSkills}</b>
                    </p>
                </div>
            )
        } else {
            return (
                <div id="infoDiv">
                    <p>
                        Something went wrong! Please reload the page.
                    </p>
                </div>
            )
        }
    }
}

class IAm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BasicVisible: false,
            EducVisible: false,
            WorkVisible: false,
            LangVisible: false
        }
        this.addEmails = this.addEmails.bind(this);
        this.convertToDate = this.convertToDate.bind(this);
        this.ShowHideDetails = this.ShowHideDetails.bind(this);
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
            let b1 = document.createElement("b");
            let b2 = document.createElement("b");
            let span = document.createElement("span");
            let emailText = document.createTextNode("Email: ");
            let email = document.createTextNode(this.props.emails[index].emailAddress);
            span.className = "basicContent";
            b1.appendChild(emailText);
            li.appendChild(b1);
            b2.appendChild(email);
            span.appendChild(b2);
            li.appendChild(span);
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

    ShowHideDetails(event) {
        let btnId = event.target.id;

        // Painikkeen perusteella näytetään/piilotetaan oikeat lisätiedot
        if (btnId === "basic") {
            switch (this.state.BasicVisible) {
                case false:
                    this.setState({
                        BasicVisible: true,
                    });
                    break;

                case true:
                    this.setState({
                        BasicVisible: false
                    });
                    break;

                default:
                    alert("Error! Please reload the page.")
                    break;
            }
        } else if (btnId === "education") {
            switch (this.state.EducVisible) {
                case false:
                    this.setState({
                        EducVisible: true,
                    });
                    break;

                case true:
                    this.setState({
                        EducVisible: false,
                    });
                    break;

                default:
                    alert("Error! Please reload the page.")
                    break;
            }
        } else if (btnId === "work") {
            switch (this.state.WorkVisible) {
                case false:
                    this.setState({
                        WorkVisible: true,
                    });
                    break;

                case true:
                    this.setState({
                        WorkVisible: false
                    });
                    break;

                default:
                    alert("Error! Please reload the page.")
                    break;
            }
        } else if (btnId === "language") {
            switch (this.state.LangVisible) {
                case false:
                    this.setState({
                        LangVisible: true,
                    });
                    break;

                case true:
                    this.setState({
                        LangVisible: false
                    });
                    break;

                default:
                    alert("Something went wrong! Please reload the page.")
                    break;
            }
        }
    }

    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.iamPicUrl + ")",
            backgroundSize: "100% 100%"
        }

        return (
            <section id="iAm" className="iAm" style={background}>
                <Container>
                    <Row>
                        <Col id="iamLeftCol">
                            <img src={this.props.profilePicUrl} alt="Profile" />
                            <ul id="basicInfoUl">
                                <li><b>Firstname: </b><span className="basicContent"><b>{this.props.content.firstname}</b></span></li>
                                <li><b>Lastname: </b><span className="basicContent"><b>{this.props.content.lastname}</b></span></li>
                                <li><b>Date of birth: </b><span className="basicContent"><b>{this.convertToDate(this.props.content.birthdate)}</b></span></li>
                                <li><b>City: </b><span className="basicContent"><b>{this.props.content.city}</b></span></li>
                                <li><b>Country: </b><span className="basicContent"><b>{this.props.content.country}</b></span></li>
                                <li><b>Phonenumber: </b><span className="basicContent"><b>{this.props.content.phonenumber}</b></span></li>
                            </ul>
                        </Col>
                        <Col id="iamRightCol">
                            <table className="iamTable">
                                <tbody>
                                    <tr>
                                        <td className="tdHeader">
                                            <h3>Basic knowledge</h3>
                                        </td>
                                        <td className="tdButton">
                                            <button className="showDetailsBtn" onClick={this.ShowHideDetails}>
                                                <span id="basic" className="fas fa-chevron-down"></span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdInfoDiv">
                                            {this.state.BasicVisible ? <Details detailsRequest="basic" basicKnowledge={this.props.content.basicKnowledge} /> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdHeader">
                                            <h3>Education</h3>
                                        </td>
                                        <td className="tdButton">
                                            <button className="showDetailsBtn" onClick={this.ShowHideDetails}>
                                                <span id="education" className="fas fa-chevron-down"></span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdInfoDiv">
                                            {this.state.EducVisible ? <Details detailsRequest="education" education={this.props.content.education} /> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdHeader">
                                            <h3>Work history</h3>
                                        </td>
                                        <td className="tdButton">
                                            <button className="showDetailsBtn" onClick={this.ShowHideDetails}>
                                                <span id="work" className="fas fa-chevron-down"></span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdInfoDiv">
                                            {this.state.WorkVisible ? <Details detailsRequest="work" workHistory={this.props.content.workHistory} /> : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdHeader">
                                            <h3>Language skills</h3>
                                        </td>
                                        <td className="tdButton">
                                            <button className="showDetailsBtn" onClick={this.ShowHideDetails}>
                                                <span id="language" className="fas fa-chevron-down"></span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tdInfoDiv">
                                            {this.state.LangVisible ? <Details detailsRequest="language" languageSkills={this.props.content.languageSkills} /> : null}
                                        </td>
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

export default IAm;