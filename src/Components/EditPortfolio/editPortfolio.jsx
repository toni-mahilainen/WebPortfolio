import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import AuthService from '../LoginHandle/AuthService';
import Axios from 'axios';
import md5 from 'md5';

class PictureEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProfilePicObj: null,
            HomePicObj: null,
            IamPicObj: null,
            IcanPicObj: null,
            QuestbookPicObj: null,
            ContactPicObj: null,
            ProfilePicUrl: props.profilePicUrl,
            HomePicUrl: props.homePicUrl,
            IamPicUrl: props.iamPicUrl,
            IcanPicUrl: props.icanPicUrl,
            QuestbookPicUrl: props.questbookPicUrl,
            ContactPicUrl: props.contactPicUrl,
            CurrentProfilePic: "",
            CurrentHomePic: "",
            CurrentIamPic: "",
            CurrentIcanPic: "",
            CurrentQuestbookPic: "",
            CurrentContactPic: "",
            CreateSpaceResponseArray: [],
            SendPicsResponseArray: [],
            DeletePicsResponseArray: [],
            PicObjArray: []
        }
        this.checkStatus = this.checkStatus.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.deletePicturesFromAzure = this.deletePicturesFromAzure.bind(this);
        this.getPictureNames = this.getPictureNames.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAzureStorage = this.handleAzureStorage.bind(this);
        this.createSpaceForPictures = this.createSpaceForPictures.bind(this);
        this.imageUrlsToDatabase = this.imageUrlsToDatabase.bind(this);
        this.sendPicturesToAzure = this.sendPicturesToAzure.bind(this);
        this.updateFilenameStates = this.updateFilenameStates.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.getPictureNames();
        }
    }

    // Get names for users current pictures and sets them to state variables
    getPictureNames() {
        let userId = this.props.userId;
        let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "?restype=directory&comp=list&" + sasToken;
        const settings = {
            url: uri,
            method: 'GET',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-07-07"
            }
        }

        Axios(settings)
            .then(response => {
                // Response from Azure is in XML format so it needs to parse from text string into an XML DOM object 
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(response.data, "text/xml");
                // Update filename -states with function
                for (let index = 0; index < 6; index++) {
                    let filename = xmlDoc.getElementsByTagName("Name")[index].childNodes[0].nodeValue;
                    this.updateFilenameStates(filename);
                }
            })
            .catch(err => {
                console.log(err.data);
            })
    }

    // Update current pictures filenames to states
    updateFilenameStates(filename) {
        let filenameSplitted = filename.split(".")
        switch (filenameSplitted[0]) {
            case "profile":
                this.setState({
                    CurrentProfilePic: filename
                })
                break;

            case "home":
                this.setState({
                    CurrentHomePic: filename
                })
                break;

            case "iam":
                this.setState({
                    CurrentIamPic: filename
                })
                break;

            case "ican":
                this.setState({
                    CurrentIcanPic: filename
                })
                break;

            case "questbook":
                this.setState({
                    CurrentQuestbookPic: filename
                })
                break;

            case "contact":
                this.setState({
                    CurrentContactPic: filename
                })
                break;

            default:
                break;
        }
    }

    // Sets states when the file inputs values change
    handleValueChange(input) {
        // Depending input field, the right state will be updated
        let inputId = input.target.id;
        // Name of the file is always the same depending on which picture is at issue
        // Only type of the file depends on users file
        let filename = "";
        let file = document.getElementById(inputId).files[0];
        let filenameArray = file.name.split(".");
        let fileType = "." + filenameArray[1];
        let fileSize = file.size;
        // Convert a file to file-like object (raw data) -- from start (0) to the end of the file (fileSize)
        let blob = new Blob([file].slice(0, fileSize));
        // User ID
        let userId = this.props.userId;
        // New instance of FileReader
        let reader = new FileReader();
        // Url for image
        let imageUrl = "";
        // Read content of a blob and depending the input, set it and image url to right state variables
        reader.readAsArrayBuffer(blob);

        switch (inputId) {
            case "profilePicInput":
                filename = "profile" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        // Create an object and set it to the object array state variable
                        let profilePicObj = {
                            CurrentFilename: this.state.CurrentProfilePic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            ProfilePicUrl: imageUrl,
                            ProfilePicObj: profilePicObj
                        });
                    };
                }
                break;

            case "homePicInput":
                filename = "home" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let homePicObj = {
                            CurrentFilename: this.state.CurrentHomePic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            HomePicUrl: imageUrl,
                            HomePicObj: homePicObj
                        });
                    };
                }
                break;

            case "iamPicInput":
                filename = "iam" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let iamPicObj = {
                            CurrentFilename: this.state.CurrentIamPic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            IamPicUrl: imageUrl,
                            IamPicObj: iamPicObj
                        });
                    };
                }
                break;

            case "icanPicInput":
                filename = "ican" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let icanPicObj = {
                            CurrentFilename: this.state.CurrentIcanPic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            IcanPicUrl: imageUrl,
                            IcanPicObj: icanPicObj
                        });
                    };
                }
                break;

            case "questbookPicInput":
                filename = "questbook" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let questbookPicObj = {
                            CurrentFilename: this.state.CurrentQuestbookPic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            QuestbookPicUrl: imageUrl,
                            QuestbookPicObj: questbookPicObj
                        });
                    };
                }
                break;

            case "contactPicInput":
                filename = "contact" + fileType;
                imageUrl = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename;
                reader.onloadend = (evt) => {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        let contactPicObj = {
                            CurrentFilename: this.state.CurrentContactPic,
                            NewFilename: filename,
                            FileSize: fileSize,
                            BinaryString: evt.target.result
                        };
                        this.setState({
                            ContactPicUrl: imageUrl,
                            ContactPicObj: contactPicObj
                        });
                    };
                }
                break;

            default:
                break;
        }
    }

    // From submit handle
    handleSubmit(event) {
        event.preventDefault();
        this.imageUrlsToDatabase();

        // Push picture objects to an array -> array to state variable
        let picObjectArray = [];
        let stateArray = [
            this.state.ProfilePicObj,
            this.state.HomePicObj,
            this.state.IamPicObj,
            this.state.IcanPicObj,
            this.state.QuestbookPicObj,
            this.state.ContactPicObj
        ];

        for (let index = 0; index < stateArray.length; index++) {
            if (stateArray[index] !== null) {
                picObjectArray.push(stateArray[index]);
            }
        }

        this.setState({
            PicObjArray: picObjectArray
        }, this.handleAzureStorage);
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

        let userId = this.props.userId;
        let settings = "";
        // If user is logged in for the first time, request verb will be POST
        if (this.Auth.getFirstLoginMark() !== null) {
            // Settings for axios requests
            settings = {
                url: 'https://localhost:5001/api/images/' + userId,
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: imageObj
            };
        } else {
            settings = {
                url: 'https://localhost:5001/api/images/' + userId,
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: imageObj
            };
        }

        Axios(settings)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log("Save URLs: " + response.data);
                } else {
                    console.log("Save URLs error: " + response.data);
                }
            })
    }

    /* 
        If user logged in at the first time, creates new folder to Azure which is named with user ID 
        and calls other nessecery functions needed to add images to Azure File Storage

        If user wants to update the pictures, at first a delete function is called and then a normal POST to File Storage
    */
    async handleAzureStorage() {
        if (this.Auth.getFirstLoginMark() !== null) {
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
                if (this.Auth.getFirstLoginMark() === null) {
                    window.location.reload();
                }
            } else {
                alert("Problems!");
            }
        } else {
            await this.deletePicturesFromAzure();

            // Other Azure functions
            await this.sendPicturesToAzure();

            // If every responses has succeeded - "Images added succesfully!" -alert will be showed
            if (this.state.DeletePicsResponseArray.every(this.checkStatus) && this.state.SendPicsResponseArray.every(this.checkStatus)) {
                alert("Images updated succesfully!");
                this.clearInputs();
                if (this.Auth.getFirstLoginMark() === null) {
                    window.location.reload();
                }
            } else {
                alert("Problems!");
            }
        }
    }

    // Removes pictures from Azure File Storage
    async deletePicturesFromAzure() {
        let picArray = this.state.PicObjArray;

        let deletePicsResponseArray = [];
        for (let index = 0; index < picArray.length; index++) {
            // Variables for URI and request
            let userId = this.props.userId;
            let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
            let filename = picArray[index].CurrentFilename;
            let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename + "?" + sasToken;

            // Settings for axios requests
            const settings = {
                url: uri,
                method: 'DELETE',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    "x-ms-date": "now",
                    "x-ms-version": "2017-07-29"
                }
            }

            // Request
            await Axios(settings)
                .then(response => {
                    deletePicsResponseArray.push(response.status);
                })
                .catch(err => {
                    deletePicsResponseArray.push(err.status);
                })
        }

        // Status of responses to state variable
        this.setState({
            DeletePicsResponseArray: deletePicsResponseArray
        });
    }

    // Sends pictures to Azure
    async sendPicturesToAzure() {
        // First call the function to create free spaces to the files
        await this.createSpaceForPictures();
        let picArray = this.state.PicObjArray;
        let sendPicsResponseArray = [];
        // Loops as many times as pic count points
        for (let index = 0; index < picArray.length; index++) {
            // Variables for URI and request
            let userId = this.props.userId;
            let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
            let filename = picArray[index].NewFilename;
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
            let filename = picArray[index].NewFilename;
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

    // Checks status of all responses
    checkStatus(response) {
        return response >= 200 && response < 300;
    }

    // Clears file inputs after completed request
    clearInputs() {
        let inputs = document.getElementsByClassName("fileInput");
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            element.value = "";
        }
    }

    render() {
        // SAS token for get requests to Azure File Storage
        let sasToken = "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Pictures</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Profile <br />
                            <input className="fileInput" id="profilePicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.profilePicUrl + sasToken} alt="Profile" width="10%" height="20%" /><br /><br />
                            Home background <br />
                            <input className="fileInput" id="homePicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.homePicUrl + sasToken} alt="Profile" width="32%" height="20%" /><br /><br />
                            I am background <br />
                            <input className="fileInput" id="iamPicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.iamPicUrl + sasToken} alt="Profile" width="32%" height="20%" /><br /><br />
                            <Button type="submit">Save changes</Button>
                        </Col>
                        <Col>
                            I can background <br />
                            <input className="fileInput" id="icanPicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.icanPicUrl + sasToken} alt="Profile" width="32%" height="20%" /><br /><br />
                            Questbook background <br />
                            <input className="fileInput" id="questbookPicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.questbookPicUrl + sasToken} alt="Profile" width="32%" height="20%" /><br /><br />
                            Contact background <br />
                            <input className="fileInput" id="contactPicInput" type="file" onChange={this.handleValueChange} /><br />
                            <img src={this.props.contactPicUrl + sasToken} alt="Profile" width="32%" height="20%" /><br />
                        </Col>
                    </Row>
                </Container>
            </form>
        )
    }
}

class SkillsEdit extends Component {
    constructor() {
        super();
        this.state = {
            Number: -1,
            Skill: "",
            SkillLevel: 0,
            ShowModal: false,
            ProjectNumbers: [],
            Reload: false
        }
        this.addNewProject = this.addNewProject.bind(this);
        this.addNewSkillToDatabase = this.addNewSkillToDatabase.bind(this);
        this.addNewSkillToScreen = this.addNewSkillToScreen.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.closeAddSkillModal = this.closeAddSkillModal.bind(this);
        this.clearDiv = this.clearDiv.bind(this);
        this.openAddSkillModal = this.openAddSkillModal.bind(this);
        this.generateNumber = this.generateNumber.bind(this);
        this.existingSkillsAndProjectsToScreen = this.existingSkillsAndProjectsToScreen.bind(this);
        this.projectNumbersToState = this.projectNumbersToState.bind(this);
        this.skillsAndProjectsToDatabase = this.skillsAndProjectsToDatabase.bind(this);
        this.skillLevelToSpan = this.skillLevelToSpan.bind(this);
        this.skillLevelToModalSpanAndState = this.skillLevelToModalSpanAndState.bind(this);
        this.updatedSkillsFromDatabase = this.updatedSkillsFromDatabase.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModalSkillChange = this.handleModalSkillChange.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.existingSkillsAndProjectsToScreen(this.props.skills);
        }
    }

    // Adds skills that the user already has
    // Set a number to state depending on an index which is used to identify divs, inputs etc.
    existingSkillsAndProjectsToScreen(skills) {
        // Users skills and skill levels
        for (let index = 0; index < skills.length; index++) {
            const element = skills[index];
            this.addNewSkillToScreen(element.skillId, element.skill, element.skillLevel, index)
            this.setState({
                Number: index
            });
        }
    }

    // Add a new skill to database
    addNewSkillToDatabase() {
        let skill = document.getElementById("skillInput").value;
        let skillLevel = document.getElementById("inputSkillLevelModal").value;
        let skillArray = [];
        let projectsArray = [];
        
        let skillObj = {
            SkillId: 0,
            Skill: skill,
            SkillLevel: skillLevel,
            Projects: projectsArray
        };

        // Object to array
        skillArray.push(skillObj);

        // Skill name, level and projects to object
        let skillsObj = {
            Skills: skillArray
        };

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
                    if (this.Auth.getFirstLoginMark() === null) {
                        this.setState({
                            ShowModal: false
                        });
                        this.clearDiv("skillsAndProjects");
                        this.existingSkillsAndProjectsToScreen();
                    }
                } else {
                    console.log(responses[0].data);
                    this.setState({
                        ShowModal: false
                    });
                    alert("Problems!!")
                }
            })
    }

    // Appends inputs and buttons to skillsAndProjects div
    async addNewSkillToScreen(skillId, skill, skillLevel, number) {
        // Raises the number -state for one so every new field gets a different class/id
        await this.generateNumber();
        // Skills and project div
        let skillsAndProjectsDiv = document.getElementById("skillsAndProjects");
        // divs
        let addSkillDiv = document.createElement("div");
        let addProjectsDiv = document.createElement("div");
        // br´s
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        let br5 = document.createElement("br");
        let br6 = document.createElement("br");
        // textnodes
        let textNodeSkill = document.createTextNode("Skill");
        let textNodeSkillLevel = document.createTextNode("Skill level");
        let textNodeAddProject = document.createTextNode("Add a project");
        let textNodeShowProjects = document.createTextNode("Show projects");
        let textNodeDeleteBtn = document.createTextNode("Delete a skill");
        // inputs
        let inputSkill = document.createElement("input");
        let inputSkillLevel = document.createElement("input");
        // spans
        let spanPercent = document.createElement("span");
        let spanSkillId = document.createElement("span");
        // buttons
        let addProjectButton = document.createElement("button");
        let deleteBtn = document.createElement("button");
        // Attributes
        inputSkill.setAttribute("type", "text");
        inputSkillLevel.setAttribute("type", "range");
        inputSkillLevel.setAttribute("min", "0");
        inputSkillLevel.setAttribute("max", "100");
        inputSkillLevel.setAttribute("step", "1");
        inputSkillLevel.setAttribute("value", "0");
        // If user already have some skills and projects, parameters sets the values and different buttons will be showed
        // Class/id gets a tail number from number -parameter. If skill/project is new, tail number comes from the state
        if (skill !== undefined && skillLevel !== undefined) {
            // When the user presses "Add a project" -button below an existing skill, projects info will not be sent --> projects = undefined
            let projects = undefined;
            // Button
            let showProjectButton = document.createElement("button");
            // Add class/id
            addSkillDiv.id = "skill" + number;
            addProjectsDiv.id = "projects" + number;
            inputSkill.id = "skillInput" + number;
            inputSkillLevel.id = "inputSkillLevel" + number;
            spanSkillId.id = "spanSkillId" + number;
            spanPercent.id = "spanSkillLevelPercent" + number
            addProjectButton.id = "addProjectBtn" + number;
            showProjectButton.id = "showProjectsBtn" + number;
            deleteBtn.id = "deleteSkillBtn" + number;
            addSkillDiv.className = "skill";
            addProjectsDiv.className = "projectsDiv"
            spanSkillId.className = "spanSkillId";
            inputSkillLevel.className = "inputSkillLevel";
            spanPercent.className = "spanSkillLevelPercent"
            inputSkill.className = "skillInput";
            showProjectButton.className = "showProjectsBtn btn btn-primary";
            addProjectButton.className = "addProjectBtn btn btn-primary";
            deleteBtn.className = "deleteSkillBtn btn btn-primary";
            // Attributes
            spanSkillId.setAttribute("hidden", "hidden");
            showProjectButton.setAttribute("type", "button");
            addProjectButton.setAttribute("type", "button");
            deleteBtn.setAttribute("type", "button");
            // Text (Skill ID) to span
            spanSkillId.textContent = skillId;
            // Values to inputs
            inputSkill.value = skill;
            inputSkillLevel.value = skillLevel;
            spanPercent.textContent = skillLevel + " %"
            // Events
            showProjectButton.onclick = () => { this.getProjects(skillId, number); }
            addProjectButton.onclick = () => { this.addNewProject(projects, number); }
            deleteBtn.onclick = () => { this.deleteSkill(skillId, number); }
            inputSkillLevel.onchange = () => { this.skillLevelToSpan(number); }
            // Append text to buttons
            showProjectButton.appendChild(textNodeShowProjects)
            addProjectButton.appendChild(textNodeAddProject)
            deleteBtn.appendChild(textNodeDeleteBtn);
            // Append to div
            addSkillDiv.appendChild(spanSkillId);
            addSkillDiv.appendChild(textNodeSkill);
            addSkillDiv.appendChild(br1);
            addSkillDiv.appendChild(inputSkill);
            addSkillDiv.appendChild(br2);
            addSkillDiv.appendChild(textNodeSkillLevel);
            addSkillDiv.appendChild(br3);
            addSkillDiv.appendChild(inputSkillLevel);
            addSkillDiv.appendChild(spanPercent);
            addSkillDiv.appendChild(br4);
            addSkillDiv.appendChild(addProjectsDiv);
            addSkillDiv.appendChild(addProjectButton);
            addSkillDiv.appendChild(showProjectButton);
            addSkillDiv.appendChild(deleteBtn);
        } else {
            // Because a skill is new, "projects" and "skillId" are undefined
            let projects = undefined;
            skillId = undefined;
            // Add class/id
            addSkillDiv.id = "skill" + this.state.Number;
            addProjectsDiv.id = "projects" + this.state.Number;
            inputSkill.id = "skillInput" + this.state.Number;
            inputSkillLevel.id = "inputSkillLevel" + this.state.Number;
            spanSkillId.id = "spanSkillId" + this.state.Number;
            spanPercent.id = "spanSkillLevelPercent" + this.state.Number;
            addProjectButton.id = "addProjectBtn" + this.state.Number;
            deleteBtn.id = "deleteSkillBtn" + this.state.Number;
            addSkillDiv.className = "skill";
            addProjectsDiv.className = "projectsDiv"
            spanSkillId.className = "spanSkillId";
            inputSkillLevel.className = "inputSkillLevel";
            spanPercent.className = "spanSkillLevelPercent"
            inputSkill.className = "skillInput";
            addProjectButton.className = "addProjectBtn btn btn-primary";
            deleteBtn.className = "deleteSkillBtn btn btn-primary";
            // Attributes
            spanSkillId.setAttribute("hidden", "hidden");
            addProjectButton.setAttribute("type", "button");
            deleteBtn.setAttribute("type", "button");
            // Text (Skill ID) to span
            spanSkillId.textContent = 0;
            // Values of inputs
            inputSkill.value = this.state.Skill;
            inputSkillLevel.value = this.state.SkillLevel;
            spanPercent.textContent = this.state.SkillLevel + " %";
            // Events
            addProjectButton.onclick = () => { this.addNewProject(projects); }
            deleteBtn.onclick = () => { this.deleteSkill(skillId, this.state.Number); }
            inputSkillLevel.onchange = () => { this.skillLevelToSpan(this.state.Number); }
            // Append text to button
            addProjectButton.appendChild(textNodeAddProject)
            deleteBtn.appendChild(textNodeDeleteBtn);
            // Close Modal window
            this.closeAddSkillModal();
            // Append to div
            addSkillDiv.appendChild(spanSkillId);
            addSkillDiv.appendChild(textNodeSkill);
            addSkillDiv.appendChild(br1);
            addSkillDiv.appendChild(inputSkill);
            addSkillDiv.appendChild(br2);
            addSkillDiv.appendChild(textNodeSkillLevel);
            addSkillDiv.appendChild(br3);
            addSkillDiv.appendChild(inputSkillLevel);
            addSkillDiv.appendChild(spanPercent);
            addSkillDiv.appendChild(br4);
            addSkillDiv.appendChild(addProjectsDiv);
            addSkillDiv.appendChild(addProjectButton);
            addSkillDiv.appendChild(deleteBtn);
        }
        // Append to div
        addSkillDiv.appendChild(br5);
        addSkillDiv.appendChild(br6);
        skillsAndProjectsDiv.appendChild(addSkillDiv);
    }

    // Close modal window  for adding a new skill
    closeAddSkillModal() {
        this.setState({
            ShowModal: false
        });
    }
    // Open modal window for adding a new skill
    openAddSkillModal() {
        this.setState({
            ShowModal: true
        });
    }

    // Delete single project
    deleteProject(projectId, number, projectNumber) {
        // If the project, which user is going to delete is new, the request is not sent to backend 
        if (projectId !== undefined) {
            const settings = {
                url: 'https://localhost:5001/api/projects/' + projectId,
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };

            Axios(settings)
                .then((response) => {
                    console.log("Link delete: " + response.data);
                    // Remove deleted service div
                    let projectsDiv = document.getElementById("projects" + number);
                    let projectDiv = document.getElementById(number + "project" + projectNumber);
                    projectsDiv.removeChild(projectDiv);
                    // Generate new id´s for elements
                    let projectDivs = document.getElementsByClassName(number + "project");
                    let projectIdSpans = document.getElementsByClassName("spanProjectId" + number);
                    let projectNumberSpans = document.getElementsByClassName("spanProjectNumber" + number);
                    let projectNameInputs = document.getElementsByClassName("inputProjectName" + number);
                    let projectLinkInputs = document.getElementsByClassName("inputProjectLink" + number);
                    let projectDescriptionAreas = document.getElementsByClassName("textareaProjectDescription" + number);
                    let deleteBtns = document.getElementsByClassName("deleteProjectBtn" + number);

                    for (let index = 0; index < projectDivs.length; index++) {
                        const projectDiv = projectDivs[index];
                        const projectIdSpan = projectIdSpans[index];
                        const projectNumberSpan = projectNumberSpans[index];
                        const projectNameInput = projectNameInputs[index];
                        const projectLinkInput = projectLinkInputs[index];
                        const projectDescriptionArea = projectDescriptionAreas[index];
                        const deleteBtn = deleteBtns[index];

                        projectDiv.id = number + "project" + index;
                        projectIdSpan.id = number + "spanProjectId" + index;
                        projectNameInput.id = number + "inputProjectName" + index;
                        projectLinkInput.id = number + "inputProjectLink" + index;
                        projectDescriptionArea.id = number + "textareaProjectDescription" + index;
                        // Update function parameters to onClick event in case of user deletes a project from the list between the first and the last
                        deleteBtn.onclick = () => { this.deleteProject(projectIdSpan.textContent, number, projectNumberSpan.textContent); }
                    }
                    // Remove last added project number so the count of an array is correct
                    let projectNumbersArray = this.state.ProjectNumbers;
                    projectNumbersArray.pop()
                    this.setState({
                        ProjectNumbers: projectNumbersArray
                    });
                    /*  
                        If user deletes all of his/her projects, reduce the Number state variable for one 
                        so that the next new project div + other elements gets the right ID´s
                    */
                    this.setState({
                        Number: this.state.Number - 1
                    });
                })
                .catch(error => {
                    console.log("Link delete error: " + error.data);
                })
        } else {
            // Remove deleted project div
            let projectsDiv = document.getElementById("projects" + number);
            let projectDiv = document.getElementById(number + "project" + projectNumber);
            projectsDiv.removeChild(projectDiv);
            // Remove last added project number
            let projectNumbersArray = this.state.ProjectNumbers;
            projectNumbersArray.pop()
            this.setState({
                ProjectNumbers: projectNumbersArray
            });
        }
    }

    // Delete skill and all projects of the skill
    deleteSkill(skillId, number) {
        // If the skill, which user is going to delete is new, the request is not sent to backend 
        if (skillId !== undefined) {
            const settings = {
                url: 'https://localhost:5001/api/skills/' + skillId,
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };

            Axios(settings)
                .then((response) => {
                    console.log("Skill delete: " + response.data);
                    // Remove deleted skill div
                    let skillsAndProjetcsDiv = document.getElementById("skillsAndProjects");
                    let skillDiv = document.getElementById("skill" + number);
                    skillsAndProjetcsDiv.removeChild(skillDiv);
                    // Generate new id´s for elements
                    let skillDivs = document.getElementsByClassName("skill");
                    let skillIdSpans = document.getElementsByClassName("spanSkillId");
                    let skillInputs = document.getElementsByClassName("skillInput");
                    let skillLevelInputs = document.getElementsByClassName("inputSkillLevel");
                    let skillLevelPercentSpans = document.getElementsByClassName("spanSkillLevelPercent");
                    let projectsDivs = document.getElementsByClassName("projectsDiv");
                    let showProjectsBtns = document.getElementsByClassName("showProjectsBtn");
                    let deleteBtns = document.getElementsByClassName("deleteSkillBtn");

                    for (let index = 0; index < skillDivs.length; index++) {
                        const skillDiv = skillDivs[index];
                        const skillIdSpan = skillIdSpans[index];
                        const skillInput = skillInputs[index];
                        const skillLevelInput = skillLevelInputs[index];
                        const skillLevelPercentSpan = skillLevelPercentSpans[index];
                        const projectsDiv = projectsDivs[index];
                        const showProjectsBtn = showProjectsBtns[index];
                        const deleteBtn = deleteBtns[index];

                        skillDiv.id = "skill" + index;
                        skillIdSpan.id = "spanSkillId" + index;
                        skillInput.id = "skillInput" + index;
                        skillLevelInput.id = "inputSkillLevel" + index;
                        skillLevelPercentSpan.id = "spanSkillLevelPercent" + index;
                        projectsDiv.id = "projects" + index;
                        showProjectsBtn.id = "showProjectsBtn" + index;
                        // Update function parameters to events in case of user deletes a skill from the list between the first and the last
                        showProjectsBtn.onclick = () => { this.getProjects(skillIdSpan.textContent, index); }
                        deleteBtn.onclick = () => { this.deleteSkill(skillIdSpan.textContent, index); }
                        skillLevelInput.onchange = () => { this.skillLevelToSpan(index); }
                    }
                    /*  
                        If user deletes all of his/her skills, reduce the Number state variable for one 
                        so that the next new skill div + other elements gets the right ID´s
                    */
                    this.setState({
                        Number: this.state.Number - 1
                    });
                })
                .catch(error => {
                    console.log("Skill delete error: " + error.data);
                })
        } else {
            // Remove deleted skill div
            let skillsAndProjetcsDiv = document.getElementById("skillsAndProjects");
            let skillDiv = document.getElementById("skill" + number);
            skillsAndProjetcsDiv.removeChild(skillDiv);
            // Reduce the Number state variable for one so that the next new skill div + other elements gets the right ID´s
            this.setState({
                Number: this.state.Number - 1
            });
        }
    }

    // Sets range input value (skill level) to span element
    skillLevelToSpan(number) {
        let skillLevelInput = document.getElementById("inputSkillLevel" + number);
        let span = document.getElementById("spanSkillLevelPercent" + number);
        span.textContent = skillLevelInput.value + " %";
    }

    // Sets a new skill level to modal window span tag and a state variable
    skillLevelToModalSpanAndState(e) {
        let span = document.getElementById("spanSkillLevelPercentModal");
        span.textContent = e.target.value + " %";
        this.setState({
            SkillLevel: e.target.value
        })
    }

    // Raises the number -state for one
    generateNumber() {
        let number = this.state.Number + 1
        this.setState({
            Number: number
        });
    }

    // Appends inputs to projects div
    addNewProject(projects, number, projectNumber) {
        let addProjectsDiv = ""
        let singleProjectDiv = document.createElement("div");
        // br´s
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        let br5 = document.createElement("br");
        let br6 = document.createElement("br");
        let br7 = document.createElement("br");
        let br8 = document.createElement("br");
        // textnodes
        let textNodeName = document.createTextNode("Project name");
        let textNodeLink = document.createTextNode("Project link");
        let textNodeDescription = document.createTextNode("Project Description");
        let textNodeDeleteBtn = document.createTextNode("Delete a project");
        // span
        let spanProjectId = document.createElement("span");
        let spanProjectNumber = document.createElement("span");
        // inputs
        let inputName = document.createElement("input");
        let inputLink = document.createElement("input");
        let textareaDescription = document.createElement("textarea");
        // buttons
        let deleteBtn = document.createElement("button");
        // Attribute for inputs
        inputName.setAttribute("type", "text");
        inputLink.setAttribute("type", "url");
        textareaDescription.setAttribute("type", "text");
        // Attribute for button
        deleteBtn.setAttribute("type", "button");
        if (projects !== undefined && number !== undefined && projectNumber !== undefined) {                // If user clicks a "Show projects" button
            // div                                                                                          // Class/id gets an index number from number -parameter which indentifies a project to specific skill
            addProjectsDiv = document.getElementById("projects" + number);                                  // Values from getProjects() Axios response
            // Add class/id                                                                                 // Project number comes from for loop index after OK response in getProjects()
            singleProjectDiv.id = number + "project" + projectNumber;
            spanProjectId.id = number + "spanProjectId" + projectNumber;
            spanProjectNumber.id = number + "spanProjectNumber" + projectNumber;
            inputName.id = number + "inputProjectName" + projectNumber;
            inputLink.id = number + "inputProjectLink" + projectNumber;
            textareaDescription.id = number + "textareaProjectDescription" + projectNumber;
            singleProjectDiv.className = number + "project";
            spanProjectId.className = "spanProjectId" + number;
            spanProjectNumber.className = "spanProjectNumber" + number;
            inputName.className = "inputProjectName" + number;
            inputLink.className = "inputProjectLink inputProjectLink" + number;
            textareaDescription.className = "textareaProjectDescription" + number;
            deleteBtn.className = "deleteProjectBtn" + number + " btn btn-primary";
            // Attribute for span
            spanProjectId.setAttribute("hidden", "hidden");
            spanProjectNumber.setAttribute("hidden", "hidden");
            // Text (Project ID) to span
            spanProjectId.textContent = projects.projectId;
            spanProjectNumber.textContent = projectNumber;
            // Add values
            inputName.value = projects.name;
            inputLink.value = projects.link;
            textareaDescription.value = projects.description;
            // Events
            deleteBtn.onclick = () => { this.deleteProject(projects.projectId, number, projectNumber); }
        } else if (projects === undefined && number !== undefined && projectNumber === undefined) {         // If user clicks a "Add a project" button below an existing skill
            let projectNumbers = this.state.ProjectNumbers;                                                 // Class/id gets an index number from number -parameter which indentifies a project to specific skill
            let lastProjectNumber = projectNumbers.slice(-1)[0];                                            // Values are empty (spanProjectID = 0) because new project
            let projectNumber = 0;                                                                          // Project number is the last item of ProjectNumbers state array + 1
            if (lastProjectNumber !== undefined) {                                                          // If the project is the first project to that skill, a project number is 0
                projectNumber = parseInt(lastProjectNumber) + 1;
            }
            // div                                                                                              
            addProjectsDiv = document.getElementById("projects" + number);
            // Add class/id
            singleProjectDiv.id = number + "project" + projectNumber;
            spanProjectId.id = number + "spanProjectId" + projectNumber;
            inputName.id = number + "inputProjectName" + projectNumber;
            inputLink.id = number + "inputProjectLink" + projectNumber;
            textareaDescription.id = number + "textareaProjectDescription" + projectNumber;
            singleProjectDiv.className = number + "project";
            spanProjectId.className = "spanProjectId" + number;
            spanProjectNumber.className = "spanProjectNumber" + number;
            inputName.className = "inputProjectName" + number;
            inputLink.className = "inputProjectLink inputProjectLink" + number;
            textareaDescription.className = "textareaProjectDescription" + number;
            deleteBtn.className = "deleteSkillBtn" + number + " btn btn-primary";
            // Attribute for span
            spanProjectId.setAttribute("hidden", "hidden");
            spanProjectNumber.setAttribute("hidden", "hidden");
            // Text (Project ID) to span
            spanProjectId.textContent = 0;
            spanProjectNumber.textContent = projectNumber;
            // Add values
            inputName.value = "";
            inputLink.value = "http://";
            textareaDescription.value = "";
            // Events
            deleteBtn.onclick = () => { this.deleteProject(undefined, number, projectNumber); }         // If user clicks a "Add a project" below a new skill
        } else {                                                                                        // Class/id gets a tail number from number -state which indentifies a project to specific skill
            let projectNumbers = this.state.ProjectNumbers;                                             // Values are empty (spanProjectID = 0) because new project
            let lastProjectNumber = projectNumbers.slice(-1)[0];                                        // Project number is the last item of ProjectNumbers state array + 1
            let projectNumber = 0;                                                                      // If the project is the first project to that skill, a project number is 0
            if (lastProjectNumber !== undefined) {
                projectNumber = parseInt(lastProjectNumber) + 1;
            }
            // div
            addProjectsDiv = document.getElementById("projects" + this.state.Number);
            // Add class/id
            singleProjectDiv.id = this.state.Number + "project" + projectNumber;
            spanProjectId.id = this.state.Number + "spanProjectId" + projectNumber;
            inputName.id = this.state.Number + "inputProjectName" + projectNumber;
            inputLink.id = this.state.Number + "inputProjectLink" + projectNumber;
            textareaDescription.id = this.state.Number + "textareaProjectDescription" + projectNumber;
            singleProjectDiv.className = this.state.Number + "project";
            spanProjectId.className = "spanProjectId" + this.state.Number;
            spanProjectNumber.className = "spanProjectNumber" + this.state.Number;
            inputName.className = "inputProjectName" + this.state.Number;
            inputLink.className = "inputProjectLink inputProjectLink" + this.state.Number;
            textareaDescription.className = "textareaProjectDescription" + this.state.Number;
            deleteBtn.className = "deleteSkillBtn" + this.state.Number + " btn btn-primary";
            // Attribute for span
            spanProjectId.setAttribute("hidden", "hidden");
            spanProjectNumber.setAttribute("hidden", "hidden");
            // Text (Project ID) to span
            spanProjectId.textContent = 0;
            spanProjectNumber.textContent = projectNumber;
            // Add values
            inputName.value = "";
            inputLink.value = "http://";
            textareaDescription.value = "";
            // Events
            deleteBtn.onclick = () => { this.deleteProject(undefined, this.state.Number, projectNumber); }
        }
        // Append
        deleteBtn.appendChild(textNodeDeleteBtn);
        singleProjectDiv.appendChild(spanProjectNumber);
        singleProjectDiv.appendChild(spanProjectId);
        singleProjectDiv.appendChild(textNodeName);
        singleProjectDiv.appendChild(br1);
        singleProjectDiv.appendChild(inputName);
        singleProjectDiv.appendChild(br2);
        singleProjectDiv.appendChild(textNodeLink);
        singleProjectDiv.appendChild(br3);
        singleProjectDiv.appendChild(inputLink);
        singleProjectDiv.appendChild(br4);
        singleProjectDiv.appendChild(textNodeDescription);
        singleProjectDiv.appendChild(br5);
        singleProjectDiv.appendChild(textareaDescription);
        singleProjectDiv.appendChild(br6);
        singleProjectDiv.appendChild(deleteBtn);
        singleProjectDiv.appendChild(br7);
        singleProjectDiv.appendChild(br8);
        addProjectsDiv.appendChild(singleProjectDiv);

        // If the project is added to a new skill, a parameter is a value of Number -state
        if (number !== undefined) {
            this.projectNumbersToState(number)
        } else {
            this.projectNumbersToState(this.state.Number)
        }
    }

    // Gets all projects for skill from database and sends those to addNewProject -function
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
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    this.addNewProject(element, number, index)
                }
            })
            .catch(error => {
                console.log("Projects error: " + error.data);
            })
    }

    // Sets a new skill name to state variable
    handleModalSkillChange(e) {
        this.setState({
            Skill: e.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.skillsAndProjectsToDatabase();
    }

    // Sets existing project numbers to state array
    projectNumbersToState(number) {
        // Get every text content of project number spans to state
        let projectNumberSpans = document.getElementsByClassName("spanProjectNumber" + number);
        let projectNumberArray = [];
        for (let index = 0; index < projectNumberSpans.length; index++) {
            const element = projectNumberSpans[index];
            projectNumberArray.push(element.textContent)
        }
        this.setState({
            ProjectNumbers: projectNumberArray
        })
    }

    // Posts all skills and projects to database
    skillsAndProjectsToDatabase() {
        let skillArray = [];
        // Count of skills
        let skillInputs = document.getElementsByClassName("skillInput");
        // All skills with projects to array
        for (let index = 0; index < skillInputs.length; index++) {
            let skillsObj = "";
            let projectObj = "";
            let projectsArray = [];
            // Right inputs with index number
            let skillNameInput = document.getElementById("skillInput" + [index]);
            let skillLevelInput = document.getElementById("inputSkillLevel" + [index]);
            let skillIdSpan = document.getElementById("spanSkillId" + [index]);
            let projectIdSpan = document.getElementsByClassName("spanProjectId" + [index]);
            let nameInputs = document.getElementsByClassName("inputProjectName" + [index]);
            let linkInputs = document.getElementsByClassName("inputProjectLink" + [index]);
            let descriptionInputs = document.getElementsByClassName("textareaProjectDescription" + [index]);

            // All projects for the skill to object
            for (let index = 0; index < nameInputs.length; index++) {
                projectObj = {
                    ProjectId: projectIdSpan[index].textContent,
                    Name: nameInputs[index].value,
                    Link: linkInputs[index].value,
                    Description: descriptionInputs[index].value
                };

                // Object to array
                projectsArray.push(projectObj);
            }

            // Skill name, level and projects to object
            skillsObj = {
                SkillId: skillIdSpan.textContent,
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
                    alert("Skill/Projects saved succesfully!")
                    if (this.Auth.getFirstLoginMark() === null) {
                        window.location.reload();
                    }
                } else {
                    console.log(responses[0].data);
                    alert("Problems!!")
                }
            })
    }

    clearDiv(id) {
        document.getElementById(id).innerHTML = "";
    }

    updatedSkillsFromDatabase() {
        let userId = this.props.userId;

        const skillsSettings = {
            url: 'https://localhost:5001/api/skills/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        // Requests
        const skillsGet = Axios(skillsSettings);

        // Promises
        Promise.all([skillsGet])
            .then((responses) => {
                return responses[0].data
            })
            .catch(errors => {
                console.log("Skills error: " + errors[0]);
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            <Button id="addNewSkillBtn" type="button" onClick={this.openAddSkillModal}>Add a skill</Button><br /><br />
                            <div id="skillsAndProjects"></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="submit">Save changes</Button>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for adding a new skill */}
                <Modal show={this.state.ShowModal} onHide={this.closeAddSkillModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new skill</Modal.Title>
                    </Modal.Header>
                    <form>
                        <Modal.Body>
                            Skill<br />
                            <input type="text" id="skillInput" className="skillInput" onChange={this.handleModalSkillChange}></input><br />
                            Skill level<br />
                            <input id="inputSkillLevelModal" type="range" min="0" max="100" step="1" defaultValue="0" onChange={this.skillLevelToModalSpanAndState} />
                            <span id="spanSkillLevelPercentModal" className="spanSkillLevelPercent">0 %</span><br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="button" onClick={this.addNewSkillToDatabase}>Add</Button>
                            <Button type="button" onClick={this.closeAddSkillModal}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </form>
        )
    }
}

class InfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Number: -1,
            Firstname: "",
            Lastname: "",
            DateOfBirth: "",
            City: "",
            Country: "",
            Phonenumber: "",
            Punchline: "",
            BasicKnowledge: "",
            Education: "",
            WorkHistory: "",
            LanguageSkills: ""
        }
        this.addNewSocialMediaService = this.addNewSocialMediaService.bind(this);
        this.addExistingSocialMediaLinks = this.addExistingSocialMediaLinks.bind(this);
        this.addValuesToInputs = this.addValuesToInputs.bind(this);
        this.contentToDatabase = this.contentToDatabase.bind(this);
        this.deleteSocialMediaService = this.deleteSocialMediaService.bind(this);
        this.generateNumber = this.generateNumber.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.addValuesToInputs();
            this.addExistingSocialMediaLinks();
            this.updateStates();
        }
    }

    convertToDate(date) {
        // Convert datetime to a date format which is correct to date input field
        let birthdate = new Date(date);
        let splitted = birthdate.toISOString().split("T")

        return splitted[0];
    }

    // Adds social media links that the user already has
    // Set a number to state depending on an index which is used to identify divs, inputs etc.
    addExistingSocialMediaLinks() {
        // Social media selects/link inputs with values
        for (let index = 0; index < this.props.links.length; index++) {
            const element = this.props.links[index];
            this.addNewSocialMediaService(element.linkId, element.serviceId, element.link, index)
            this.setState({
                Number: index
            });
        }
    }

    // Sets values to basicInfo inputs
    addValuesToInputs() {
        // Value to basic inputs
        document.getElementById("firstnameInput").value = this.props.content.firstname
        document.getElementById("lastnameInput").value = this.props.content.lastname
        document.getElementById("birthdateInput").value = this.convertToDate(this.props.content.birthdate)
        document.getElementById("cityInput").value = this.props.content.city
        document.getElementById("countryInput").value = this.props.content.country
        document.getElementById("phoneInput").value = this.props.content.phonenumber
        document.getElementById("emailIdSpan1").textContent = this.props.emails[0].emailId
        document.getElementById("email1Input").value = this.props.emails[0].emailAddress
        document.getElementById("emailIdSpan2").textContent = this.props.emails[1].emailId
        document.getElementById("email2Input").value = this.props.emails[1].emailAddress
        document.getElementById("punchlineInput").value = this.props.content.punchline
        document.getElementById("basicInput").value = this.props.content.basicKnowledge
        document.getElementById("educationInput").value = this.props.content.education
        document.getElementById("workHistoryInput").value = this.props.content.workHistory
        document.getElementById("languageinput").value = this.props.content.languageSkills
    }

    // Appends inputs and buttons to socialMediaServices div
    async addNewSocialMediaService(linkId, serviceId, link, number) {
        // Raises the number -state for one so every new field gets a different class/id
        await this.generateNumber();
        // div
        let socialMediaServicesDiv = document.getElementById("socialMediaServices");
        let serviceDiv = document.createElement("div");
        // br
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        let br4 = document.createElement("br");
        let br5 = document.createElement("br");
        let br6 = document.createElement("br");
        // textnode
        let textNodeService = document.createTextNode("Service");
        let textNodeServiceLink = document.createTextNode("Service link");
        let textNodeDeleteBtn = document.createTextNode("Delete");
        // input
        let inputServiceLink = document.createElement("input");
        // select
        let serviceSelect = document.createElement("select");
        // option
        let optionFacebook = document.createElement("option");
        let optionInstagram = document.createElement("option");
        let optionTwitter = document.createElement("option");
        let optionGithub = document.createElement("option");
        let optionYoutube = document.createElement("option");
        let optionLinkedin = document.createElement("option");
        // spans
        let spanLinkId = document.createElement("span");
        // button
        let deleteBtn = document.createElement("button");
        // button attribute
        deleteBtn.setAttribute("type", "button");
        // span attribute
        spanLinkId.setAttribute("hidden", "hidden");
        // input attribute
        inputServiceLink.setAttribute("type", "url");
        // select attribute
        serviceSelect.setAttribute("type", "select");
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
        // If user already have links to social media, parameters sets the values
        if (serviceId !== undefined && link !== undefined) {
            // Add class/id
            serviceDiv.id = "service" + number;
            serviceSelect.id = "socialMediaSelect" + number;
            inputServiceLink.id = "socialMedia1Input" + number;
            spanLinkId.id = "spanLinkId" + number;
            spanLinkId.className = "spanLinkId";
            serviceDiv.className = "service";
            serviceSelect.className = "socialMediaSelect";
            inputServiceLink.className = "socialMedia1Input";
            deleteBtn.className = "deleteSocialMediaBtn btn btn-primary";
            // Click event to button
            deleteBtn.onclick = () => { this.deleteSocialMediaService(linkId, number); }
            // Values
            spanLinkId.textContent = linkId;
            serviceSelect.value = serviceId;
            inputServiceLink.value = link;
        } else {
            linkId = undefined;
            // Add class/id
            serviceDiv.id = "service" + this.state.Number;
            serviceSelect.id = "socialMediaSelect" + this.state.Number;
            inputServiceLink.id = "socialMedia1Input" + this.state.Number;
            spanLinkId.id = "spanLinkId" + this.state.Number;
            spanLinkId.className = "spanLinkId";
            serviceDiv.className = "service"
            serviceSelect.className = "socialMediaSelect";
            inputServiceLink.className = "socialMedia1Input";
            deleteBtn.className = "deleteSocialMediaBtn btn btn-primary";
            // Click event to button
            deleteBtn.onclick = () => { this.deleteSocialMediaService(linkId, this.state.Number); }
            // Values
            spanLinkId.textContent = 0;
            serviceSelect.value = 1;
            inputServiceLink.value = "http://";
        }
        // append textnode to button
        deleteBtn.appendChild(textNodeDeleteBtn);
        // Append elements to div
        serviceDiv.appendChild(spanLinkId);
        serviceDiv.appendChild(textNodeService);
        serviceDiv.appendChild(br1);
        serviceDiv.appendChild(serviceSelect);
        serviceDiv.appendChild(br2);
        serviceDiv.appendChild(textNodeServiceLink);
        serviceDiv.appendChild(br3);
        serviceDiv.appendChild(inputServiceLink);
        serviceDiv.appendChild(br4);
        serviceDiv.appendChild(deleteBtn);
        serviceDiv.appendChild(br5);
        serviceDiv.appendChild(br6);
        socialMediaServicesDiv.appendChild(serviceDiv);
    }

    // Deletes social media service link
    deleteSocialMediaService(linkId, number) {
        console.log(number);
        if (linkId !== undefined) {
            const settings = {
                url: 'https://localhost:5001/api/socialmedia/' + linkId,
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };

            Axios(settings)
                .then((response) => {
                    console.log("Link delete: " + response.data);
                    // Remove deleted service div
                    let servicesDiv = document.getElementById("socialMediaServices");
                    let serviceDiv = document.getElementById("service" + number);
                    servicesDiv.removeChild(serviceDiv);
                    // Generate new id´s for elements
                    let serviceDivs = document.getElementsByClassName("service");
                    let linkIdSpans = document.getElementsByClassName("spanLinkId");
                    let serviceSelects = document.getElementsByClassName("socialMediaSelect");
                    let linkInputs = document.getElementsByClassName("socialMedia1Input");
                    let deleteBtns = document.getElementsByClassName("deleteSocialMediaBtn");

                    for (let index = 0; index < serviceDivs.length; index++) {
                        const serviceDiv = serviceDivs[index];
                        const spanLinkId = linkIdSpans[index];
                        const socialMediaSelect = serviceSelects[index];
                        const socialMedia1Input = linkInputs[index];
                        const deleteBtn = deleteBtns[index];

                        serviceDiv.id = "service" + index;
                        spanLinkId.id = "spanLinkId" + index;
                        socialMediaSelect.id = "socialMediaSelect" + index;
                        socialMedia1Input.id = "socialMedia1Input" + index;
                        // Update function parameters to onClick event in case of user deletes a service from the list between the first and the last
                        deleteBtn.onclick = () => { this.deleteSocialMediaService(spanLinkId.textContent, index); }
                    }
                    /*  
                        If user deletes all of his/her services, reduce the Number state variable for one 
                        so that the next new service div + other elements gets the right ID´s
                    */
                    this.setState({
                        Number: this.state.Number - 1
                    });
                })
                .catch(error => {
                    console.log("Link delete error: " + error.data);
                })
        } else {
            let servicesDiv = document.getElementById("socialMediaServices");
            let serviceDiv = document.getElementById("service" + number);
            servicesDiv.removeChild(serviceDiv);
            // Reduce the Number state variable for one so that the next new service div + other elements gets the right ID´s
            this.setState({
                Number: this.state.Number - 1
            });
        }
    }

    // Raises the number -state for one
    generateNumber() {
        let number = this.state.Number + 1
        this.setState({
            Number: number
        });
    }

    // Sets basicInfo inputs values to states
    handleValueChange(input) {
        // Depending on input field, the right state will be updated
        let inputId = input.target.id;

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

    // Sends all content to database
    contentToDatabase() {
        let emailsArray = [];
        let emailSpans = document.getElementsByClassName("emailIDSpan");
        let emailInputs = document.getElementsByClassName("emailInput");

        for (let index = 0; index < emailSpans.length; index++) {
            let emailObj = "";
            if (emailSpans[index].textContent == null) {
                emailObj = {
                    EmailAddress: emailInputs[index].value
                };
            } else {
                emailObj = {
                    EmailId: emailSpans[index].textContent,
                    EmailAddress: emailInputs[index].value
                };
            }

            emailsArray.push(emailObj);
        }

        // Content and social media links to database
        // Objects for requests
        const contentObj = {
            Firstname: this.state.Firstname,
            Lastname: this.state.Lastname,
            Birthdate: this.state.DateOfBirth,
            City: this.state.City,
            Country: this.state.Country,
            Phonenumber: this.state.Phonenumber,
            Punchline: this.state.Punchline,
            BasicKnowledge: this.state.BasicKnowledge,
            Education: this.state.Education,
            WorkHistory: this.state.WorkHistory,
            LanguageSkills: this.state.LanguageSkills
        };

        const emailsObj = {
            Emails: emailsArray
        };

        // All added links to social media services to array
        let servicesArray = [];
        let serviceSelects = document.getElementsByClassName("socialMediaSelect");
        for (let index = 0; index < serviceSelects.length; index++) {
            let servicesObj = "";
            let serviceSelect = document.getElementById("socialMediaSelect" + [index]);
            let serviceLinkInput = document.getElementById("socialMedia1Input" + [index]);
            let linkIdSpan = document.getElementById("spanLinkId" + [index]);

            servicesObj = {
                LinkId: linkIdSpan.textContent,
                ServiceId: serviceSelect.value,
                Link: serviceLinkInput.value
            };
            servicesArray.push(servicesObj);
        };

        const servicesObj = {
            Services: servicesArray
        };

        // Settings for axios requests
        let userId = this.props.userId;
        let contentSettings = "";
        let emailsSettings = "";
        let socialMediaSettings = "";
        if (this.Auth.getFirstLoginMark() === null) {
            contentSettings = {
                url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: contentObj
            };

            emailsSettings = {
                url: 'https://localhost:5001/api/portfoliocontent/emails/',
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: emailsObj
            };
        } else {
            contentSettings = {
                url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: contentObj
            };

            emailsSettings = {
                url: 'https://localhost:5001/api/portfoliocontent/emails/' + userId,
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: emailsObj
            };
        }

        socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: servicesObj
        };

        // Requests
        const contentPost = Axios(contentSettings);
        const emailPost = Axios(emailsSettings);
        const socialMediaPost = Axios(socialMediaSettings);

        Promise.all([contentPost, emailPost, socialMediaPost])
            .then((responses) => {
                alert("Content saved succesfully!");
                console.log(responses[0].data);
                console.log(responses[1].data);
                console.log(responses[2].data);
                if (this.Auth.getFirstLoginMark() === null) {
                    window.location.reload();
                }
            })
            .catch(errors => {
                // alert("Problems!!");
                console.log("Content error: " + errors[0]);
                console.log("Email error: " + errors[1]);
                console.log("Social media error: " + errors[2]);
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.contentToDatabase();
    }

    // Updates states when user is going to edit his/her portfolio
    updateStates() {
        this.setState({
            Firstname: this.props.content.firstname,
            Lastname: this.props.content.lastname,
            DateOfBirth: this.convertToDate(this.props.content.birthdate),
            City: this.props.content.city,
            Country: this.props.content.country,
            Phonenumber: this.props.content.phonenumber,
            Emails: this.props.emails,
            Punchline: this.props.content.punchline,
            BasicKnowledge: this.props.content.basicKnowledge,
            Education: this.props.content.education,
            WorkHistory: this.props.content.workHistory,
            LanguageSkills: this.props.content.languageSkills
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
                            <span id="emailIdSpan1" className="emailIDSpan" hidden></span>
                            Email 1 <br />
                            <input id="email1Input" className="emailInput" type="email" onBlur={this.handleValueChange} /><br />
                            <span id="emailIdSpan2" className="emailIDSpan" hidden></span>
                            Email 2 <br />
                            <input id="email2Input" className="emailInput" type="email" onBlur={this.handleValueChange} /><br />
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
                            <h4>Social media services</h4>
                            <div id="socialMediaServices"></div>
                            <Button type="button" onClick={this.addNewSocialMediaService}>Add social media service</Button><br />
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

class AccountEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NewPassword: "",
            ConfirmedNewPassword: "",
            PicNameArray: []
        }
        this.deleteAccount = this.deleteAccount.bind(this);
        this.deleteDirectoryFromAzure = this.deleteDirectoryFromAzure.bind(this);
        this.deletePicturesFromAzure = this.deletePicturesFromAzure.bind(this);
        this.getPictureNames = this.getPictureNames.bind(this);
        this.handleAzureDelete = this.handleAzureDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login mark exists, the request is not sent
        if (this.Auth.getFirstLoginMark() === null) {
            this.getPictureNames();
        }
    }

    // Get names of pictures from Azure
    getPictureNames() {
        let userId = this.props.userId;
        let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "?restype=directory&comp=list&" + sasToken;
        const settings = {
            url: uri,
            method: 'GET',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-07-07"
            }
        }

        Axios(settings)
            .then(response => {
                // Response from Azure is in XML format so it needs to parse from text string into an XML DOM object 
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(response.data, "text/xml");
                // Update filenames to PicNameArray state
                let picNameArray = [];
                for (let index = 0; index < 6; index++) {
                    let filename = xmlDoc.getElementsByTagName("Name")[index].childNodes[0].nodeValue;
                    picNameArray.push(filename);
                }
                this.setState({
                    PicNameArray: picNameArray
                })
            })
            .catch(err => {
                console.log(err.data);
            })
    }

    // Handles all what is needed to delete an account
    deleteAccount() {
        let confirmed = window.confirm("Are you sure you want to delete your account and all the content of it?");

        if (confirmed === true) {
            const settings = {
                url: 'https://localhost:5001/api/user/' + this.props.userId,
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }

            Axios(settings)
                .then(response => {
                    this.handleAzureDelete();
                    // Remove all marks from localStorage
                    this.Auth.removeEditingMark();
                    this.Auth.logout();
                    if (this.Auth.getFirstLoginMark() !== null) {
                        this.Auth.removeFirstLoginMark();
                    }

                    alert("Your account and all the content has been deleted.\r\nThank you for using Web Portfolio..\r\nWe hope to get you back soon!");
                    window.location.reload();
                })
                .catch(error => {
                    alert("Problems!")
                })
        }
    }

    // After all of users pics are deleted, the directory can be removed
    deleteDirectoryFromAzure() {
        // Variables for URI
        let userId = this.props.userId;
        let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
        let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/?restype=directory&" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'DELETE',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "x-ms-date": "now",
                "x-ms-version": "2017-07-29"
            }
        }

        // Request
        Axios(settings)
            .then(response => {
                console.log("Delete dir status: " + response.status);
            })
            .catch(err => {
                console.log("Delete dir error status: " + err.response.status);
            })
    }

    // Removes all user pictures from Azure File Storage
    deletePicturesFromAzure() {
        let picNameArray = this.state.PicNameArray;

        for (let index = 0; index < picNameArray.length; index++) {
            // Variables for URI
            let userId = this.props.userId;
            let sasToken = "sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacu&se=2020-09-30T16:28:04Z&st=2020-05-05T08:28:04Z&spr=https,http&sig=ITXbiBLKA3XX0lGW87pl3gLk5VB62i0ipWfAcfO%2F2dA%3D";
            let filename = picNameArray[index];
            let uri = "https://webportfolio.file.core.windows.net/images/" + userId + "/" + filename + "?" + sasToken;

            // Settings for axios requests
            const settings = {
                url: uri,
                method: 'DELETE',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    "x-ms-date": "now",
                    "x-ms-version": "2017-07-29"
                }
            }

            // Request
            Axios(settings)
                .then(response => {
                    console.log("Delete pic status: " + response.status);
                })
                .catch(err => {
                    console.log("Delete pic error status: " + err.response.status);
                })
        }
    }

    // Handles delete from Azure (pics first, then directory)
    async handleAzureDelete() {
        this.deletePicturesFromAzure();
        this.deleteDirectoryFromAzure();
    }

    // Form submit for updating a password
    handleSubmit(e) {
        e.preventDefault();
        // Check if new and confirmed password will match
        if (this.state.NewPassword === this.state.ConfirmedNewPassword) {
            // Get old password straight from the input, so it will not stored anywhere on client memory
            let oldPassword = md5(document.getElementById("oldPasswordInput").value);

            // Data for request
            const passwordObj = {
                OldPassword: oldPassword,
                NewPassword: this.state.ConfirmedNewPassword
            }

            // Settings for request
            const settings = {
                url: 'https://localhost:5001/api/user/' + this.props.userId,
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: passwordObj
            }

            // Request
            Axios(settings)
                .then((response) => {
                    console.log(response);
                    alert("Password updated succesfully!");
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        alert("The old password was incorrect. Please try again. ")
                    } else {
                        alert("Problems!")
                    }
                })
        } else {
            alert("New password and confirmed password do not match.\r\nPlease type the right passwords and try again.")
        }

    }

    handleValueChange(input) {
        // Depending on input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
            case "newPasswordInput":
                this.setState({
                    NewPassword: md5(input.target.value)
                });
                break;

            case "confirmNewPasswordInput":
                this.setState({
                    ConfirmedNewPassword: md5(input.target.value)
                });
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <form onSubmit={this.handleSubmit}>
                            <h4>Change password</h4>
                            Old password <br />
                            <input id="oldPasswordInput" type="password" onChange={this.handleValueChange} /><br />
                            New Password <br />
                            <input id="newPasswordInput" type="password" onChange={this.handleValueChange} /><br />
                            Confirm new password <br />
                            <input id="confirmNewPasswordInput" type="password" onChange={this.handleValueChange} /><br />
                            <Button type="submit">Change password</Button>
                        </form>
                    </Col>
                    <Col>
                        <h4>Delete account</h4>
                        <Button type="button" onClick={this.deleteAccount}>Delete account</Button><br />
                    </Col>
                </Row>
            </Container>
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
            AccountBool: false,
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
        for (let index = 0; index < data.length; index++) {
            let typeId = data[index].typeId;
            switch (typeId) {
                case 1:
                    this.setState({
                        ProfilePicUrl: data[index].url
                    })
                    break;

                case 2:
                    this.setState({
                        HomePicUrl: data[index].url
                    })
                    break;

                case 3:
                    this.setState({
                        IamPicUrl: data[index].url
                    })
                    break;

                case 4:
                    this.setState({
                        IcanPicUrl: data[index].url
                    })
                    break;

                case 5:
                    this.setState({
                        QuestbookPicUrl: data[index].url
                    })
                    break;

                case 6:
                    this.setState({
                        ContactPicUrl: data[index].url
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
                PicturesBool: false,
                AccountBool: false
            });
        } else if (btnId === "skillsNavBtn") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: true,
                PicturesBool: false,
                AccountBool: false
            });
        } else if (btnId === "picturesNavBtn") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: false,
                PicturesBool: true,
                AccountBool: false
            });
        } else if (btnId === "accountNavBtn") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: false,
                PicturesBool: false,
                AccountBool: true
            });
        } else {
            alert("Error happened. Please refresh the page.");
        }
    }

    render() {
        if (this.Auth.getFirstLoginMark() === null) {
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
                                    <li><button id="accountNavBtn" onClick={this.handleNavClick}>Account</button></li>
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
                            {/* AccountEdit */}
                            {this.state.AccountBool ?
                                <AccountEdit
                                    userId={this.state.Profile.nameid}
                                /> : null}
                        </Fragment>
                    </Container>
                </main>
            );
        } else {
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
                            {this.state.BasicInfoBool ?
                                <InfoEdit
                                    userId={this.state.Profile.nameid}
                                /> : null}
                            {/* SkillsEdit */}
                            {this.state.SkillsBool ?
                                <SkillsEdit
                                    userId={this.state.Profile.nameid}
                                /> : null}
                            {/* PictureEdit */}
                            {this.state.PicturesBool ?
                                <PictureEdit
                                    userId={this.state.Profile.nameid}
                                /> : null}
                        </Fragment>
                    </Container>
                </main>
            );
        }

    }
}

export default EditPortfolio;