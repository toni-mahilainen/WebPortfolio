import React, { Component } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: "",
            Link: "",
            Description: "",
            ShowProjectDetailsModal: false
        }
        this.closeProjectDetailsModal = this.closeProjectDetailsModal.bind(this);
        this.closeSkillInfo = this.closeSkillInfo.bind(this);
        this.generateMultilineDescription = this.generateMultilineDescription.bind(this);
        this.generateProjectsList = this.generateProjectsList.bind(this);
        this.openProjectDetailsModal = this.openProjectDetailsModal.bind(this);
        this.showProjectDetails = this.showProjectDetails.bind(this);
    }

    componentDidMount() {
        this.generateProjectsList();
    }

    generateProjectsList() {
        let projectsListDiv = document.getElementById("projectsCol");
        let ul = document.createElement("ul");
        for (let index = 0; index < this.props.projects.length; index++) {
            const element = this.props.projects[index];
            ul.id = "projectsList"
            // Create elements
            let li = document.createElement("li");
            let projectName = document.createTextNode(element.name);
            let buttonText = document.createTextNode("Show details");
            let showDetailsBtn = document.createElement("button");
            // Class/Id
            li.className = "projectsLi";
            // Attributes
            showDetailsBtn.setAttribute("type", "button");
            // Event
            showDetailsBtn.onclick = () => { this.showProjectDetails(element.name, element.link, element.description); }
            // Append
            showDetailsBtn.appendChild(buttonText);
            li.appendChild(projectName);
            li.appendChild(showDetailsBtn);
            ul.appendChild(li);
        }
        projectsListDiv.appendChild(ul);
    }

    // Close modal window for project details
    closeProjectDetailsModal() {
        this.setState({
            ShowProjectDetailsModal: false
        });
    }

    closeSkillInfo() {
        document.getElementById("skillInfoCol").style.display = "none";
        document.getElementById("skillCol").style.display = "block";
    }

    // Divide the description to the paragraphs based on how the user has wrapped it in the Edit Portfolio
    generateMultilineDescription() {
        let p = document.createElement("p");
        // Splitted for "line feed"
        let descriptionArray = this.state.Description.split("\n");
        for (let index = 0; index < descriptionArray.length; index++) {
            const element = descriptionArray[index];
            let textNode = document.createTextNode(element);
            let br = document.createElement("br");
            p.appendChild(textNode)
            p.appendChild(br)
        };

        document.getElementById("descriptionDiv").appendChild(p);
    }

    // Open modal window for project details
    openProjectDetailsModal() {
        this.setState({
            ShowProjectDetailsModal: true
        });
    }

    showProjectDetails(name, link, description) {
        this.openProjectDetailsModal();
        this.setState({
            Name: name,
            Link: link,
            Description: description
        }, this.generateMultilineDescription);
    }

    render() {
        return (
            <Col id="skillInfoCol">
                <button id="closeSkillInfoBtn" type="button">
                    <span className="fas fa-times-circle" onClick={this.closeSkillInfo}></span>
                </button>
                <div id="skillLevelCol">
                    <h2>{this.props.skillName}</h2>
                    <div className="skillLevelBar">
                        <span className="skillLevel" style={{ width: this.props.skillLevel + "%" }}><label>Skill level</label></span>
                    </div>
                </div>
                <div id="scrollableProjects">
                    <div id="projectsHeader">
                        <h3>Projektit</h3>
                    </div>
                    <div id="projectsCol"></div>
                </div>

                {/* Modal window for project details */}
                <Modal id="projectDetailsModal" show={this.state.ShowProjectDetailsModal} onHide={this.closeProjectDetailsModal} centered>
                    <div id="projectDetailsModalWrapper">
                        <button id="upperCloseProjectDetailsModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeProjectDetailsModal}></span>
                        </button>
                        <Modal.Header>
                            <Modal.Title>
                                <div id="nameDiv">
                                    {this.state.Name}
                                </div>
                            </Modal.Title>
                        </Modal.Header>
                        <form>
                            <Modal.Body>
                                <div id="linkDiv">
                                    <h5>Link</h5>
                                    <a href={this.state.Link} target="blank">{this.state.Link}</a>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div id="descriptionDiv">
                                    <h5>Description</h5>
                                </div>
                            </Modal.Footer>
                        </form>
                        <button id="lowerCloseProjectDetailsModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeProjectDetailsModal}></span>
                        </button>
                    </div>
                </Modal>
            </Col>
        )
    }
}

class ICan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProjectsVisible: false,
            Projects: [],
            SkillLevel: 0,
            SkillName: ""
        }
        this.generateSkillList = this.generateSkillList.bind(this);
    }

    componentDidMount() {
        this.generateSkillList();
    }

    generateSkillList() {
        let skillCol = document.getElementById("skillScrollableDiv");
        let ul = document.createElement("ul");
        ul.id = "skillList"
        for (let index = 0; index < this.props.skills.length; index++) {
            const element = this.props.skills[index];
            // Create elements
            let li = document.createElement("li");
            let skillName = document.createTextNode(element.skill);
            let showProjectsbutton = document.createElement("button");
            let span = document.createElement("span");
            // Class/Id
            li.className = "skillLi";
            span.className = "fas fa-chevron-right";
            // Attributes
            showProjectsbutton.setAttribute("type", "button");
            showProjectsbutton.setAttribute("title", "Show skill info");
            // Event
            showProjectsbutton.onclick = () => { this.getProjects(element.skillId, element.skill, element.skillLevel); }
            // Append
            showProjectsbutton.appendChild(span);
            li.appendChild(skillName);
            li.appendChild(showProjectsbutton);
            ul.appendChild(li);
        }
        skillCol.appendChild(ul);
    }

    getProjects(skillId, skillName, skillLevel) {
        const projectsSettings = {
            url: 'https://webportfolioapi.azurewebsites.net/api/projects/' + skillId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        Axios(projectsSettings)
            .then((response) => {
                if (window.screen.width <= 768) {
                    document.getElementById("skillCol").style.display = "none";
                }
                this.setState({
                    ProjectsVisible: false,
                })
                this.setState({
                    ProjectsVisible: true,
                    Projects: response.data,
                    SkillLevel: skillLevel,
                    SkillName: skillName
                })
            })
            .catch(error => {
                console.log("Projects error: " + error.data);
            })
    }

    render() {
        let background = {
            backgroundImage: "url(" + this.props.icanPicUrl + ")"
        };

        return (
            <section id="iCan" style={background}>
                <Container>
                    <Row>
                        <Col id="skillCol">
                            <div id="skillScrollableDiv"></div>
                        </Col>
                        {this.state.ProjectsVisible && this.state.Projects && this.state.SkillName && this.state.SkillLevel ?
                            <Projects
                                projects={this.state.Projects}
                                skillName={this.state.SkillName}
                                skillLevel={this.state.SkillLevel}
                                icanPicUrl={this.props.icanPicUrl}
                            /> : null}
                    </Row>
                </Container>
            </section>
        );
    }
}

export default ICan;