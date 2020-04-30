import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Axios from 'axios';

class PictureEdit extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Pictures</h4>
                        <form>
                            Profile <br />
                            <input id="profilePicInput" type="file" /><br />
                            Home background <br />
                            <input id="homePicInput" type="file" /><br />
                            I am background <br />
                            <input id="iamPicInput" type="file" /><br />
                            I can background <br />
                            <input id="icanPicInput" type="file" /><br />
                            Questbook background <br />
                            <input id="questbookPicInput" type="file" /><br />
                            Contact background <br />
                            <input id="contactPicInput" type="file" /><br />
                            <Button type="submit">Save changes</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

class SkillsEdit extends Component {
    constructor() {
        super();
        this.state = {
            SkillName: "",
            SkillLevel: 0,
            Project: [],
            ProjectName: [],
            ProjectLink: [],
            ProjectDescription: []
        }
        this.addNewProject = this.addNewProject.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    addNewProject() {
        // div
        let addProjectsDiv = document.getElementById("addProjects");
        // br
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        let br5 = document.createElement("br");
        // textnode
        let textNodeName = document.createTextNode("Project name");
        let textNodeLink = document.createTextNode("Project link");
        let textNodeDescription = document.createTextNode("Project Description");
        // input
        let inputName = document.createElement("input");
        let inputLink = document.createElement("input");
        let textareaDescription = document.createElement("textarea");
        // add class
        inputName.className = "inputProjectName";
        inputLink.className = "inputProjectLink";
        textareaDescription.className = "textareaProjectDescription";
        // launch handleValueChange when input change
        inputName.onchange = this.handleValueChange;
        inputLink.onchange = this.handleValueChange;
        textareaDescription.onchange = this.handleValueChange;
        // append
        addProjectsDiv.appendChild(textNodeName);
        addProjectsDiv.appendChild(br1);
        addProjectsDiv.appendChild(inputName);
        addProjectsDiv.appendChild(br2);
        addProjectsDiv.appendChild(textNodeLink);
        addProjectsDiv.appendChild(br3);
        addProjectsDiv.appendChild(inputLink);
        addProjectsDiv.appendChild(br4);
        addProjectsDiv.appendChild(textNodeDescription);
        addProjectsDiv.appendChild(br5);
        addProjectsDiv.appendChild(textareaDescription);
    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputClassnName = input.target.className;
        let newProjectNameArray = this.state.ProjectName.slice();
        let newProjectLinkArray = this.state.ProjectLink.slice();
        let newProjectDescriptionArray = this.state.ProjectDescription.slice();

        switch (inputClassnName) {
            case "skillNameInput":
                this.setState({
                    SkillName: input.target.value
                });
                break;

            case "skillLevelInput":
                this.setState({
                    SkillLevel: input.target.value
                });
                break;

            case "inputProjectName":
                newProjectNameArray.push(input.target.value);
                this.setState({
                    ProjectName: newProjectNameArray
                });
                break;

            case "inputProjectLink":
                newProjectLinkArray.push(input.target.value);
                this.setState({
                    ProjectLink: newProjectLinkArray
                });
                break;

            case "textareaProjectDescription":
                newProjectDescriptionArray.push(input.target.value);
                this.setState({
                    ProjectDescription: newProjectDescriptionArray
                });
                break;

            default:
                break;
        }
    }

    handleSubmit() {
        // Skill and projects to database
        // Objects for requests
        const skillObj = {
            Firstname: this.state.Firstname,
            Lastname: this.state.Lastname,
            Birthdate: this.state.DateOfBirth,
            City: this.state.City,
            Country: this.state.Country,
            Emails: this.state.Emails,
            Phonenumber: this.state.Phonenumber,
            Punchline: this.state.Punchline,
            BasicKnowledge: this.state.BasicKnowledge,
            Education: this.state.Education,
            WorkHistory: this.state.WorkHistory,
            LanguageSkills: this.state.LanguageSkills
        }

        // User ID automaattisesti jatkossa
        // Settings for axios requests
        const settings = {
            url: 'https://localhost:5001/api/skills/17',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: skillObj
        };

        // Requests
        const skillPost = Axios(settings);

        Promise.all([skillPost])
            .then((responses) => {
                if (responses[0].status >= 200 && responses[0].status < 300) {
                    alert("Skill/Projects added succesfully!")
                } else {
                    console.log(responses[0].data);
                    alert("Problems!!")
                }
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            Skill <br />
                            <input className="skillNameInput" type="text" onChange={this.handleValueChange} /><br />
                            Skill level <br />
                            <input className="skillLevelInput" type="range" min="0" max="100" step="1" defaultValue="0" onChange={this.handleValueChange} /><span> {this.state.SkillLevel1} %</span><br />
                            <div id="addProjects"></div>
                            <Button type="button" onClick={this.addNewProject}>Add project</Button><br />
                            Tyylikkäämpi toteutus osaamisille
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Save changes</Button>
                        </Col>
                    </Row>
                </Container>
            </form>
        )
    }
}

class InfoEdit extends Component {
    constructor() {
        super();
        this.state = {
            Firstname: "",
            Lastname: "",
            DateOfBirth: "",
            City: "",
            Country: "",
            Phonenumber: "",
            Emails: [],
            SocialMediaLink1: "",
            SocialMediaService1: "",
            SocialMediaLink2: "",
            SocialMediaService2: "",
            Punchline: "",
            BasicKnowledge: "",
            Education: "",
            WorkHistory: "",
            LanguageSkills: "",
            Skill1: "",
            SkillLevel1: 0,
            Project1: "",
            Skill2: "",
            SkillLevel2: 0,
            Project2: ""
        }
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;
        let newEmailsArray = this.state.Emails.slice();

        switch (inputId) {
            case "firstnameInput":
                this.setState({
                    Firstname: input.target.value
                });
                break;

            case "lastnameInput":
                this.setState({
                    Lastname: input.target.value
                });
                break;

            case "birthdateInput":
                this.setState({
                    DateOfBirth: input.target.value
                });
                break;

            case "cityInput":
                this.setState({
                    City: input.target.value
                });
                break;

            case "countryInput":
                this.setState({
                    Country: input.target.value
                });
                break;

            case "phoneInput":
                this.setState({
                    Phonenumber: input.target.value
                });
                break;

            case "email1Input":
                newEmailsArray.push(input.target.value);
                this.setState({
                    Emails: newEmailsArray
                });
                break;

            case "email2Input":
                newEmailsArray.push(input.target.value);
                this.setState({
                    Emails: newEmailsArray
                });
                break;

            case "socialMediaSelect1":
                this.setState({
                    SocialMediaService1: input.target.value
                });
                break;

            case "socialMedia1Input":
                this.setState({
                    SocialMediaLink1: input.target.value
                });
                break;

            case "socialMediaSelect2":
                this.setState({
                    SocialMediaService2: input.target.value
                });
                break;

            case "socialMedia2Input":
                this.setState({
                    SocialMediaLink2: input.target.value
                });
                break;

            case "punchlineInput":
                this.setState({
                    Punchline: input.target.value
                });
                break;

            case "basicInput":
                this.setState({
                    BasicKnowledge: input.target.value
                });
                break;

            case "educationInput":
                this.setState({
                    Education: input.target.value
                });
                break;

            case "workHistoryInput":
                this.setState({
                    WorkHistory: input.target.value
                });
                break;

            case "languageinput":
                this.setState({
                    LanguageSkills: input.target.value
                });
                break;

            case "skillInput1":
                this.setState({
                    Skill1: input.target.value
                });
                break;

            case "skillLevelInput1":
                this.setState({
                    SkillLevel1: input.target.value
                });
                break;

            default:
                break;
        }
    }



    handleSubmit() {
        // Content and social media links to database
        // Objects for requests
        const contentObj = {
            Firstname: this.state.Firstname,
            Lastname: this.state.Lastname,
            Birthdate: this.state.DateOfBirth,
            City: this.state.City,
            Country: this.state.Country,
            Emails: this.state.Emails,
            Phonenumber: this.state.Phonenumber,
            Punchline: this.state.Punchline,
            BasicKnowledge: this.state.BasicKnowledge,
            Education: this.state.Education,
            WorkHistory: this.state.WorkHistory,
            LanguageSkills: this.state.LanguageSkills
        }

        const socialMediaObj = {
            ServiceId: parseInt(this.state.SocialMediaService1),
            Link: this.state.SocialMediaLink1
        }



        // User ID automaattisesti jatkossa
        // Settings for axios requests
        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/17',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: contentObj
        };

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/17',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: socialMediaObj
        };

        // Requests
        const contentPost = Axios(contentSettings);
        const socialMediaPost = Axios(socialMediaSettings);

        Promise.all([contentPost, socialMediaPost])
            .then((responses) => {
                if ((responses[0].status && responses[1].status) >= 200 && (responses[0].status && responses[1].status) < 300) {
                    alert("Content added succesfully!")
                } else {
                    console.log(responses[0].data);
                    console.log(responses[1].data);
                    alert("Problems!!")
                }
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Personal</h4>
                            Firstname <br />
                            <input id="firstnameInput" type="text" onChange={this.handleValueChange} /><br />
                            Lastname <br />
                            <input id="lastnameInput" type="text" onChange={this.handleValueChange} /><br />
                            Date of birth <br />
                            <input id="birthdateInput" type="date" onChange={this.handleValueChange} /><br />
                            City <br />
                            <input id="cityInput" type="text" onChange={this.handleValueChange} /><br />
                            Country <br />
                            <input id="countryInput" type="text" onChange={this.handleValueChange} /><br />
                            Phonenumber <br />
                            <input id="phoneInput" type="tel" onChange={this.handleValueChange} /><br />
                            Email 1 <br />
                            <input id="email1Input" type="email" onBlur={this.handleValueChange} /><br />
                            Email 2 <br />
                            <input id="email2Input" type="email" onBlur={this.handleValueChange} /><br />
                            Social media service 1 <br />
                            <select id="socialMediaSelect1" onChange={this.handleValueChange} >
                                <option value="1">Facebook</option>
                                <option value="2">Instagram</option>
                                <option value="3">Twitter</option>
                                <option value="4">Github</option>
                                <option value="5">Youtube</option>
                                <option value="6">LinkedIn</option>
                            </select><br />
                            Social media link 1 <br />
                            <input id="socialMedia1Input" type="url" onChange={this.handleValueChange} /><br />
                            Social media service 2 <br />
                            <select id="socialMediaSelect2" onChange={this.handleValueChange} >
                                <option value="1">Facebook</option>
                                <option value="2">Instagram</option>
                                <option value="3">Twitter</option>
                                <option value="4">Github</option>
                                <option value="5">Youtube</option>
                                <option value="6">LinkedIn</option>
                            </select><br />
                            Social media link 2 <br />
                            <input id="socialMedia2Input" type="url" onChange={this.handleValueChange} /><br />
                            Tyylikkäämpi toteutus sähköposteille ja somelinkeille
                        </Col>
                        <Col>
                            <h4>Homepage</h4>
                            Punchline <br />
                            <textarea id="punchlineInput" type="text" onChange={this.handleValueChange} /><br />
                            <h4>Basic</h4>
                            Basic Knowledge <br />
                            <textarea id="basicInput" type="text" onChange={this.handleValueChange} /><br />
                            Education <br />
                            <textarea id="educationInput" type="text" onChange={this.handleValueChange} /><br />
                            Work History <br />
                            <textarea id="workHistoryInput" type="text" onChange={this.handleValueChange} /><br />
                            Language Skills <br />
                            <textarea id="languageinput" type="text" onChange={this.handleValueChange} /><br />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Save changes</Button>
                        </Col>
                    </Row>
                </Container>
            </form>
        )
    }
}

class EditPortfolio extends Component {
    constructor() {
        super();
        this.state = {
            BasicInfo: "",
            Skills: true,
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
                Skills: false,
                Pictures: false
            });
        } else if (btnId === "skills") {
            this.setState({
                BasicInfo: false,
                Skills: true,
                Pictures: false
            });
        } else if (btnId === "pictures") {
            this.setState({
                BasicInfo: false,
                Skills: false,
                Pictures: true
            });
        } else {
            alert("Error happened. Please refresh the page.");
        }
    }

    render() {
        return (
            <main className="editPortfolio">
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
                                <li><button id="skills" onClick={this.handleNavClick}>Skills</button></li>
                                <li><button id="pictures" onClick={this.handleNavClick}>Pictures</button></li>
                            </ul>
                        </Col>
                    </Row>
                    <Fragment>
                        {this.state.BasicInfo ? <InfoEdit /> : null}
                        {this.state.Skills ? <SkillsEdit /> : null}
                        {this.state.Pictures ? <PictureEdit /> : null}
                    </Fragment>
                </Container>
            </main>
        );
    }
}

export default EditPortfolio;