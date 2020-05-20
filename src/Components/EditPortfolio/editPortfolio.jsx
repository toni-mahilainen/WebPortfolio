import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AuthService from '../LoginHandle/AuthService';
import Axios from 'axios';

class PictureEdit extends Component {
    constructor() {
        super();
        this.state = {
            ProfilePicUrl: "",
            HomePicUrl: "",
            IamPicUrl: "",
            IcanPicUrl: "",
            QuestbookPicUrl: "",
            ContactPicUrl: "",
            CreateSpaceResponseArray: [],
            SendPicsResponseArray: [],
            PicObjArray: []
        }
        this.checkStatus = this.checkStatus.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAzureStorage = this.handleAzureStorage.bind(this);
        this.createSpaceForPictures = this.createSpaceForPictures.bind(this);
        this.imageUrlsToDatabase = this.imageUrlsToDatabase.bind(this);
        this.sendPicturesToAzure = this.sendPicturesToAzure.bind(this);
    }

    // Checks status of all responses
    checkStatus(response) {
        return response >= 200 && response < 300;
    };

    // Clears file inputs after completed request
    clearInputs() {
        let inputs = document.getElementsByClassName("fileInput");
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            element.value = "";
        }
    }

    // Creates spaces to Azure for files
    async createSpaceForPictures() {
        let picArray = this.state.PicObjArray;
        let spaceResponseArray = [];
        // Loops as many time as pic count points
        for (let index = 0; index < picArray.length; index++) {
            // Variables for URI and request
            let userId = this.props.userId;
            let sasToken = "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
            let fileSize = picArray[index].FileSize;
            let filename = picArray[index].Filename;
            let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename + sasToken;

            // Settings for axios requests
            const settings = {
                url: uri,
                method: 'PUT',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    "x-ms-content-length": fileSize,
                    "x-ms-file-attributes": "None",
                    "x-ms-file-creation-time": "now",
                    "x-ms-file-last-write-time": "now",
                    "x-ms-file-permission": "inherit",
                    "x-ms-type": "file"
                }
            }

            // Request
            await Axios(settings)
                .then(response => {
                    spaceResponseArray.push(response.status);
                })
                .catch(err => {
                    spaceResponseArray.push(err.status);
                })
        }

        // Status of responses to state variable
        this.setState({
            CreateSpaceResponseArray: spaceResponseArray
        });
    }

    // Creates new folder to Azure which is named with user ID and calls other nessecery functions needed to add images to Azure File Storage
    async handleAzureStorage() {
        // Variables for URI
        let userId = this.props.userId;
        let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "?restype=directory&" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'PUT',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "x-ms-date": "now",
                "x-ms-version": "2017-07-29"
            }
        };

        // Create folder request
        await Axios(settings);

        // Other Azure functions
        await this.sendPicturesToAzure();

        // If every responses has succeeded - "Images added succesfully!" -alert will be showed
        if (this.state.CreateSpaceResponseArray.every(this.checkStatus) && this.state.SendPicsResponseArray.every(this.checkStatus)) {
            alert("Images added succesfully!");
            this.clearInputs();
        } else {
            alert("Problems!");
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.imageUrlsToDatabase();
        this.handleAzureStorage();
    }

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;
        // Save file and filename (without blanks) to variable
        let file = document.getElementById(inputId).files[0];
        let filename = file.name.replace(" ", "");
        let fileSize = file.size;
        // Convert a file to file-like object (raw data)
        let blob = new Blob([file].slice(0, fileSize));
        // User ID
        let userId = this.props.userId;
        // New instance of FileReader
        let reader = new FileReader();
        // Url for image
        let imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;

        // Read content of a blob and depending the input, set it and image url to right state variables
        reader.readAsArrayBuffer(blob);

        let newPicObjArray = this.state.PicObjArray.slice();

        switch (inputId) {
            case "profilePicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        // Create an object and set it to the object array state variable
                        let profilePicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(profilePicObj);
                        this.setState({
                            ProfilePicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            case "homePicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let homePicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(homePicObj);
                        this.setState({
                            HomePicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            case "iamPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let iamPicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(iamPicObj);
                        this.setState({
                            IamPicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            case "icanPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let icanPicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(icanPicObj);
                        this.setState({
                            IcanPicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            case "questbookPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let questbookPicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(questbookPicObj);
                        this.setState({
                            QuestbookPicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            case "contactPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let contactPicObj = {
                            Filename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        newPicObjArray.push(contactPicObj);
                        this.setState({
                            ContactPicUrl: imageUrl,
                            PicObjArray: newPicObjArray
                        });
                    };
                }
                break;

            default:
                break;
        }
    }

    // Sends URLs for images to database
    imageUrlsToDatabase() {
        // Create an object for request
        const imageObj = {
            Profile: [{
                TypeID: 1,
                Url: this.state.ProfilePicUrl
            }],
            Home: [{
                TypeID: 2,
                Url: this.state.HomePicUrl
            }],
            Iam: [{
                TypeID: 3,
                Url: this.state.IamPicUrl
            }],
            Ican: [{
                TypeID: 4,
                Url: this.state.IcanPicUrl
            }],
            Questbook: [{
                TypeID: 5,
                Url: this.state.QuestbookPicUrl
            }],
            Contact: [{
                TypeID: 6,
                Url: this.state.ContactPicUrl
            }]
        }

        // Settings for axios requests
        let userId = this.props.userId;
        const settings = {
            url: 'https://localhost:5001/api/images/' + userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: imageObj
        };

        Axios(settings)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log("Save URLs: " + response.data);
                } else {
                    console.log("Save URLs error: " + response.data);
                }
            })
    }

    // Sends pictures to Azure
    async sendPicturesToAzure() {
        // First call the function to create free spaces to the files
        await this.createSpaceForPictures();
        let picArray = this.state.PicObjArray;
        let sendPicsResponseArray = [];
        // Loops as many time as pic count points
        for (let index = 0; index < picArray.length; index++) {
            // Variables for URI and request
            let userId = this.props.userId;
            let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
            let filename = picArray[index].Filename;
            let rangeMaxSize = picArray[index].FileSize - 1;
            let picData = picArray[index].BinaryString;
            let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename + "?comp=range&" + sasToken;

            // Settings for axios requests
            const settings = {
                url: uri,
                method: 'PUT',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "x-ms-file-attributes": "None",
                    "x-ms-file-creation-time": "now",
                    "x-ms-file-last-write-time": "now",
                    "x-ms-file-permission": "inherit",
                    "x-ms-range": "bytes=0-" + rangeMaxSize,
                    "x-ms-write": "update"
                },
                data: picData
            }

            // Request
            await Axios(settings)
                .then(response => {
                    sendPicsResponseArray.push(response.status);
                })
                .catch(err => {
                    sendPicsResponseArray.push(err.status);
                })
        }

        // Status of responses to state variable
        this.setState({
            SendPicsResponseArray: sendPicsResponseArray
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Pictures</h4>
                        <form onSubmit={this.handleSubmit}>
                            Profile <br />
                            <input className="fileInput" id="profilePicInput" type="file" onChange={this.handleValueChange} /><br />
                            Home background <br />
                            <input className="fileInput" id="homePicInput" type="file" onChange={this.handleValueChange} /><br />
                            I am background <br />
                            <input className="fileInput" id="iamPicInput" type="file" onChange={this.handleValueChange} /><br />
                            I can background <br />
                            <input className="fileInput" id="icanPicInput" type="file" onChange={this.handleValueChange} /><br />
                            Questbook background <br />
                            <input className="fileInput" id="questbookPicInput" type="file" onChange={this.handleValueChange} /><br />
                            Contact background <br />
                            <input className="fileInput" id="contactPicInput" type="file" onChange={this.handleValueChange} /><br />
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
            Number: -1
        }
        this.addNewProject = this.addNewProject.bind(this);
        this.addNewSkill = this.addNewSkill.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.generateNumber = this.generateNumber.bind(this);
        this.addExistingSkillsAndProjects = this.addExistingSkillsAndProjects.bind(this);
        this.skillsAndProjectsToDatabase = this.skillsAndProjectsToDatabase.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showProjects = this.showProjects.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.addExistingSkillsAndProjects();
        }
    }

    addExistingSkillsAndProjects() {
        // Social media selects/link inputs with values
        for (let index = 0; index < this.props.skills.length; index++) {
            const element = this.props.skills[index];
            this.addNewSkill(element.skillId, element.skill, element.skillLevel, [index])
            this.setState({
                Number: index
            });
        }
    }

    addNewProject(projects, number) {
        console.log(projects.projectId);
        let addProjectsDiv = ""
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
        let spanProjectId = document.createElement("span");
        let inputName = document.createElement("input");
        let inputLink = document.createElement("input");
        let textareaDescription = document.createElement("textarea");
        if (projects !== undefined && number !== undefined) {           // If user clicks a "Show projects" button
            // div
            addProjectsDiv = document.getElementById("projects" + number);
            // Add class
            inputName.className = "inputProjectName" + number;
            inputLink.className = "inputProjectLink" + number;
            textareaDescription.className = "textareaProjectDescription" + number;
            spanProjectId.id = "spanProjectId" + number;
            spanProjectId.setAttribute("hidden", "hidden");
            spanProjectId.setAttribute("value", projects.projectId);
            // Add values
            inputName.value = projects.name;
            inputLink.value = projects.link;
            textareaDescription.value = projects.description;
            addProjectsDiv.appendChild(spanProjectId);
        } else if (projects === undefined && number !== undefined) {    // If user clicks a "Add a project" button below an existing skill
            // div
            addProjectsDiv = document.getElementById("projects" + number);
            // Add class
            inputName.className = "inputProjectName" + number;
            inputLink.className = "inputProjectLink" + number;
            textareaDescription.className = "textareaProjectDescription" + number;
            // Add values
            inputName.value = "";
            inputLink.value = "";
            textareaDescription.value = "";
        } else {                                                        // If user clicks a "Add a project" when adding a new skill
            // div
            addProjectsDiv = document.getElementById("projects" + this.state.Number);
            // Add class
            inputName.className = "inputProjectName" + this.state.Number;
            inputLink.className = "inputProjectLink" + this.state.Number;
            textareaDescription.className = "textareaProjectDescription" + this.state.Number;
            // Add values
            inputName.value = "";
            inputLink.value = "";
            textareaDescription.value = "";
        }
        // Append
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

    async addNewSkill(skillId, skill, skillLevel, number) {
        await this.generateNumber();
        // Skills and project div
        let skillsAndProjectsDiv = document.getElementById("skillsAndProjects");
        // div
        let addSkillsDiv = document.createElement("div");
        let addProjectsDiv = document.createElement("div");
        // br
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        let br5 = document.createElement("br");
        let br6 = document.createElement("br");
        // textnode
        let textNodeSkill = document.createTextNode("Skill");
        let textNodeSkillLevel = document.createTextNode("Skill level");
        let textNodeAddProject = document.createTextNode("Add a project");
        let textNodeShowProjects = document.createTextNode("Show projects");
        let textNodePercent = document.createTextNode(" %");
        // input
        let inputSkill = document.createElement("input");
        let inputSkillLevel = document.createElement("input");
        // span
        let span = document.createElement("span");
        // Attributes
        inputSkill.setAttribute("type", "text");
        inputSkillLevel.setAttribute("type", "range");
        inputSkillLevel.setAttribute("min", "0");
        inputSkillLevel.setAttribute("max", "100");
        inputSkillLevel.setAttribute("step", "1");
        inputSkillLevel.setAttribute("value", "0");
        // If user already have skills and projects, parameters sets the values and different button will be showed
        if (skill !== undefined && skillLevel !== undefined) {
            let projects = undefined;
            // Add class/id
            addSkillsDiv.id = "skills" + number;
            addProjectsDiv.id = "projects" + number;
            inputSkill.id = "inputSkill" + number;
            inputSkill.className = "skill";
            inputSkillLevel.id = "inputSkillLevel" + number;
            // Button
            let showProjectButton = document.createElement("button");
            let addProjectButton = document.createElement("button");
            showProjectButton.className = "btn btn-primary";
            addProjectButton.className = "btn btn-primary";
            showProjectButton.id = "showProjectsBtn" + number;
            showProjectButton.setAttribute("type", "button");
            addProjectButton.setAttribute("type", "button");
            // Values of inputs
            inputSkill.value = skill;
            inputSkillLevel.value = skillLevel;
            // OnClick to button
            showProjectButton.onclick = () => { this.getProjects(skillId, number); }
            addProjectButton.onclick = () => { this.addNewProject(projects, number); }
            // Append text to button
            showProjectButton.appendChild(textNodeShowProjects)
            addProjectButton.appendChild(textNodeAddProject)
            // Append to span
            span.appendChild(textNodePercent)
            // Append to div
            addSkillsDiv.appendChild(textNodeSkill);
            addSkillsDiv.appendChild(br1);
            addSkillsDiv.appendChild(inputSkill);
            addSkillsDiv.appendChild(br2);
            addSkillsDiv.appendChild(textNodeSkillLevel);
            addSkillsDiv.appendChild(br3);
            addSkillsDiv.appendChild(inputSkillLevel);
            addSkillsDiv.appendChild(span);
            addSkillsDiv.appendChild(br4);
            addSkillsDiv.appendChild(addProjectsDiv);
            addSkillsDiv.appendChild(addProjectButton);
            addSkillsDiv.appendChild(showProjectButton);
        } else {
            let projects = undefined;
            // Add class/id
            addSkillsDiv.id = "skills" + this.state.Number;
            addProjectsDiv.id = "projects" + this.state.Number;
            inputSkill.id = "inputSkill" + this.state.Number;
            inputSkill.className = "skill";
            inputSkillLevel.id = "inputSkillLevel" + this.state.Number;
            // Button
            let addProjectButton = document.createElement("button");
            addProjectButton.className = "btn btn-primary";
            addProjectButton.setAttribute("type", "button");
            // Values of inputs
            inputSkill.value = "";
            inputSkillLevel.value = 0;
            // OnClick to button
            addProjectButton.onclick = () => { this.addNewProject(projects); }
            // Append text to button
            addProjectButton.appendChild(textNodeAddProject)
            // Append to span
            span.appendChild(textNodePercent)
            // Append to div
            addSkillsDiv.appendChild(textNodeSkill);
            addSkillsDiv.appendChild(br1);
            addSkillsDiv.appendChild(inputSkill);
            addSkillsDiv.appendChild(br2);
            addSkillsDiv.appendChild(textNodeSkillLevel);
            addSkillsDiv.appendChild(br3);
            addSkillsDiv.appendChild(inputSkillLevel);
            addSkillsDiv.appendChild(span);
            addSkillsDiv.appendChild(br4);
            addSkillsDiv.appendChild(addProjectsDiv);
            addSkillsDiv.appendChild(addProjectButton);
        }
        // Append to div
        addSkillsDiv.appendChild(br5);
        addSkillsDiv.appendChild(br6);
        skillsAndProjectsDiv.appendChild(addSkillsDiv);
    }

    clearForm() {
        document.getElementById("skillsAndProjects").innerHTML = "";
    }

    generateNumber() {
        let number = this.state.Number + 1
        this.setState({
            Number: number
        });
    }

    getProjects(skillId, number) {
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
                this.showProjects(response.data, number)
            })
            .catch(error => {
                console.log("Projects error: " + error.data);
            })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.skillsAndProjectsToDatabase();
    }

    showProjects(projects, number) {
        for (let index = 0; index < projects.length; index++) {


            const element = projects[index];
            this.addNewProject(element, number)
        }
    }

    skillsAndProjectsToDatabase() {
        let skillArray = [];
        // Count of skills
        let skillInputs = document.getElementsByClassName("skill");
        // All skills with projects to array
        for (let index = 0; index < skillInputs.length; index++) {
            let skillsObj = "";
            let projectObj = "";
            let projectsArray = [];
            // Right inputs with index number
            let skillNameInput = document.getElementById("inputSkill" + [index]);
            let skillLevelInput = document.getElementById("inputSkillLevel" + [index]);
            let nameInputs = document.getElementsByClassName("inputProjectName" + [index]);
            let linkInputs = document.getElementsByClassName("inputProjectLink" + [index]);
            let descriptionInputs = document.getElementsByClassName("textareaProjectDescription" + [index]);

            // All projects for the skill
            for (let index = 0; index < nameInputs.length; index++) {
                projectObj = {
                    Name: nameInputs[index].value,
                    Link: linkInputs[index].value,
                    Description: descriptionInputs[index].value
                };
                projectsArray.push(projectObj);
            }
            // Skill name, level and projects to object
            skillsObj = {
                Skill: skillNameInput.value,
                SkillLevel: skillLevelInput.value,
                Projects: projectsArray
            }

            // Object to array
            skillArray.push(skillsObj);
        }

        // Skills and projects to database
        // Object for requests
        const skillsObj = {
            Skills: skillArray
        }

        // Settings for axios requests
        let userId = this.props.userId;

        const settings = {
            url: 'https://localhost:5001/api/skills/' + userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: skillsObj
        };

        // Requests
        const skillPost = Axios(settings);

        Promise.all([skillPost])
            .then((responses) => {
                if (responses[0].status >= 200 && responses[0].status < 300) {
                    alert("Skill/Projects added succesfully!")
                    this.clearForm();
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
                            <div id="skillsAndProjects"></div>
                            <Button type="button" onClick={this.addNewSkill}>Add a skill</Button><br />
                            <br />
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
    constructor(props) {
        super(props);
        this.state = {
            Firstname: "",
            Lastname: "",
            DateOfBirth: "",
            City: "",
            Country: "",
            Phonenumber: "",
            Emails: [],
            Punchline: "",
            BasicKnowledge: "",
            Education: "",
            WorkHistory: "",
            LanguageSkills: ""
        }
        this.addNewSocialMediaService = this.addNewSocialMediaService.bind(this);
        this.addValuesToInputs = this.addValuesToInputs.bind(this);
        this.contentToDatabase = this.contentToDatabase.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.addValuesToInputs();
        }
    }

    convertToDate(date) {
        // Convert datetime to a date format which is correct to date input field
        let birthdate = new Date(date);
        let splitted = birthdate.toISOString().split("T")

        return splitted[0];
    }

    addValuesToInputs() {
        // Value to basic inputs
        document.getElementById("firstnameInput").value = this.props.content.firstname
        document.getElementById("lastnameInput").value = this.props.content.lastname
        document.getElementById("birthdateInput").value = this.convertToDate(this.props.content.birthdate)
        document.getElementById("cityInput").value = this.props.content.city
        document.getElementById("countryInput").value = this.props.content.country
        document.getElementById("phoneInput").value = this.props.content.phonenumber
        document.getElementById("email1Input").value = this.props.emails[0]
        document.getElementById("email2Input").value = this.props.emails[1]
        document.getElementById("punchlineInput").value = this.props.content.punchline
        document.getElementById("basicInput").value = this.props.content.basicKnowledge
        document.getElementById("educationInput").value = this.props.content.education
        document.getElementById("workHistoryInput").value = this.props.content.workHistory
        document.getElementById("languageinput").value = this.props.content.languageSkills

        // Social media selects/link inputs with values
        for (let index = 0; index < this.props.links.length; index++) {
            const element = this.props.links[index];
            this.addNewSocialMediaService(element.serviceId, element.link)
        }
    }

    addNewSocialMediaService(serviceId, link) {
        // div
        let addSocialMediaServicesDiv = document.getElementById("addServices");
        // br
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        // textnode
        let textNodeService = document.createTextNode("Service");
        let textNodeServiceLink = document.createTextNode("Service link");
        // select
        let serviceSelect = document.createElement("select");
        // option
        let optionFacebook = document.createElement("option");
        let optionInstagram = document.createElement("option");
        let optionTwitter = document.createElement("option");
        let optionGithub = document.createElement("option");
        let optionYoutube = document.createElement("option");
        let optionLinkedin = document.createElement("option");
        // add label to option
        optionFacebook.setAttribute("label", "Facebook");
        optionInstagram.setAttribute("label", "Instagram");
        optionTwitter.setAttribute("label", "Twitter");
        optionGithub.setAttribute("label", "GitHub");
        optionYoutube.setAttribute("label", "Youtube");
        optionLinkedin.setAttribute("label", "LinkedIn");
        // add value to option
        optionFacebook.setAttribute("value", "1");
        optionInstagram.setAttribute("value", "2");
        optionTwitter.setAttribute("value", "3");
        optionGithub.setAttribute("value", "4");
        optionYoutube.setAttribute("value", "5");
        optionLinkedin.setAttribute("value", "6");
        // append options to select
        serviceSelect.appendChild(optionFacebook);
        serviceSelect.appendChild(optionInstagram);
        serviceSelect.appendChild(optionTwitter);
        serviceSelect.appendChild(optionGithub);
        serviceSelect.appendChild(optionYoutube);
        serviceSelect.appendChild(optionLinkedin);
        // input
        let inputServiceLink = document.createElement("input");
        // Add classes
        serviceSelect.className = "socialMediaSelect";
        inputServiceLink.className = "socialMedia1Input";
        // If user already have links to social media, parameters sets the values
        if (serviceId !== undefined && link !== undefined) {
            serviceSelect.value = serviceId;
            inputServiceLink.value = link;
        } else {
            serviceSelect.value = 1;
            inputServiceLink.value = "";
        }
        // Append
        addSocialMediaServicesDiv.appendChild(textNodeService);
        addSocialMediaServicesDiv.appendChild(br1);
        addSocialMediaServicesDiv.appendChild(serviceSelect);
        addSocialMediaServicesDiv.appendChild(br2);
        addSocialMediaServicesDiv.appendChild(textNodeServiceLink);
        addSocialMediaServicesDiv.appendChild(br3);
        addSocialMediaServicesDiv.appendChild(inputServiceLink);
        addSocialMediaServicesDiv.appendChild(br4);
    }

    handleValueChange(input) {
        // Depending on input field, the right state will be updated
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

            default:
                break;
        }
    }

    contentToDatabase() {
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
        };

        // All added links to social media services to array
        let servicesObj = "";
        let servicesArray = [];
        let servicesSelects = document.getElementsByClassName("socialMediaSelect");
        let serviceLinkInputs = document.getElementsByClassName("socialMedia1Input");
        for (let index = 0; index < servicesSelects.length; index++) {
            servicesObj = {
                ServiceId: servicesSelects[index].value,
                Link: serviceLinkInputs[index].value
            };
            servicesArray.push(servicesObj);
        };

        // Settings for axios requests
        let userId = this.props.userId;

        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: contentObj
        };

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: {
                Services: servicesArray
            }
        };

        // Requests
        const contentPost = Axios(contentSettings);
        const socialMediaPost = Axios(socialMediaSettings);

        Promise.all([contentPost, socialMediaPost])
            .then((responses) => {
                if ((responses[0].status && responses[1].status) >= 200 && (responses[0].status && responses[1].status) < 300) {
                    alert("Content added succesfully!");
                } else {
                    console.log(responses[0].data);
                    console.log(responses[1].data);
                    alert("Problems!!");
                }
            });
    }

    handleSubmit() {
        this.contentToDatabase();
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
                            Social media services <br />
                            <div id="addServices"></div>
                            <Button type="button" onClick={this.addNewSocialMediaService}>Add social media service</Button><br />
                            <br />
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
            Profile: "",
            BasicInfoBool: false,
            SkillsBool: true,
            PicturesBool: false,
            Content: "",
            Emails: "",
            Skills: "",
            SocialMediaLinks: "",
            ProfilePicUrl: "",
            HomePicUrl: "",
            IamPicUrl: "",
            IcanPicUrl: "",
            QuestbookPicUrl: "",
            ContactPicUrl: ""
        };
        this.getContent = this.getContent.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // re-position a footer
        let footer = document.getElementById("footer");
        if (!footer.classList.contains("absolute")) {
            footer.className = "absolute";
        }

        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() !== null) {
            this.setState({
                Profile: this.Auth.getProfile()
            });
        } else {
            this.setState({
                Profile: this.Auth.getProfile()
            }, this.getContent);
        }
    }

    // Build url for state of image depending on type ID
    updateImageStates(data) {
        let sasToken = "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        for (let index = 0; index < data.length; index++) {
            let typeId = data[index].typeId;
            switch (typeId) {
                case 1:
                    this.setState({
                        ProfilePicUrl: data[index].url + sasToken
                    })
                    break;

                case 2:
                    this.setState({
                        HomePicUrl: data[index].url + sasToken
                    })
                    break;

                case 3:
                    this.setState({
                        IamPicUrl: data[index].url + sasToken
                    })
                    break;

                case 4:
                    this.setState({
                        IcanPicUrl: data[index].url + sasToken
                    })
                    break;

                case 5:
                    this.setState({
                        QuestbookPicUrl: data[index].url + sasToken
                    })
                    break;

                case 6:
                    this.setState({
                        ContactPicUrl: data[index].url + sasToken
                    })
                    break;

                default:
                    break;
            }

        }
    }

    // Get all content for edit forms
    getContent() {
        // Settings for requests
        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const emailSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/emails/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const skillsSettings = {
            url: 'https://localhost:5001/api/skills/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const questbookSettings = {
            url: 'https://localhost:5001/api/questbook/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const imagesSettings = {
            url: 'https://localhost:5001/api/images/' + this.state.Profile.nameid,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        // Requests
        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);
        const skillsGet = Axios(skillsSettings);
        const questbookGet = Axios(questbookSettings);
        const socialMediaGet = Axios(socialMediaSettings);
        const imagesGet = Axios(imagesSettings);

        // Promises
        Promise.all([contentGet, emailGet, skillsGet, questbookGet, socialMediaGet, imagesGet])
            .then((responses) => {
                this.updateImageStates(responses[5].data);
                this.setState({
                    Content: responses[0].data[0],
                    Emails: responses[1].data,
                    Skills: responses[2].data,
                    QuestbookMessages: responses[3].data,
                    SocialMediaLinks: responses[4].data
                });
            })
            .catch(errors => {
                console.log("Content error: " + errors[0]);
                console.log("Email error: " + errors[1]);
                console.log("Skills error: " + errors[2]);
                console.log("Questbook error: " + errors[3]);
                console.log("Social media error: " + errors[4]);
            })
    }

    // Controls which form (info/skills/pictures) will rendered
    handleNavClick(btn) {
        let btnId = btn.target.id;
        if (btnId === "basicInfoNavBtn") {
            this.setState({
                BasicInfoBool: true,
                SkillsBool: false,
                PicturesBool: false
            });
        } else if (btnId === "skillsNavBtn") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: true,
                PicturesBool: false
            });
        } else if (btnId === "picturesNavBtn") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: false,
                PicturesBool: true
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
                                <li><button id="basicInfoNavBtn" onClick={this.handleNavClick}>Basic Info</button></li>
                                <li><button id="skillsNavBtn" onClick={this.handleNavClick}>Skills</button></li>
                                <li><button id="picturesNavBtn" onClick={this.handleNavClick}>Pictures</button></li>
                            </ul>
                        </Col>
                    </Row>
                    <Fragment>
                        {/* InfoEdit */}
                        {this.state.BasicInfoBool && this.state.Content && this.state.SocialMediaLinks ?
                            <InfoEdit
                                userId={this.state.Profile.nameid}
                                content={this.state.Content}
                                emails={this.state.Emails}
                                links={this.state.SocialMediaLinks}
                            /> : null}
                        {/* SkillsEdit */}
                        {this.state.SkillsBool && this.state.Skills ?
                            <SkillsEdit
                                userId={this.state.Profile.nameid}
                                skills={this.state.Skills}
                            /> : null}
                        {/* PictureEdit */}
                        {this.state.PicturesBool ?
                            <PictureEdit
                                userId={this.state.Profile.nameid}
                                homePicUrl={this.state.HomePicUrl}
                                profilePicUrl={this.state.ProfilePicUrl}
                                iamPicUrl={this.state.IamPicUrl}
                                icanPicUrl={this.state.IcanPicUrl}
                                questbookPicUrl={this.state.QuestbookPicUrl}
                                contactPicUrl={this.state.ContactPicUrl}
                            /> : null}
                    </Fragment>
                </Container>
            </main>
        );
    }
}

export default EditPortfolio;