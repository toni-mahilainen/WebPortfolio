import React, { Component } from 'react';
import './iAm.css';
import { Container, Row, Col } from 'react-bootstrap';

class Details extends Component {
    constructor(props) {
        super(props);
        this.generateMultilineContent = this.generateMultilineContent.bind(this);
    }

    componentDidMount() {
        this.generateMultilineContent();
    }

    // Divide the content to the paragraphs based on how the user has wrapped it in the Edit Portfolio
    generateMultilineContent() {
        let p = document.createElement("p");
        // Splitted for "line feed"
        let contentArray = this.props.content.split("\n");
        for (let index = 0; index < contentArray.length; index++) {
            const element = contentArray[index];
            let textNode = document.createTextNode(element);
            let br = document.createElement("br");
            p.appendChild(textNode)
            p.appendChild(br)
        };

        switch (this.props.detailsRequest) {
            case "basic":
                document.getElementById("basicInfoDiv").appendChild(p);
                break;

            case "education":
                document.getElementById("educationInfoDiv").appendChild(p);
                break;

            case "work":
                document.getElementById("workInfoDiv").appendChild(p);
                break;

            case "language":
                document.getElementById("languageInfoDiv").appendChild(p);
                break;

            default:
                break;
        }
    }

    render() {
        if (this.props.detailsRequest === "basic") {
            return (
                <div id="basicInfoDiv"></div>
            )
        } else if (this.props.detailsRequest === "education") {
            return (
                <div id="educationInfoDiv"></div>
            )
        } else if (this.props.detailsRequest === "work") {
            return (
                <div id="workInfoDiv"></div>
            )
        } else if (this.props.detailsRequest === "language") {
            return (
                <div id="languageInfoDiv"></div>
            )
        } else {
            return (
                <div id="errorInfoDiv">
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
        this.changeBasic = this.changeBasic.bind(this);
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

    changeBasic(event) {
        if (event.target.id === "changeBasicRightBtn") {
            document.getElementById("iamLeftCol").style.display = "none";
            document.getElementById("iamRightCol").style.display = "block";
        } else {
            document.getElementById("iamRightCol").style.display = "none";
            document.getElementById("iamLeftCol").style.display = "block";
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
                        <button className="changeBasicBtn"><span id="changeBasicLeftBtn" className="fas fa-chevron-left" onClick={this.changeBasic}></span></button>
                        <button className="changeBasicBtn"><span id="changeBasicRightBtn" className="fas fa-chevron-right" onClick={this.changeBasic}></span></button>
                        <Col id="iamLeftCol">
                            <div id="iamLeftScrollableDiv">
                                <img src={this.props.profilePicUrl} alt="Profile" />
                                <ul id="basicInfoUl">
                                    <li><b>Firstname: </b><span className="basicContent"><b>{this.props.content.firstname}</b></span></li>
                                    <li><b>Lastname: </b><span className="basicContent"><b>{this.props.content.lastname}</b></span></li>
                                    <li><b>Date of birth: </b><span className="basicContent"><b>{this.convertToDate(this.props.content.birthdate)}</b></span></li>
                                    <li><b>City: </b><span className="basicContent"><b>{this.props.content.city}</b></span></li>
                                    <li><b>Country: </b><span className="basicContent"><b>{this.props.content.country}</b></span></li>
                                    <li><b>Phonenumber: </b><span className="basicContent"><b>{this.props.content.phonenumber}</b></span></li>
                                </ul>
                            </div>
                        </Col>
                        <Col id="iamRightCol">
                            <div id="iamRightScrollableDiv">
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
                                                {this.state.BasicVisible ? <Details detailsRequest="basic" content={this.props.content.basicKnowledge} /> : null}
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
                                                {this.state.EducVisible ? <Details detailsRequest="education" content={this.props.content.education} /> : null}
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
                                                {this.state.WorkVisible ? <Details detailsRequest="work" content={this.props.content.workHistory} /> : null}
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
                                                {this.state.LangVisible ? <Details detailsRequest="language" content={this.props.content.languageSkills} /> : null}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default IAm;