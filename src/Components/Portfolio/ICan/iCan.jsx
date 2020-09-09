import React, { Component } from 'react';
import './iCan.css';
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
        this.generateProjectsList = this.generateProjectsList.bind(this);
        this.openProjectDetailsModal = this.openProjectDetailsModal.bind(this);
        this.showProjectDetails = this.showProjectDetails.bind(this);
    }

    componentDidMount() {
        this.generateProjectsList();
    }

    generateProjectsList() {
        let projectsListDiv = document.getElementById("projectsListDiv");
        let ul = document.createElement("ul");
        for (let index = 0; index < this.props.projects.length; index++) {
            const element = this.props.projects[index];
            ul.id = "projectsList"
            console.log(element);
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
        });
    }

    render() {
        const background = {
            background: "url(" + this.props.icanPicUrl + ")",
            backgroundSize: "100% 100%"
        }

        return (
            <Col id="skillInfoCol">
                <div id="skillLevelCol">
                    <h2>{this.props.skillName}</h2>
                    <div className="skillLevelBar">
                        <span className="skillLevel" style={{ width: this.props.skillLevel + "%" }}><label>Skill level</label></span>
                    </div>
                </div>
                <div id="projectsCol">
                    <h3>Projektit</h3>
                    <div id="projectsListDiv"></div>
                </div>

                {/* Modal window for project details */}
                <Modal id="projectDetailsModal" show={this.state.ShowProjectDetailsModal} onHide={this.closeProjectDetailsModal} centered>
                    <div id="projectDetailsModalWrapper">
                        <button className="closeProjectDetailsModalBtn" type="button" title="Close">
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
                                    <p>{this.state.Description}</p>
                                </div>
                            </Modal.Footer>
                        </form>
                        <button className="closeProjectDetailsModalBtn" type="button" title="Close">
                            <span className="fas fa-times-circle" onClick={this.closeProjectDetailsModal}></span>
                        </button>
                    </div>
                </Modal>
            </Col>


        )

        // <Container id="iCanExamples">
        //     <h1>GitHub</h1>
        //     <div className="skillLevelBar">
        //         <span className="skillLevel" style={{ width: "30%" }}><h5>Skill level</h5></span>
        //     </div>
        // </Container>
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
        this.generateProjetsTableHead = this.generateProjetsTableHead.bind(this);
        this.generateProjetsTableBody = this.generateProjetsTableBody.bind(this);
        this.generateSkillLevelTable = this.generateSkillLevelTable.bind(this);
        this.generateSkillList = this.generateSkillList.bind(this);
    }

    componentDidMount() {
        this.generateSkillList();
    }


    generateProjetsTableHead(table) {
        // Clear table before adding new content
        document.getElementById("projectsTbl").innerHTML = "";
        // Header array
        let headers = ["Project ID", "Name", "Link", "Description"];
        let thead = table.createTHead();
        // Row to head
        let row = thead.insertRow();

        // Headers to table head
        for (let index = 0; index < headers.length; index++) {
            let th = document.createElement("th");
            let text = document.createTextNode(headers[index]);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    generateProjetsTableBody(table, data) {
        // Table body to table
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);

        // Data to table
        for (let element of data) {
            let row = tbody.insertRow();
            for (const key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }

    generateSkillList() {
        let skillCol = document.getElementById("skillCol");
        let ul = document.createElement("ul");
        ul.id = "skillList"
        for (let index = 0; index < this.props.skills.length; index++) {
            const element = this.props.skills[index];
            console.log(element);
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

    generateSkillLevelTable(table, data) {
        // Clear table before adding new content
        document.getElementById("skillLevelTbl").innerHTML = "";
        // Header
        let thead = table.createTHead();
        let headRow = thead.insertRow();
        let th = document.createElement("th");
        let headText = document.createTextNode("Skill level");
        th.appendChild(headText);
        headRow.appendChild(th);

        // Body
        let bodyRow = table.insertRow();
        let cell = bodyRow.insertCell();
        let bodyText = document.createTextNode(data);
        cell.appendChild(bodyText);
    }

    getProjects(skillId, skillName, skillLevel) {
        const projectsSettings = {
            url: 'https://localhost:5001/api/projects/' + skillId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        Axios(projectsSettings)
            .then((response) => {
                this.setState({
                    ProjectsVisible: false,
                })
                this.setState({
                    ProjectsVisible: true,
                    Projects: response.data,
                    SkillLevel: skillLevel,
                    SkillName: skillName
                })
                // let projectsTbl = document.getElementById("projectsTbl");
                // let skillLevelTbl = document.getElementById("skillLevelTbl");
                // console.log("Projects data");
                // console.log(response.data);
                // this.generateSkillLevelTable(skillLevelTbl, skillLevel);
                // this.generateProjetsTableHead(projectsTbl);
                // this.generateProjetsTableBody(projectsTbl, response.data);
            })
            .catch(error => {
                console.log("Projects error: " + error.data);
            })
    }

    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.icanPicUrl + ")",
            backgroundSize: "100% 100%"
        }

        // // Body for table
        // let tbody = [];
        // if (this.props.skills.length > 0) {
        //     for (let index = 0; index < this.props.skills.length; index++) {
        //         const element = this.props.skills[index];
        //         tbody.push(
        //             <tr key={element.skillId}>
        //                 <td>
        //                     <Button id="skillBtn" onClick={this.getProjects.bind(this, element.skillId, element.skillLevel)}>
        //                         {element.skill}
        //                     </Button>
        //                 </td>
        //             </tr>
        //         );
        //     }
        // }
        return (
            <section id="iCan" style={background}>
                <Container>
                    <Row>
                        <Col id="skillCol"></Col>
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