import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class Details extends Component {
    render() {
        if (this.props.detailsRequest === "basic") {
            return (
                <div id="infoDiv">
                    <p>
                        {this.props.basicKnowledge}
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "education") {
            return (
                <div id="infoDiv">
                    <p>
                        {this.props.education}
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "work") {
            return (
                <div id="infoDiv">
                    <p>
                        {this.props.workHistory}
                    </p>
                </div>
            )
        } else if (this.props.detailsRequest === "language") {
            return (
                <div id="infoDiv">
                    <p>
                        {this.props.languageSkills}
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
            let b = document.createElement("b");
            let emailText = document.createTextNode("Email: ");
            let email = document.createTextNode(this.props.emails[index].emailAddress);
            b.appendChild(emailText);
            li.appendChild(b);
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
            // background: this.props.iamPicUrl,
            backgroundSize: "100 % 100 %"
        }

        return (
            <section id="iAm" className="iAm" style={background}>
                <Container>
                    <Row>
                        <Col id="iamLeftCol">
                            <img src={this.props.profilePicUrl} alt="Profile" />
                            <ul id="basicInfoUl">
                                <li><b>Firstname: </b>{this.props.content.firstname}</li>
                                <li><b>Lastname: </b>{this.props.content.lastname}</li>
                                <li><b>Date of birth: </b>{this.convertToDate(this.props.content.birthdate)}</li>
                                <li><b>City: </b>{this.props.content.city}</li>
                                <li><b>Country: </b>{this.props.content.country}</li>
                                <li><b>Phonenumber: </b>{this.props.content.phonenumber}</li>
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