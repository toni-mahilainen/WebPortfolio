import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
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
            ProfilePicObj: {
                Filename: "",
                FileSize: 0,
                BinaryString: ""
            },
            ProfilePicBinary: "",
            HomePicBinary: "",
            IamPicBinary: "",
            IcanPicBinary: "",
            QuestbookPicBinary: "",
            ContactPicBinary: ""
        }

        // this.extractFilename = this.extractFilename.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAzureStorage = this.handleAzureStorage.bind(this);
        this.createSpaceForPictures = this.createSpaceForPictures.bind(this);
        this.imageUrlsToDatabase = this.imageUrlsToDatabase.bind(this);
        this.sendPicturesToAzure = this.sendPicturesToAzure.bind(this);
    }

    // // Extracts a filename from the path
    // extractFilename(path) {
    //     if (path.substr(0, 12) === "C:\\fakepath\\")
    //         return path.substr(12); // modern browser
    //     let x;
    //     x = path.lastIndexOf('/');
    //     if (x >= 0) // Unix-based path
    //         return path.substr(x + 1);
    //     x = path.lastIndexOf('\\');
    //     if (x >= 0) // Windows-based path
    //         return path.substr(x + 1);
    //     return path; // just the file name
    // }

    createSpaceForPictures() {
        console.log("createSpaceForPictures");
        let userId = "17";
        let sasToken = "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let fileSize = this.state.ProfilePicObj.FileSize;
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + this.state.ProfilePicObj.Filename + sasToken;

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

        Axios(settings)
            .then((responses) => {
                if (responses.status >= 200 && responses.status < 300) {
                    // console.log("Create dir: " + responses.data);
                    console.log("Create space: " + responses.data);
                    // console.log("Save pictures: " + responses[2].data);
                } else {
                    // console.log("Create dir error: " + responses.data);
                    console.log("Create space error: " + responses.data);
                    // console.log("Save pictures error: " + responses[2].data);
                }
            })


    }

    handleAzureStorage() {
        console.log("handleAzureStorage");
        // Creates new folder to Azure which is named with user ID
        let userId = "17";
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

        Axios(settings)
            .then((responses) => {
                if (responses.status >= 200 && responses.status < 300) {
                    console.log("Create dir: " + responses.data);
                    // console.log("Create space: " + responses[1].data);
                    // console.log("Save pictures: " + responses[2].data);
                } else {
                    console.log("Create dir error: " + responses.data);
                    // console.log("Create space error: " + responses[1].data);
                    // console.log("Save pictures error: " + responses[2].data);
                }
            })

        // Promise.all([createDirPut])
        // .then((responses) => {
        //     if (responses.status >= 200 && responses.status < 300) {
        //         console.log("Create dir: " + responses[0].data);
        //         // console.log("Create space: " + responses[1].data);
        //         // console.log("Save pictures: " + responses[2].data);
        //     } else {
        //         console.log("Create dir error: " + responses[0].data);
        //         // console.log("Create space error: " + responses[1].data);
        //         // console.log("Save pictures error: " + responses[2].data);
        //     }
        // })
    }

    handleSubmit(event) {
        console.log("handleSubmit");
        // this.imageUrlsToDatabase();
        // this.handleAzureStorage();
        // this.createSpaceForPictures();
        this.sendPicturesToAzure();
        // prevent a browser reload/refresh
        event.preventDefault();
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
        // User ID kirjautumisen mukaan
        let userId = "17";
        // New instance of FileReader
        let reader = new FileReader();
        // Url for image
        let imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;

        // Read content of a blob and depending the input, set it and image url to right state variables
        reader.readAsArrayBuffer(blob);

        switch (inputId) {
            case "profilePicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            ProfilePicUrl: imageUrl,
                            ProfilePicObj: {
                                Filename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            }
                        });
                    };
                }
                break;

            case "homePicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            HomePicUrl: imageUrl,
                            HomePicBinary: evt.target.result
                        });
                    };
                }
                break;

            case "iamPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            IamPicUrl: imageUrl,
                            IamPicBinary: evt.target.result
                        });
                    };
                }
                break;

            case "icanPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            IcanPicUrl: imageUrl,
                            IcanPicBinary: evt.target.result
                        });
                    };
                }
                break;

            case "questbookPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            QuestbookPicUrl: imageUrl,
                            QuestbookPicBinary: evt.target.result
                        });
                    };
                }
                break;

            case "contactPicInput":
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        this.setState({
                            ContactPicUrl: imageUrl,
                            ContactPicBinary: evt.target.result
                        });
                    };
                }
                break;

            default:
                break;
        }
    }

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
        const settings = {
            url: 'https://localhost:5001/api/images/17',
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

    sendPicturesToAzure() {
        console.log("sendPicturesToAzure");
        let userId = "17";
        let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let rangefileSize = this.state.ProfilePicObj.FileSize - 1;
        let picData = this.state.ProfilePicObj.BinaryString;
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + this.state.ProfilePicObj.Filename + "?comp=range&" + sasToken;
        
        const settings = {
            url: uri,
            method: 'PUT',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "x-ms-file-attributes": "None",
                "x-ms-file-creation-time": "now",
                "x-ms-file-last-write-time": "now",
                "x-ms-file-permission": "inherit",
                "x-ms-range": "bytes=0-" + rangefileSize,
                "x-ms-write": "update"
            },
            data: picData
        }

        Axios(settings)
            .then((responses) => {
                if (responses.status >= 200 && responses.status < 300) {
                    // console.log("Create dir: " + responses.data);
                    // console.log("Create space: " + responses.data);
                    console.log("Save pictures: " + responses.status);
                } else {
                    // console.log("Create dir error: " + responses.data);
                    // console.log("Create space error: " + responses.data);
                    console.log("Save pictures error: " + responses.status);
                }
            })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Pictures</h4>
                        <form onSubmit={this.handleSubmit}>
                            Profile <br />
                            <input id="profilePicInput" type="file" onChange={this.handleValueChange} /><br />
                            Home background <br />
                            <input id="homePicInput" type="file" onChange={this.handleValueChange} /><br />
                            I am background <br />
                            <input id="iamPicInput" type="file" onChange={this.handleValueChange} /><br />
                            I can background <br />
                            <input id="icanPicInput" type="file" onChange={this.handleValueChange} /><br />
                            Questbook background <br />
                            <input id="questbookPicInput" type="file" onChange={this.handleValueChange} /><br />
                            Contact background <br />
                            <input id="contactPicInput" type="file" onChange={this.handleValueChange} /><br />
                            <Button type="submit">Save changes</Button>
                        </form>
                    </Col>
                    <Col>
                        <img src="https://webportfolio.file.core.windows.net/images/17/PROFIILI.png" alt=""/>
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
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.generateNumber = this.generateNumber.bind(this);
    }

    // generateNumber() {
    //     let inputs = document.getElementsByClassName("inputProjectName");
    //     let number = parseInt(inputs.length)
    //     return number;
    // }

    addNewProject() {
        // // Generate a number to inputs id
        // let number = this.generateNumber() + 1;
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
        // // Add id with number
        // inputName.id = "inputProjectName" + number;
        // inputLink.id = "inputProjectLink" + number;
        // textareaDescription.id = "textareaProjectDescription" + number;
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

    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputClassnName = input.target.className;

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

            default:
                break;
        }
    }

    handleSubmit() {
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
                            <input className="skillLevelInput" type="range" min="0" max="100" step="1" defaultValue="0" onChange={this.handleValueChange} /><span> {this.state.SkillLevel} %</span><br />
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
        this.addNewSocialMediaService = this.addNewSocialMediaService.bind(this);
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
        };

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
            Skills: "",
            Pictures: true
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