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
            SkillName: "",
            SkillLevel: 0,
            ProjectName: [],
            ProjectLink: [],
            ProjectDescription: []
        }
        this.addNewProject = this.addNewProject.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.skillsToDatabase = this.skillsToDatabase.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        // Add class
        inputName.className = "inputProjectName";
        inputLink.className = "inputProjectLink";
        textareaDescription.className = "textareaProjectDescription";
        // Launch handleValueChange when input change
        inputName.onchange = this.handleValueChange;
        inputLink.onchange = this.handleValueChange;
        textareaDescription.onchange = this.handleValueChange;
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

    clearForm() {
        document.getElementById("addProjects").innerHTML = "";
        document.getElementById("skillNameInput").value = "";
        document.getElementById("skillLevelInput").value = 0;
        this.setState({
            SkillName: "",
            SkillLevel: 0,
            ProjectName: [],
            ProjectLink: [],
            ProjectDescription: []
        });
    }

    skillsToDatabase() {
        let projectObj = "";
        let projectsArray = [];
        let nameInputs = document.getElementsByClassName("inputProjectName");
        let linkInputs = document.getElementsByClassName("inputProjectLink");
        let descriptionInputs = document.getElementsByClassName("textareaProjectDescription");
        for (let index = 0; index < nameInputs.length; index++) {
            projectObj = {
                Name: nameInputs[index].value,
                Link: linkInputs[index].value,
                Description: descriptionInputs[index].value
            };
            projectsArray.push(projectObj);
        }

        // Skill and projects to database
        // Object for requests
        const skillObj = {
            Skill: {
                SkillName: this.state.SkillName,
                SkillLevel: this.state.SkillLevel
            },
            Projects: projectsArray
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
            data: skillObj
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

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
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

            default:
                break;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.skillsToDatabase();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            Skill <br />
                            <input id="skillNameInput" type="text" onChange={this.handleValueChange} /><br />
                            Skill level <br />
                            <input id="skillLevelInput" type="range" min="0" max="100" step="1" defaultValue="0" onChange={this.handleValueChange} /><span> {this.state.SkillLevel} %</span><br />
                            <div id="addProjects"></div>
                            <Button type="button" onClick={this.addNewProject}>Add project</Button><br />
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
            Punchline: "",
            BasicKnowledge: "",
            Education: "",
            WorkHistory: "",
            LanguageSkills: ""
        }
        this.addNewSocialMediaService = this.addNewSocialMediaService.bind(this);
        this.contentToDatabase = this.contentToDatabase.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    addNewSocialMediaService() {
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
            BasicInfoBool: true,
            SkillsBool: false,
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
        if (btnId === "basicInfo") {
            this.setState({
                BasicInfoBool: true,
                SkillsBool: false,
                PicturesBool: false
            });
        } else if (btnId === "skills") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: true,
                PicturesBool: false
            });
        } else if (btnId === "pictures") {
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
                                <li><button id="basicInfo" onClick={this.handleNavClick}>Basic Info</button></li>
                                <li><button id="skills" onClick={this.handleNavClick}>Skills</button></li>
                                <li><button id="pictures" onClick={this.handleNavClick}>Pictures</button></li>
                            </ul>
                        </Col>
                    </Row>
                    <Fragment>
                        {/* InfoEdit */}
                        {this.state.BasicInfoBool ?
                            <InfoEdit
                                userId={this.state.Profile.nameid}
                                content={this.state.Content}
                                emails={this.state.Emails}
                            /> : null}
                        {/* SkillsEdit */}
                        {this.state.SkillsBool ?
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