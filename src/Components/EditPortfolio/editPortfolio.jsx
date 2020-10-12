import React, { Component, Fragment } from 'react';
import './editPortfolio.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import AuthService from '../LoginHandle/AuthService';
import Axios from 'axios';
import md5 from 'md5';
import swal from 'sweetalert';

class PictureEdit extends Component {
    constructor(props) {
        super();
        this.state = {
            ProfilePicObj: null,
            HomePicObj: null,
            IamPicObj: null,
            IcanPicObj: null,
            QuestbookPicObj: null,
            ContactPicObj: null,
            ProfilePicUrl: "",
            HomePicUrl: "",
            IamPicUrl: "",
            IcanPicUrl: "",
            QuestbookPicUrl: "",
            ContactPicUrl: "",
            CurrentProfilePic: "",
            CurrentHomePic: "",
            CurrentIamPic: "",
            CurrentIcanPic: "",
            CurrentQuestbookPic: "",
            CurrentContactPic: "",
            SendPicsResponse: "",
            DeletePicsResponse: "",
            ShowPreviewModal: false,
            UrlForModal: ""
        }
        this.checkStatus = this.checkStatus.bind(this);
        this.closeImagePreviewModal = this.closeImagePreviewModal.bind(this);
        this.deletePicturesFromAzure = this.deletePicturesFromAzure.bind(this);
        this.filenameToInput = this.filenameToInput.bind(this);
        this.getPictureNames = this.getPictureNames.bind(this);
        this.getPictureNames = this.getPictureNames.bind(this);
        this.getRightFileInput = this.getRightFileInput.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleImageSave = this.handleImageSave.bind(this);
        this.handleAzureStorage = this.handleAzureStorage.bind(this);
        this.imageUrlsFromDatabase = this.imageUrlsFromDatabase.bind(this);
        this.imageUrlToDatabase = this.imageUrlToDatabase.bind(this);
        this.openImagePreviewModal = this.openImagePreviewModal.bind(this);
        this.sendPicturesToAzure = this.sendPicturesToAzure.bind(this);
        this.updateFilenameStates = this.updateFilenameStates.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        this.getPictureNames();
        this.imageUrlsFromDatabase();
    }

    // Close modal window for image preview
    closeImagePreviewModal() {
        this.setState({
            ShowPreviewModal: false
        });
    }

    // Open modal window for image preview
    openImagePreviewModal(event) {
        // The URL of the image to preview
        switch (event.target.id) {
            case "profilePreviewBtn":
                this.setState({
                    UrlForModal: this.state.ProfilePicUrl
                })
                break;

            case "homePreviewBtn":
                this.setState({
                    UrlForModal: this.state.HomePicUrl
                })
                break;

            case "iamPreviewBtn":
                this.setState({
                    UrlForModal: this.state.IamPicUrl
                })
                break;

            case "icanPreviewBtn":
                this.setState({
                    UrlForModal: this.state.IcanPicUrl
                })
                break;

            case "questbookPreviewBtn":
                this.setState({
                    UrlForModal: this.state.QuestbookPicUrl
                })
                break;

            case "contactPreviewBtn":
                this.setState({
                    UrlForModal: this.state.ContactPicUrl
                })
                break;

            default:
                break;
        }
        this.setState({
            ShowPreviewModal: true
        });
    }

    // Get names for users current pictures and sets them to state variables
    getPictureNames() {
        let userId = this.props.userId;
        let sasToken = this.Auth.getSas();
        let uri = "https://webportfolio.blob.core.windows.net/" + userId + "?restype=container&comp=list&" + sasToken;
        const settings = {
            url: uri,
            method: 'GET',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-12-12"
            }
        }

        Axios(settings)
            .then(response => {
                // Response from Azure is in XML format so it needs to parse from text string into an XML DOM object 
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(response.data, "text/xml");
                // Update filename -states with function
                for (let index = 0; index < 6; index++) {
                    // If a user doesn't have any images yet, only a message to the log will be written
                    if (xmlDoc.getElementsByTagName("Name")[index] !== undefined) {
                        let filename = xmlDoc.getElementsByTagName("Name")[index].childNodes[0].nodeValue;
                        this.updateFilenameStates(filename);
                    } else {
                        console.log("getPictureNames(): All the image names has loaded.");
                        // Little bit of math so that the loop not loops unnecessarily
                        let currentIndex = index;
                        index = index + (6 - currentIndex);
                    }
                }
            })
            .catch(err => {
                console.log("getPictureNames error: " + err);
            })
    }

    // Set a chosen filename to the value of file input
    filenameToInput(input) {
        let path = input.value;
        let splittedPath = path.split("\\");
        let filename = splittedPath[splittedPath.length - 1];
        document.getElementById(input.id + "Lbl").innerHTML = filename;
    }

    // Update the filenames for the current picture states
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
        // File input to the filenameToInput -function
        let fileInput = document.getElementById(inputId);
        this.filenameToInput(fileInput);
        // Name of the file is always the same depending on which picture is at issue
        // Only type of the file depends on users file
        let filename = "";
        let file = document.getElementById(inputId).files[0];
        // If a user press the cancel button on a "choose file"-window (file === undefined), 
        // a real name of the current picture will be the text content of a file inputs label
        if (file) {
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
            let imageUrl = "https://webportfolio.blob.core.windows.net/" + userId;
            // Read content of a blob and depending the input, set it and image url to the right state variables
            reader.readAsArrayBuffer(blob);

            switch (inputId) {
                case "profilePicInput":
                    filename = "profile" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            // Create an object and set it to the object array state variable
                            let profilePicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentProfilePic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                ProfilePicUrl: imageUrl + "/" + filename,
                                ProfilePicObj: profilePicObj
                            });
                        };
                    }
                    break;

                case "homePicInput":
                    filename = "home" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            let homePicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentHomePic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                HomePicUrl: imageUrl + "/" + filename,
                                HomePicObj: homePicObj
                            });
                        };
                    }
                    break;

                case "iamPicInput":
                    filename = "iam" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            let iamPicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentIamPic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                IamPicUrl: imageUrl + "/" + filename,
                                IamPicObj: iamPicObj
                            });
                        };
                    }
                    break;

                case "icanPicInput":
                    filename = "ican" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            let icanPicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentIcanPic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                IcanPicUrl: imageUrl + "/" + filename,
                                IcanPicObj: icanPicObj
                            });
                        };
                    }
                    break;

                case "questbookPicInput":
                    filename = "questbook" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            let questbookPicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentQuestbookPic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                QuestbookPicUrl: imageUrl + "/" + filename,
                                QuestbookPicObj: questbookPicObj
                            });
                        };
                    }
                    break;

                case "contactPicInput":
                    filename = "contact" + fileType;
                    reader.onloadend = (evt) => {
                        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                            let contactPicObj = {
                                RealFileName: file.name,
                                CurrentFilename: this.state.CurrentContactPic,
                                NewFilename: filename,
                                FileSize: fileSize,
                                BinaryString: evt.target.result
                            };
                            this.setState({
                                ContactPicUrl: imageUrl + "/" + filename,
                                ContactPicObj: contactPicObj
                            });
                        };
                    }
                    break;

                default:
                    break;
            }
        } else {
            switch (inputId) {
                case "profilePicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.ProfilePicObj.RealFileName;
                    break;

                case "homePicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.HomePicObj.RealFileName;
                    break;

                case "iamPicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.IamPicObj.RealFileName;
                    break;

                case "icanPicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.IcanPicObj.RealFileName;
                    break;

                case "questbookPicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.QuestbookPicObj.RealFileName;
                    break;

                case "contactPicInput":
                    document.getElementById(inputId + "Lbl").textContent = this.state.ContactPicObj.RealFileName;
                    break;

                default:
                    break;
            }
        }
    }

    handleImageSave(event) {
        event.preventDefault();
        let btnId = event.target.id;
        let imageObj = "";

        switch (btnId) {
            case "profileSaveBtn":
                // If the user has not selected an image, the alert will be displayed
                if (this.state.ProfilePicObj) {
                    if (this.state.ProfilePicObj.FileSize < 3000000) {
                        // Create an object for the request
                        imageObj = {
                            Profile: [{
                                TypeID: 1,
                                Url: this.state.ProfilePicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.ProfilePicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the profile image first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            case "homeSaveBtn":
                if (this.state.HomePicObj) {
                    if (this.state.HomePicObj.FileSize < 3000000) {
                        imageObj = {
                            Home: [{
                                TypeID: 2,
                                Url: this.state.HomePicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.HomePicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the image for the 'Home'-section first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            case "iamSaveBtn":
                if (this.state.IamPicObj) {
                    if (this.state.IamPicObj.FileSize < 3000000) {
                        imageObj = {
                            Iam: [{
                                TypeID: 3,
                                Url: this.state.IamPicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.IamPicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the image for the 'I am'-section first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            case "icanSaveBtn":
                if (this.state.IcanPicObj) {
                    if (this.state.IcanPicObj.FileSize < 3000000) {
                        imageObj = {
                            Ican: [{
                                TypeID: 4,
                                Url: this.state.IcanPicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.IcanPicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the image for the 'I can'-section first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            case "questbookSaveBtn":
                if (this.state.QuestbookPicObj) {
                    if (this.state.QuestbookPicObj.FileSize < 3000000) {
                        imageObj = {
                            Questbook: [{
                                TypeID: 5,
                                Url: this.state.QuestbookPicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.QuestbookPicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the image for the 'Guestbook'-section first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            case "contactSaveBtn":
                if (this.state.ContactPicObj) {
                    if (this.state.ContactPicObj.FileSize < 3000000) {
                        imageObj = {
                            Contact: [{
                                TypeID: 6,
                                Url: this.state.ContactPicUrl
                            }]
                        }

                        this.imageUrlToDatabase(imageObj);
                        this.handleAzureStorage(this.state.ContactPicObj, btnId);
                    } else {
                        swal({
                            title: "Attention!",
                            text: "Size of an image is too large.\n\rMax size: 3 MB.",
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                } else {
                    swal({
                        title: "Attention!",
                        text: "Please choose the image for the 'Contact'-section first.",
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
                break;

            default:
                break;
        }
    }

    // Sends the image URL to the database
    imageUrlToDatabase(imageObj) {
        let userId = this.props.userId;
        let settings = "";

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

        Axios(settings)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log("Save URLs: " + response.data);
                } else {
                    console.log("Save URLs error: " + response.data);
                }
            })
    }

    // Image URLs from the database for image previews when a user has logged in at the first time. Otherwise URLs came from props
    imageUrlsFromDatabase() {
        let userId = this.props.userId;

        // Settings for axios requests
        const imagesSettings = {
            url: 'https://localhost:5001/api/images/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        Axios(imagesSettings)
            .then((response) => {
                // Image URLs to the states
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    switch (element.typeId) {
                        case 1:
                            this.setState({
                                ProfilePicUrl: element.url
                            })
                            break;

                        case 2:
                            this.setState({
                                HomePicUrl: element.url
                            })
                            break;

                        case 3:
                            this.setState({
                                IamPicUrl: element.url
                            })
                            break;

                        case 4:
                            this.setState({
                                IcanPicUrl: element.url
                            })
                            break;

                        case 5:
                            this.setState({
                                QuestbookPicUrl: element.url
                            })
                            break;

                        case 6:
                            this.setState({
                                ContactPicUrl: element.url
                            })
                            break;

                        default:
                            break;
                    }
                }
            })
            .catch(error => {
                console.log("Save URL's error: " + error);
            })
    }

    getRightFileInput(btnId) {
        let name = btnId.split("SaveBtn");
        return name[0] + "PicInputLbl";
    }

    /* 
        Handles the upload of an image to the Azure
        At first the delete function is called (removes the old image) and then the normal POST to the Azure Blob Storage
    */
    async handleAzureStorage(picObj, btnId) {
        await this.deletePicturesFromAzure(picObj);

        // Other Azure functions
        await this.sendPicturesToAzure(picObj);

        let fileInput = document.getElementById(this.getRightFileInput(btnId));
        // If every responses has succeeded - the color coded success will be shown around the file input
        if (this.checkStatus(this.state.DeletePicsResponse) &&
            this.checkStatus(this.state.SendPicsResponse)) {
            // Green color around the file input indicates the succesfull image upload
            fileInput.classList.add("saveSuccess");
            // Name of the users images to the states in case of the user wants to load same type of the image without page reload
            this.getPictureNames();
            if (fileInput) {
                setTimeout(
                    () => { fileInput.classList.remove("saveSuccess") }
                    , 8000);
            }

        } else {
            // Red color around the file input indicates the unsuccesfull image upload
            fileInput.classList.add("saveNotSuccess");
            if (fileInput) {
                setTimeout(
                    () => { fileInput.classList.remove("saveNotSuccess") }
                    , 8000);
            }
        }
    }

    // Deletes the image from Azure Blob Storage
    async deletePicturesFromAzure(picObj) {
        // Variables for the URI and the request
        let userId = this.props.userId;
        let sasToken = this.Auth.getSas();
        let filename = picObj.CurrentFilename;
        let uri = "https://webportfolio.blob.core.windows.net/" + userId + "/" + filename + "?" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'DELETE',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-12-12"
            }
        }

        // Request
        await Axios(settings)
            .then(response => {
                this.setState({
                    DeletePicsResponse: response.status
                });
            })
            .catch(err => {
                this.setState({
                    DeletePicsResponse: err.status
                });
            })
    }

    // Sends the image to Azure Blob Storage
    async sendPicturesToAzure(picObj) {
        // First call the function to create the free space to the file
        // await this.createSpaceForPictures(picObj);

        // Variables for the URI and the request
        let userId = this.props.userId;
        let sasToken = this.Auth.getSas();
        let filename = picObj.NewFilename;
        let filetype = filename.split(".")[1];
        // let rangeMaxSize = picObj.FileSize - 1;
        let picData = picObj.BinaryString;
        let uri = "https://webportfolio.blob.core.windows.net/" + userId + "/" + filename + "?" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'PUT',
            headers: {
                "Content-Type": "image/" + filetype,
                "x-ms-blob-cache-control": "max-age=3600",
                "x-ms-blob-type": "BlockBlob"
            },
            data: picData
        }

        // Request
        await Axios(settings)
            .then(response => {
                this.setState({
                    SendPicsResponse: response.status
                });
            })
            .catch(err => {
                this.setState({
                    SendPicsResponse: err.status
                });
            })
    }

    // Checks the status of the response
    checkStatus(response) {
        return response >= 200 && response < 300;
    }

    render() {
        // SAS token for the GET requests to Azure Blob Storage
        let sasToken = "?" + this.Auth.getSas();

        return (
            <form id="imagesForm">
                <Container id="imagesContainer">
                    <Row id="imagesUpperRow">
                        <Col id="imagesCol">
                            <h4>Images</h4>
                            <Row>
                                <Col>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>Profile</b></label><br />
                                            <input id="profilePicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="profilePicInputLbl" className="fileInputLbl" htmlFor="profilePicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="profilePreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="profileSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>Home - background</b></label><br />
                                            <input id="homePicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="homePicInputLbl" className="fileInputLbl" htmlFor="homePicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="homePreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="homeSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>I am - background</b></label><br />
                                            <input id="iamPicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="iamPicInputLbl" className="fileInputLbl" htmlFor="iamPicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="iamPreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="iamSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>I can - background</b></label><br />
                                            <input id="icanPicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="icanPicInputLbl" className="fileInputLbl" htmlFor="icanPicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="icanPreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="icanSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>Guestbook - background</b></label><br />
                                            <input id="questbookPicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="questbookPicInputLbl" className="fileInputLbl" htmlFor="questbookPicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="questbookPreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="questbookSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="imageControlsDiv">
                                        <div className="mobileImageWrapperDiv">
                                            <label><b>Contact - background</b></label><br />
                                            <input id="contactPicInput" className="fileInput" type="file" onChange={this.handleValueChange} />
                                            <label id="contactPicInputLbl" className="fileInputLbl" htmlFor="contactPicInput">Choose a file</label>
                                        </div>
                                        <div className="imagesBtnDiv">
                                            <button className="imagePreviewBtn" type="button" title="Show image preview" onClick={this.openImagePreviewModal}>
                                                <span id="contactPreviewBtn" className="fas fa-eye"></span>
                                            </button>
                                            <button className="imageSaveBtn" type="button" title="Save an image" onClick={this.handleImageSave}>
                                                <span id="contactSaveBtn" className="fas fa-save"></span>
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col id="noteCol">
                            <small>Note: Maxium size of an image is 3 MB</small>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for the image preview */}
                <Modal id="imagePreviewModal" show={this.state.ShowPreviewModal} onHide={this.closeImagePreviewModal} centered>
                    <button id="closePreviewModalBtn" type="button" title="Close">
                        <span className="fas fa-times-circle" onClick={this.closeImagePreviewModal}></span>
                    </button>
                    <img src={this.state.UrlForModal + sasToken} alt="" />
                </Modal>
            </form>
        )
    }
}

class SkillsEdit extends Component {
    constructor() {
        super();
        this.state = {
            Skill: "",
            SkillLevel: 0,
            ShowAddSkillModal: false,
            ShowProjectsModal: false,
            SkillIdToModal: "",
            SkillNameToModal: "",
            ProjectNumbers: []
        }
        this.addNewProject = this.addNewProject.bind(this);
        this.addNewSkillToDatabase = this.addNewSkillToDatabase.bind(this);
        this.addNewSkillToScreen = this.addNewSkillToScreen.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.closeAddSkillModal = this.closeAddSkillModal.bind(this);
        this.closeProjectsModal = this.closeProjectsModal.bind(this);
        this.clearDiv = this.clearDiv.bind(this);
        this.openAddSkillModal = this.openAddSkillModal.bind(this);
        this.openProjectsModal = this.openProjectsModal.bind(this);
        this.existingSkillsToScreen = this.existingSkillsToScreen.bind(this);
        this.projectNumbersToState = this.projectNumbersToState.bind(this);
        this.updatedSkillsToDatabase = this.updatedSkillsToDatabase.bind(this);
        this.projectsToDatabase = this.projectsToDatabase.bind(this);
        this.skillLevelToSpan = this.skillLevelToSpan.bind(this);
        this.skillLevelToModalSpanAndState = this.skillLevelToModalSpanAndState.bind(this);
        this.updatedSkillsFromDatabase = this.updatedSkillsFromDatabase.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModalSkillChange = this.handleModalSkillChange.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the first login and skills added marks exists, all the added skills fetched from database. Otherwise skills came from props
        if (this.Auth.getFirstLoginMark() === null) {
            this.existingSkillsToScreen(this.props.skills);
        } else if (this.Auth.getFirstLoginMark() !== null && this.Auth.getSkillsAddedMark() !== null) {
            this.updatedSkillsFromDatabase();
        }
    }

    // Adds skills that the user already has
    // Set a number to state depending on an index which is used to identify divs, inputs etc.
    existingSkillsToScreen(skills) {
        // Users skills and skill levels
        for (let index = 0; index < skills.length; index++) {
            const element = skills[index];
            this.addNewSkillToScreen(element.skillId, element.skill, element.skillLevel, index)
        }
    }

    // Add a new skill to database
    addNewSkillToDatabase() {
        let skill = document.getElementById("skillInput").value;
        let skillLevel = document.getElementById("inputSkillLevelModal").value;
        let skillArray = [];

        let skillObj = {
            SkillId: 0,
            Skill: skill,
            SkillLevel: skillLevel
        };

        // Object to array. This is because the backend
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
                    this.updatedSkillsFromDatabase();
                    if (this.Auth.getFirstLoginMark() !== null) {
                        this.Auth.setSkillsAddedMark();
                    }
                    this.setState({
                        ShowAddSkillModal: false
                    });
                } else {
                    console.log(responses[0].data);
                    this.setState({
                        ShowAddSkillModal: false
                    });
                    swal({
                        title: "Error occured!",
                        text: "There was a problem adding a new skill!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "error",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
            })
    }

    // Appends inputs and buttons to skills div
    async addNewSkillToScreen(skillId, skill, skillLevel, number) {
        // Skills and project div
        let skillsDiv = document.getElementById("skills");
        // divs
        let addSkillDiv = document.createElement("div");
        let desktopWrapper = document.createElement("div");
        let mobileWrapper = document.createElement("div");
        let buttonsDiv = document.createElement("div");
        let buttonsDivMobile = document.createElement("div");
        let upperDiv = document.createElement("div");
        let lowerDiv = document.createElement("div");
        // inputs
        let inputSkill = document.createElement("input");
        let inputSkillMobile = document.createElement("input");
        let inputSkillLevel = document.createElement("input");
        let inputSkillLevelMobile = document.createElement("input");
        // spans
        let spanPercent = document.createElement("label");
        let spanPercentMobile = document.createElement("label");
        let spanSkillId = document.createElement("span");
        let spanSkillIdMobile = document.createElement("span");
        let spanAdd = document.createElement("span");
        let spanAddMobile = document.createElement("span");
        let spanShow = document.createElement("span");
        let spanShowMobile = document.createElement("span");
        let spanDelete = document.createElement("span");
        let spanDeleteMobile = document.createElement("span");
        // Buttons
        let deleteSkillBtn = document.createElement("button");
        let deleteSkillBtnMobile = document.createElement("button");
        let showProjectButton = document.createElement("button");
        let showProjectButtonMobile = document.createElement("button");
        // Attributes
        inputSkill.setAttribute("type", "text");
        inputSkillLevel.setAttribute("type", "range");
        inputSkillLevel.setAttribute("min", "0");
        inputSkillLevel.setAttribute("max", "100");
        inputSkillLevel.setAttribute("step", "1");
        inputSkillLevel.setAttribute("value", "0");
        inputSkillMobile.setAttribute("type", "text");
        inputSkillLevelMobile.setAttribute("type", "range");
        inputSkillLevelMobile.setAttribute("min", "0");
        inputSkillLevelMobile.setAttribute("max", "100");
        inputSkillLevelMobile.setAttribute("step", "1");
        inputSkillLevelMobile.setAttribute("value", "0");
        // Add class/id
        addSkillDiv.id = "skill" + number;
        inputSkill.id = "skillInput" + number;
        inputSkillMobile.id = "skillInputMobile" + number;
        inputSkillLevel.id = "inputSkillLevel" + number;
        inputSkillLevelMobile.id = "inputSkillLevelMobile" + number;
        spanSkillId.id = "spanSkillId" + number;
        spanSkillIdMobile.id = "spanSkillIdMobile" + number;
        spanPercent.id = "spanSkillLevelPercent" + number
        spanPercentMobile.id = "spanSkillLevelPercentMobile" + number
        showProjectButton.id = "showProjectsBtn" + number;
        showProjectButtonMobile.id = "showProjectsBtnMobile" + number;
        deleteSkillBtn.id = "deleteSkillBtn" + number;
        deleteSkillBtnMobile.id = "deleteSkillBtnMobile" + number;
        upperDiv.className = "upperDiv";
        lowerDiv.className = "lowerDiv";
        addSkillDiv.className = "skill";
        desktopWrapper.className = "desktopWrapper";
        mobileWrapper.className = "mobileWrapper";
        buttonsDiv.className = "buttonsDiv";
        buttonsDivMobile.className = "buttonsDiv";
        spanSkillId.className = "spanSkillId";
        spanSkillIdMobile.className = "spanSkillIdMobile";
        inputSkillLevel.className = "inputSkillLevel";
        inputSkillLevelMobile.className = "inputSkillLevelMobile";
        spanPercent.className = "spanSkillLevelPercent"
        spanPercentMobile.className = "spanSkillLevelPercentMobile"
        inputSkill.className = "skillInput";
        inputSkillMobile.className = "skillInputMobile";
        showProjectButton.className = "showProjectsBtn";
        showProjectButtonMobile.className = "showProjectsBtnMobile";
        deleteSkillBtn.className = "deleteSkillBtn";
        deleteSkillBtnMobile.className = "deleteSkillBtnMobile";
        // Attributes
        spanSkillId.setAttribute("hidden", "hidden");
        spanSkillIdMobile.setAttribute("hidden", "hidden");
        spanAdd.setAttribute("class", "fas fa-plus-circle");
        spanAddMobile.setAttribute("class", "fas fa-plus-circle");
        spanShow.setAttribute("class", "fas fa-arrow-alt-circle-right");
        spanShowMobile.setAttribute("class", "fas fa-arrow-alt-circle-right");
        spanDelete.setAttribute("class", "fas fa-trash-alt");
        spanDeleteMobile.setAttribute("class", "fas fa-trash-alt");
        showProjectButton.setAttribute("type", "button");
        showProjectButton.setAttribute("title", "Show projects");
        showProjectButton.setAttribute("style", "outline:none;");
        showProjectButtonMobile.setAttribute("type", "button");
        showProjectButtonMobile.setAttribute("title", "Show projects");
        showProjectButtonMobile.setAttribute("style", "outline:none;");
        deleteSkillBtn.setAttribute("type", "button");
        deleteSkillBtn.setAttribute("title", "Delete the skill");
        deleteSkillBtn.setAttribute("style", "outline:none;");
        deleteSkillBtnMobile.setAttribute("type", "button");
        deleteSkillBtnMobile.setAttribute("title", "Delete the skill");
        deleteSkillBtnMobile.setAttribute("style", "outline:none;");
        // Text (Skill ID) to span
        spanSkillId.textContent = skillId;
        spanSkillIdMobile.textContent = skillId;
        // Values to inputs
        inputSkill.value = skill;
        inputSkillMobile.value = skill;
        inputSkillLevel.value = skillLevel;
        inputSkillLevelMobile.value = skillLevel;
        spanPercent.textContent = skillLevel + " %"
        spanPercentMobile.textContent = skillLevel + " %"
        // Events
        showProjectButton.onclick = () => { this.openProjectsModal(skillId, skill); }
        showProjectButtonMobile.onclick = () => { this.openProjectsModal(skillId, skill); }
        deleteSkillBtn.onclick = () => { this.deleteSkill(skillId, number); }
        deleteSkillBtnMobile.onclick = () => { this.deleteSkill(skillId, number); }
        inputSkillLevel.onchange = () => { this.skillLevelToSpan(number); }
        inputSkillLevelMobile.onchange = () => { this.skillLevelToSpan(number); }
        // Append spans to buttons
        showProjectButton.appendChild(spanShow)
        showProjectButtonMobile.appendChild(spanShowMobile)
        deleteSkillBtn.appendChild(spanDelete);
        deleteSkillBtnMobile.appendChild(spanDeleteMobile);
        // Append buttons to div
        buttonsDiv.appendChild(showProjectButton);
        buttonsDiv.appendChild(deleteSkillBtn);
        buttonsDivMobile.appendChild(showProjectButtonMobile);
        buttonsDivMobile.appendChild(deleteSkillBtnMobile);
        upperDiv.appendChild(spanSkillIdMobile)
        upperDiv.appendChild(inputSkillMobile)
        upperDiv.appendChild(buttonsDivMobile)
        lowerDiv.appendChild(inputSkillLevelMobile)
        lowerDiv.appendChild(spanPercentMobile)
        desktopWrapper.appendChild(spanSkillId);
        desktopWrapper.appendChild(inputSkill);
        desktopWrapper.appendChild(inputSkillLevel);
        desktopWrapper.appendChild(spanPercent);
        desktopWrapper.appendChild(buttonsDiv);
        mobileWrapper.appendChild(upperDiv);
        mobileWrapper.appendChild(lowerDiv);
        addSkillDiv.appendChild(desktopWrapper);
        addSkillDiv.appendChild(mobileWrapper);
        // Append to div
        skillsDiv.appendChild(addSkillDiv);
    }

    // Close the modal window for adding a new skill
    closeAddSkillModal() {
        this.setState({
            ShowAddSkillModal: false
        });
    }

    // Open the modal window for adding a new skill
    openAddSkillModal() {
        this.setState({
            ShowAddSkillModal: true
        });
    }

    // Close the modal window for showing the projects of the skill
    closeProjectsModal() {
        this.setState({
            ShowProjectsModal: false
        });
    }

    // Open the modal window for showing the projects of the skill
    openProjectsModal(skillId, skillName) {
        this.setState({
            SkillIdToModal: skillId,
            SkillNameToModal: skillName,
            ShowProjectsModal: true
        }, this.getProjects(skillId));
    }

    // Delete single project
    deleteProject(projectId, projectNumber) {
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
                    let projectsDiv = document.getElementById("projects");
                    let projectDiv = document.getElementById("project" + projectNumber);
                    projectsDiv.removeChild(projectDiv);
                    // Generate new id´s for elements
                    let projectDivs = document.getElementsByClassName("projectDiv");
                    let projectIdSpans = document.getElementsByClassName("projectIdSpan");
                    let projectNumberSpans = document.getElementsByClassName("projectNumberSpan");
                    let projectNameInputs = document.getElementsByClassName("inputProjectName");
                    let projectLinkInputs = document.getElementsByClassName("inputProjectLink");
                    let projectDescriptionAreas = document.getElementsByClassName("textareaProjectDescription");
                    let deleteBtns = document.getElementsByClassName("deleteProjectBtn");

                    for (let index = 0; index < projectDivs.length; index++) {
                        const projectDiv = projectDivs[index];
                        const projectIdSpan = projectIdSpans[index];
                        const projectNumberSpan = projectNumberSpans[index];
                        const projectNameInput = projectNameInputs[index];
                        const projectLinkInput = projectLinkInputs[index];
                        const projectDescriptionArea = projectDescriptionAreas[index];
                        const deleteBtn = deleteBtns[index];

                        projectDiv.id = "project" + index;
                        projectIdSpan.id = "projectIdSpan" + index;
                        projectNumberSpan.id = "projectNumberSpan" + index;
                        projectNameInput.id = "inputProjectName" + index;
                        projectLinkInput.id = "inputProjectLink" + index;
                        projectDescriptionArea.id = "textareaProjectDescription" + index;
                        projectNumberSpan.textContent = index;
                        // Update function parameters to onClick event in case of user deletes a project from the list between the first and the last
                        deleteBtn.onclick = () => { this.deleteProject(projectIdSpan.textContent, projectNumberSpan.textContent); }
                    }
                    // Remove the last added project number so the count of an array is correct
                    let projectNumbersArray = this.state.ProjectNumbers;
                    projectNumbersArray.pop();
                    this.setState({
                        ProjectNumbers: projectNumbersArray
                    });
                })
                .catch(error => {
                    console.log("Project delete error: " + error.data);
                })
        } else {
            // Remove deleted project div
            let projectsDiv = document.getElementById("projects");
            let projectDiv = document.getElementById("project" + projectNumber);
            projectsDiv.removeChild(projectDiv);
            // Remove last added project number
            let projectNumbersArray = this.state.ProjectNumbers;
            projectNumbersArray.pop();
            this.setState({
                ProjectNumbers: projectNumbersArray
            });
        }
    }

    // Delete a skill and all the projects of that skill
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
                    // Remove a div of the deleted skill
                    let skillsDiv = document.getElementById("skills");
                    let skillDiv = document.getElementById("skill" + number);
                    skillsDiv.removeChild(skillDiv);
                    // Generate new id´s for the elements
                    // Desktop
                    let skillDivs = document.getElementsByClassName("skill");
                    let skillIdSpans = document.getElementsByClassName("spanSkillId");
                    let skillInputs = document.getElementsByClassName("skillInput");
                    let skillLevelInputs = document.getElementsByClassName("inputSkillLevel");
                    let skillLevelPercentSpans = document.getElementsByClassName("spanSkillLevelPercent");
                    let showProjectsBtns = document.getElementsByClassName("showProjectsBtn");
                    let deleteBtns = document.getElementsByClassName("deleteSkillBtn");
                    // Mobile
                    let skillIdSpansMobile = document.getElementsByClassName("spanSkillIdMobile");
                    let skillInputsMobile = document.getElementsByClassName("skillInputMobile");
                    let skillLevelInputsMobile = document.getElementsByClassName("inputSkillLevelMobile");
                    let skillLevelPercentSpansMobile = document.getElementsByClassName("spanSkillLevelPercentMobile");
                    let showProjectsBtnsMobile = document.getElementsByClassName("showProjectsBtnMobile");
                    let deleteBtnsMobile = document.getElementsByClassName("deleteSkillBtnMobile");

                    for (let index = 0; index < skillDivs.length; index++) {
                        // Desktop
                        const skillDiv = skillDivs[index];
                        const skillIdSpan = skillIdSpans[index];
                        const skillInput = skillInputs[index];
                        const skillLevelInput = skillLevelInputs[index];
                        const skillLevelPercentSpan = skillLevelPercentSpans[index];
                        const showProjectsBtn = showProjectsBtns[index];
                        const deleteBtn = deleteBtns[index];
                        // Mobile
                        const skillIdSpanMobile = skillIdSpansMobile[index];
                        const skillInputMobile = skillInputsMobile[index];
                        const skillLevelInputMobile = skillLevelInputsMobile[index];
                        const skillLevelPercentSpanMobile = skillLevelPercentSpansMobile[index];
                        const showProjectsBtnMobile = showProjectsBtnsMobile[index];
                        const deleteBtnMobile = deleteBtnsMobile[index];

                        // Desktop
                        skillDiv.id = "skill" + index;
                        skillIdSpan.id = "spanSkillId" + index;
                        skillInput.id = "skillInput" + index;
                        skillLevelInput.id = "inputSkillLevel" + index;
                        skillLevelPercentSpan.id = "spanSkillLevelPercent" + index;
                        showProjectsBtn.id = "showProjectsBtn" + index;
                        deleteBtn.id = "deleteBtn" + index;
                        // Mobile
                        skillIdSpanMobile.id = "spanSkillIdMobile" + index;
                        skillInputMobile.id = "skillInputMobile" + index;
                        skillLevelInputMobile.id = "inputSkillLevelMobile" + index;
                        skillLevelPercentSpanMobile.id = "spanSkillLevelPercentMobile" + index;
                        showProjectsBtnMobile.id = "showProjectsBtnMobile" + index;
                        deleteBtnMobile.id = "deleteBtnMobile" + index;

                        // Update function parameters to events in case of user deletes a skill from the list between the first and the last
                        // Desktop
                        showProjectsBtn.onclick = () => { this.openProjectsModal(skillIdSpan.textContent, skillInput.value); }
                        deleteBtn.onclick = () => { this.deleteSkill(skillIdSpan.textContent, index); }
                        skillLevelInput.onchange = () => { this.skillLevelToSpan(index); }
                        // Mobile
                        showProjectsBtnMobile.onclick = () => { this.openProjectsModal(skillIdSpanMobile.textContent, skillInputMobile.value); }
                        deleteBtnMobile.onclick = () => { this.deleteSkill(skillIdSpanMobile.textContent, index); }
                        skillLevelInputMobile.onchange = () => { this.skillLevelToSpan(index); }
                    }
                })
                .catch(error => {
                    console.log("Skill delete error: " + error.data);
                })
        } else {
            // Remove a div of the deleted skill
            let skillsAndProjetcsDiv = document.getElementById("skills");
            let skillDiv = document.getElementById("skill" + number);
            skillsAndProjetcsDiv.removeChild(skillDiv);
        }
    }

    // Sets the range input value (skill level) to the span element
    skillLevelToSpan(number) {
        let skillLevelInput = undefined;
        let span = undefined;
        if (window.screen.width > 530) {
            skillLevelInput = document.getElementById("inputSkillLevel" + number);
            span = document.getElementById("spanSkillLevelPercent" + number);
        } else {
            skillLevelInput = document.getElementById("inputSkillLevelMobile" + number);
            span = document.getElementById("spanSkillLevelPercentMobile" + number);
        }
        span.textContent = skillLevelInput.value + " %";
    }

    // Sets the new skill level to the modal windows span tag and to the state variable
    skillLevelToModalSpanAndState(e) {
        let span = document.getElementById("labelSkillLevelPercentModal");
        span.textContent = e.target.value + " %";
        this.setState({
            SkillLevel: e.target.value
        })
    }

    // Appends inputs to the projects div
    addNewProject(project, projectNumber) {
        let projectsDiv = document.getElementById("projects");
        // div's
        let projectDiv = document.createElement("div");
        let inputsDiv = document.createElement("div");
        let inputWrapper = document.createElement("div");
        // inputs
        let inputProjectName = document.createElement("input");
        let inputProjectLink = document.createElement("input");
        let textareaProjectDescription = document.createElement("textarea");
        // Button
        let deleteProjectBtn = document.createElement("button");
        // Spans
        let dotSpan = document.createElement("span");
        let projectIdSpan = document.createElement("span");
        let projectNumberSpan = document.createElement("span");
        let deleteProjectBtnSpan = document.createElement("span");
        // Class/Id
        deleteProjectBtn.className = "deleteProjectBtn";
        deleteProjectBtnSpan.className = "fas fa-trash-alt"
        // If the user is adding a new project (project === null)
        if (project !== null) {
            // Class/Id
            projectDiv.id = "project" + projectNumber;
            projectDiv.className = "projectDiv";
            inputsDiv.className = "inputsDiv";
            inputWrapper.className = "inputWrapper";
            dotSpan.className = "fas fa-ellipsis-v";
            projectIdSpan.id = "projectIdSpan" + projectNumber;
            projectIdSpan.className = "projectIdSpan";
            projectNumberSpan.id = "projectNumberSpan" + projectNumber;
            projectNumberSpan.className = "projectNumberSpan";
            inputProjectName.id = "inputProjectName" + projectNumber;
            inputProjectName.className = "inputProjectName";
            inputProjectLink.id = "inputProjectLink" + projectNumber;
            inputProjectLink.className = "inputProjectLink";
            textareaProjectDescription.id = "textareaProjectDescription" + projectNumber;
            textareaProjectDescription.className = "textareaProjectDescription";
            deleteProjectBtn.id = "deleteProjectBtn" + projectNumber;
            // Content to spans
            projectIdSpan.textContent = project.projectId;
            projectNumberSpan.textContent = projectNumber;
            // Values to inputs
            inputProjectName.value = project.name;
            inputProjectLink.value = project.link;
            textareaProjectDescription.value = project.description;
            // Event to button
            deleteProjectBtn.onclick = () => { this.deleteProject(project.projectId, projectNumber); }
        } else {
            let projectNumbers = this.state.ProjectNumbers;
            let lastProjectNumber = projectNumbers.slice(-1)[0];
            let projectNumber = 0;
            if (lastProjectNumber !== undefined) {
                projectNumber = parseInt(lastProjectNumber) + 1;
            }
            // Class/Id
            projectDiv.id = "project" + projectNumber;
            projectDiv.className = "projectDiv";
            inputsDiv.className = "inputsDiv";
            inputWrapper.className = "inputWrapper";
            dotSpan.className = "fas fa-ellipsis-v";
            projectIdSpan.id = "projectIdSpan" + projectNumber;
            projectIdSpan.className = "projectIdSpan";
            projectNumberSpan.id = "projectNumberSpan" + projectNumber;
            projectNumberSpan.className = "projectNumberSpan";
            inputProjectName.id = "inputProjectName" + projectNumber;
            inputProjectName.className = "inputProjectName";
            inputProjectLink.id = "inputProjectLink" + projectNumber;
            inputProjectLink.className = "inputProjectLink";
            textareaProjectDescription.id = "textareaProjectDescription" + projectNumber;
            textareaProjectDescription.className = "textareaProjectDescription";
            deleteProjectBtn.id = "deleteProjectBtn" + projectNumber;
            // Text (Project ID) to span
            projectIdSpan.textContent = 0;
            projectNumberSpan.textContent = projectNumber;
            // Add values
            inputProjectName.value = "";
            inputProjectLink.value = "";
            textareaProjectDescription.value = "";
            // Event to button
            deleteProjectBtn.onclick = () => { this.deleteProject(undefined, projectNumber); }
        }
        // Attributes
        projectIdSpan.setAttribute("hidden", "hidden");
        projectNumberSpan.setAttribute("hidden", "hidden");
        inputProjectName.setAttribute("type", "text");
        inputProjectName.setAttribute("placeholder", "Name of the project");
        inputProjectLink.setAttribute("type", "url");
        inputProjectLink.setAttribute("placeholder", "Website of the project (https://...)");
        textareaProjectDescription.setAttribute("type", "text");
        textareaProjectDescription.setAttribute("placeholder", "Description of the project");
        deleteProjectBtn.setAttribute("type", "button");
        deleteProjectBtn.setAttribute("title", "Delete the project");
        deleteProjectBtn.setAttribute("style", "outline:none;");
        // Span to button
        deleteProjectBtn.appendChild(deleteProjectBtnSpan);
        // Appends
        projectDiv.appendChild(dotSpan);
        projectDiv.appendChild(projectIdSpan);
        projectDiv.appendChild(projectNumberSpan);
        inputsDiv.appendChild(inputProjectName);
        inputsDiv.appendChild(inputProjectLink);
        inputWrapper.appendChild(inputsDiv)
        inputWrapper.appendChild(textareaProjectDescription)
        projectDiv.appendChild(inputWrapper)
        projectDiv.appendChild(deleteProjectBtn);
        projectsDiv.appendChild(projectDiv);

        this.projectNumbersToState();
    }

    // Gets all projects for the skill from database and sends those to the addNewProject -function
    getProjects(skillId) {
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
                    this.addNewProject(element, index)
                }
            })
            .catch(error => {
                console.log("Projects error: " + error);
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
        if (event.target.id === "saveProjectsModalBtn") {
            this.projectsToDatabase();
        } else {
            this.updatedSkillsToDatabase();
        }
    }

    // Sets the existing project numbers to the state array
    projectNumbersToState() {
        // Get every text content of project number spans to the state
        let projectNumberSpans = document.getElementsByClassName("projectNumberSpan");
        let projectNumberArray = [];
        for (let index = 0; index < projectNumberSpans.length; index++) {
            const element = projectNumberSpans[index];
            projectNumberArray.push(element.textContent)
        }
        this.setState({
            ProjectNumbers: projectNumberArray
        })
    }

    // Posts all the projects for the specific skill to database
    projectsToDatabase() {
        let obj = "";
        // Count of projects
        let projectInputs = document.getElementsByClassName("projectDiv");
        for (let index = 0; index < projectInputs.length; index++) {
            let projectObj = "";
            let projectsArray = [];
            // Right inputs with the index number
            let projectIdSpan = document.getElementsByClassName("projectIdSpan");
            let nameInputs = document.getElementsByClassName("inputProjectName");
            let linkInputs = document.getElementsByClassName("inputProjectLink");
            let descriptionInputs = document.getElementsByClassName("textareaProjectDescription");

            // All projects for the skill to object
            for (let index = 0; index < nameInputs.length; index++) {
                projectObj = {
                    ProjectId: projectIdSpan[index].textContent,
                    Name: nameInputs[index].value,
                    Link: linkInputs[index].value,
                    Description: descriptionInputs[index].value
                };

                // Object to the array
                projectsArray.push(projectObj);
            }

            // Projects to the object
            obj = {
                Projects: projectsArray
            }
        }

        // Settings for the request
        const settings = {
            url: 'https://localhost:5001/api/projects/' + this.state.SkillIdToModal,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: obj
        };

        // Requests
        const projectPost = Axios(settings);

        Promise.all([projectPost])
            .then((response) => {
                if (response[0].status >= 200 && response[0].status < 300) {
                    swal({
                        title: "Great!",
                        text: "The project(s) has saved succesfully!",
                        icon: "success",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                    this.closeProjectsModal();
                } else {
                    console.log(response[0].data);
                    swal({
                        title: "Error occured!",
                        text: "There was a problem saving the project(s)!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "error",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
            })
    }

    // Posts all the skills with a new data to database
    updatedSkillsToDatabase() {
        let skillArray = [];
        // Count of skills
        let skillInputs = document.getElementsByClassName("skillInput");
        // All skills with projects to array
        for (let index = 0; index < skillInputs.length; index++) {
            let skillsObj = "";
            // Right inputs with index number
            let skillNameInput = document.getElementById("skillInput" + [index]);
            let skillLevelInput = document.getElementById("inputSkillLevel" + [index]);
            let skillIdSpan = document.getElementById("spanSkillId" + [index]);

            // Skill name, level and projects to object
            skillsObj = {
                SkillId: skillIdSpan.textContent,
                Skill: skillNameInput.value,
                SkillLevel: skillLevelInput.value
            }

            // Object to array
            skillArray.push(skillsObj);
        }

        // Skills to database
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
                    swal({
                        title: "Great!",
                        text: "The skill(s) has saved succesfully!",
                        icon: "success",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    })
                    .then(() => {
                        window.location.reload();
                    })
                } else {
                    console.log(responses[0].data);
                    swal({
                        title: "Error occured!",
                        text: "There was a problem saving the skill(s)!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                        icon: "error",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    });
                }
            })
    }

    // Clear a div
    clearDiv(id) {
        document.getElementById(id).innerHTML = "";
    }

    // Updated skills from database when a user have added a new one
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

        // Promise
        Promise.all([skillsGet])
            .then((response) => {
                // Clear the skills div
                this.clearDiv("skills");
                // Render the updated skills to the screen
                this.existingSkillsToScreen(response[0].data)
            })
            .catch(errors => {
                console.log("Skills error: " + errors[0]);
            })
    }

    render() {
        return (
            <form id="skillsForm" onSubmit={this.handleSubmit}>
                <Container id="skillsContainer">
                    <Row id="skillsUpperRow">
                        <Col id="skillsCol">
                            <Row id="skillsColUpperRow">
                                <Col id="skillsHeaderCol">
                                    <h4>Skills</h4>
                                    <button id="addNewSkillBtn" type="button" title="Add a new skill" onClick={this.openAddSkillModal}><span className="fas fa-plus"></span></button><br /><br />
                                </Col>
                            </Row>
                            <Row id="skillsColLowerRow">
                                <Col>
                                    <div id="skills"></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row id="skillsLowerRow">
                        <Col className="saveChangesCol">
                            <button id="skillsSaveChangesBtn" className="saveChangesBtn" type="submit"><b>SAVE CHANGES</b></button>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for adding a new skill */}
                <Modal id="addNewSkillModal" show={this.state.ShowAddSkillModal} onHide={this.closeAddSkillModal} centered>
                    <Modal.Header id="addSkillModalHeader" closeButton>
                        <Modal.Title>Add a new skill</Modal.Title>
                    </Modal.Header>
                    <form>
                        <Modal.Body>
                            <b>Skill</b><br />
                            <input type="text" id="skillInput" onChange={this.handleModalSkillChange}></input><br />
                            <b>Skill level</b><br />
                            <input id="inputSkillLevelModal" type="range" min="0" max="100" step="1" defaultValue="0" onChange={this.skillLevelToModalSpanAndState} />
                            <label id="labelSkillLevelPercentModal">0 %</label><br />
                        </Modal.Body>
                        <Modal.Footer id="addSkillModalFooter">
                            <button id="addSkillModalBtn" type="button" onClick={this.addNewSkillToDatabase}>ADD</button>
                            <button id="cancelAddSkillModalBtn" type="button" onClick={this.closeAddSkillModal}>CANCEL</button>
                        </Modal.Footer>
                    </form>
                </Modal>

                {/* Modal window for showing the projects of the skill */}
                <Modal id="projectsModal" show={this.state.ShowProjectsModal} onHide={this.closeProjectsModal} centered>
                    <Modal.Header id="addSkillModalHeader">
                        <Modal.Title id="projectsModalTitle">
                            <label>Projects - {this.state.SkillNameToModal}</label>
                            <button id="addProjectModalBtn" type="button" title="Add a new project" onClick={() => this.addNewProject(null)}>
                                <span className="fas fa-plus"></span>
                            </button>
                        </Modal.Title>
                    </Modal.Header>
                    <form>
                        <Modal.Body>
                            <div id="projects"></div>
                        </Modal.Body>
                        <Modal.Footer id="addSkillModalFooter">
                            <button id="saveProjectsModalBtn" type="button" onClick={this.handleSubmit}>SAVE</button>
                            <button id="cancelProjectsModalBtn" type="button" onClick={this.closeProjectsModal}>CLOSE</button>
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
            Basics: "",
            Emails: "",
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
        this.basicInfoFromDatabase = this.basicInfoFromDatabase.bind(this);
        this.changeBasicCol = this.changeBasicCol.bind(this);
        this.contentToDatabase = this.contentToDatabase.bind(this);
        this.deleteSocialMediaService = this.deleteSocialMediaService.bind(this);
        this.generateNumber = this.generateNumber.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        // If the "first login" -mark exists, the request is not sent
        // If the "first login" -mark & "basics saved" -mark exists, basic info which has saved while the first login, will be fetched from database
        if (this.Auth.getFirstLoginMark() === null) {
            this.addValuesToInputs();
            this.addExistingSocialMediaLinks(this.props.links);
            this.updateStates();
        } else if (this.Auth.getFirstLoginMark() !== null && this.Auth.getBasicsSavedMark() !== null) {
            this.basicInfoFromDatabase();
        } else {
            this.setState({
                Basics: this.props.content,
                Emails: this.props.emails
            }, this.updateStates)
        }
    }

    // Converts a datetime to a date format which is correct to date input field
    convertToDate(date) {
        console.log(date);
        let birthdate = new Date(date);
        let splitted = birthdate.toISOString().split("T")

        return splitted[0];
    }



    // Adds social media links that the user already has
    // Set a number to state depending on an index which is used to identify divs, inputs etc.
    addExistingSocialMediaLinks(links) {
        // Social media selects/link inputs with values
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            this.addNewSocialMediaService(element.linkId, element.serviceId, element.link, index)
            this.setState({
                Number: index
            });
        }
    }

    // Sets values to basicInfo inputs
    addValuesToInputs() {
        if (this.Auth.getBasicsSavedMark() === null) {
            // Values to basic inputs
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
        } else {
            // Values to basic inputs
            document.getElementById("firstnameInput").value = this.state.Basics.firstname
            document.getElementById("lastnameInput").value = this.state.Basics.lastname
            document.getElementById("birthdateInput").value = this.convertToDate(this.state.Basics.birthdate)
            document.getElementById("cityInput").value = this.state.Basics.city
            document.getElementById("countryInput").value = this.state.Basics.country
            document.getElementById("phoneInput").value = this.state.Basics.phonenumber
            document.getElementById("emailIdSpan1").textContent = this.state.Emails[0].emailId
            document.getElementById("email1Input").value = this.state.Emails[0].emailAddress
            document.getElementById("emailIdSpan2").textContent = this.state.Emails[1].emailId
            document.getElementById("email2Input").value = this.state.Emails[1].emailAddress
            document.getElementById("punchlineInput").value = this.state.Basics.punchline
            document.getElementById("basicInput").value = this.state.Basics.basicKnowledge
            document.getElementById("educationInput").value = this.state.Basics.education
            document.getElementById("workHistoryInput").value = this.state.Basics.workHistory
            document.getElementById("languageinput").value = this.state.Basics.languageSkills
        }
    }

    // Appends inputs and buttons to socialMediaServices div
    async addNewSocialMediaService(linkId, serviceId, link, number) {
        // Raises the number -state for one so every new field gets a different class/id
        await this.generateNumber();
        // div
        let socialMediaServicesDiv = document.getElementById("socialMediaServices");
        let serviceDiv = document.createElement("div");
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
        let spanDelete = document.createElement("span");
        // button
        let deleteBtn = document.createElement("button");
        // button attribute
        deleteBtn.setAttribute("type", "button");
        deleteBtn.setAttribute("title", "Delete the service");
        deleteBtn.setAttribute("style", "outline:none;");
        // span attribute
        spanLinkId.setAttribute("hidden", "hidden");
        spanDelete.setAttribute("class", "fas fa-trash-alt");
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
            deleteBtn.className = "deleteSocialMediaBtn";
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
            deleteBtn.className = "deleteSocialMediaBtn";
            // Click event to button
            deleteBtn.onclick = () => { this.deleteSocialMediaService(linkId, this.state.Number); }
            // Values
            spanLinkId.textContent = 0;
            serviceSelect.value = 1;
            inputServiceLink.value = "http://";
        }
        // append textnode to button
        deleteBtn.appendChild(spanDelete);
        // Append elements to div
        serviceDiv.appendChild(spanLinkId);
        // serviceDiv.appendChild(textNodeService);
        serviceDiv.appendChild(serviceSelect);
        // serviceDiv.appendChild(textNodeServiceLink);
        serviceDiv.appendChild(inputServiceLink);
        serviceDiv.appendChild(deleteBtn);
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

    // Sends all the content to database
    contentToDatabase() {
        let emailsArray = [];
        let emailSpans = document.getElementsByClassName("emailIDSpan");
        let emailInputs = document.getElementsByClassName("emailInput");

        for (let index = 0; index < emailSpans.length; index++) {
            let emailObj = "";
            if (emailSpans[index].textContent == null) {
                if (emailInputs[index].value !== "") {
                    emailObj = {
                        EmailAddress: emailInputs[index].value
                    };
                }
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

        const contentSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: contentObj
        };

        const emailsSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/emails/',
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: emailsObj
        };


        const socialMediaSettings = {
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
                swal({
                    title: "Great!",
                    text: "The content has saved succesfully!",
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                })
                .then(() => {
                    if (this.Auth.getFirstLoginMark() === null) {
                        window.location.reload();
                    } else {
                        this.Auth.setBasicsSavedMark();
                    }
                })
            })
            .catch(errors => {
                swal({
                    title: "Error occured!",
                    text: "There was a problem saving the content!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                    icon: "error",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                });
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
        if (this.Auth.getFirstLoginMark()) {
            this.setState({
                Firstname: this.state.Basics.firstname,
                Lastname: this.state.Basics.lastname,
                DateOfBirth: this.convertToDate(this.state.Basics.birthdate),
                City: this.state.Basics.city,
                Country: this.state.Basics.country,
                Phonenumber: this.state.Basics.phonenumber,
                Punchline: this.state.Basics.punchline,
                BasicKnowledge: this.state.Basics.basicKnowledge,
                Education: this.state.Basics.education,
                WorkHistory: this.state.Basics.workHistory,
                LanguageSkills: this.state.Basics.languageSkills
            }, this.addValuesToInputs)
        } else {
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
            }, this.addValuesToInputs)
        }
    }

    // Basic info from database when the first login is on
    basicInfoFromDatabase() {
        let userId = this.props.userId;

        // Settings for requests
        const basicsSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/content/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const emailSettings = {
            url: 'https://localhost:5001/api/portfoliocontent/emails/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        const socialMediaSettings = {
            url: 'https://localhost:5001/api/socialmedia/' + userId,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        // Requests
        const basicsGet = Axios(basicsSettings);
        const emailGet = Axios(emailSettings);
        const socialMediaGet = Axios(socialMediaSettings);

        // Promise
        Promise.all([basicsGet, emailGet, socialMediaGet])
            .then((response) => {
                // Render the updated skills to the screen
                this.setState({
                    Basics: response[0].data[0],
                    Emails: response[1].data
                }, this.updateStates)
                this.addExistingSocialMediaLinks(response[2].data)
            })
            .catch(errors => {
                console.log("Basics error: " + errors);
            })
    }

    changeBasicCol(event) {
        let btnId = event.target.id;
        console.log(btnId);

        switch (btnId) {
            case "personalDotBtn":
                document.getElementById("personalCol").style.display = "block";
                document.getElementById("basicCol").style.display = "none";
                document.getElementById("servicesCol").style.display = "none";
                document.getElementById("personalDotBtn").className = "fas fa-circle";
                document.getElementById("basicDotBtn").className = "far fa-circle";
                document.getElementById("serviceDotBtn").className = "far fa-circle";
                break;

            case "basicDotBtn":
                document.getElementById("personalCol").style.display = "none";
                document.getElementById("basicCol").style.display = "block";
                document.getElementById("servicesCol").style.display = "none";
                document.getElementById("personalDotBtn").className = "far fa-circle";
                document.getElementById("basicDotBtn").className = "fas fa-circle";
                document.getElementById("serviceDotBtn").className = "far fa-circle";
                break;

            case "serviceDotBtn":
                document.getElementById("personalCol").style.display = "none";
                document.getElementById("basicCol").style.display = "none";
                document.getElementById("servicesCol").style.display = "block";
                document.getElementById("personalDotBtn").className = "far fa-circle";
                document.getElementById("basicDotBtn").className = "far fa-circle";
                document.getElementById("serviceDotBtn").className = "fas fa-circle";
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <form id="basicInfoForm" onSubmit={this.handleSubmit}>
                <Container id="basicInfoContainer">
                    <Row id="basicInfoUpperRow">
                        <Col id="personalCol">
                            <h4>Personal</h4>
                            <div id="scrollablePersonalDiv">
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <b>Firstname</b> <br />
                                                <input id="firstnameInput" type="text" onChange={this.handleValueChange} /><br />
                                                <b>Lastname</b> <br />
                                                <input id="lastnameInput" type="text" onChange={this.handleValueChange} /><br />
                                                <b>Date of birth</b> <br />
                                                <input id="birthdateInput" type="date" onChange={this.handleValueChange} /><br />
                                                <b>City</b> <br />
                                                <input id="cityInput" type="text" onChange={this.handleValueChange} /><br />
                                            </Col>
                                            <Col>
                                                <b>Country</b> <br />
                                                <input id="countryInput" type="text" onChange={this.handleValueChange} /><br />
                                                <b>Phonenumber</b> <br />
                                                <input id="phoneInput" type="tel" onChange={this.handleValueChange} /><br />
                                                <span id="emailIdSpan1" className="emailIDSpan" hidden></span>
                                                <b>Email 1</b> <br />
                                                <input id="email1Input" className="emailInput" type="email" onBlur={this.handleValueChange} /><br />
                                                <span id="emailIdSpan2" className="emailIDSpan" hidden></span>
                                                <b>Email 2</b> <br />
                                                <input id="email2Input" className="emailInput" type="email" onBlur={this.handleValueChange} /><br />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Punchline to homepage</b> <br />
                                        <textarea id="punchlineInput" type="text" onChange={this.handleValueChange} /><br />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col id="basicCol">
                            <h4>Basic</h4>
                            <div id="scrollableBasicDiv">
                                <b>Basic Knowledge</b> <br />
                                <textarea id="basicInput" type="text" onChange={this.handleValueChange} /><br />
                                <b>Education</b> <br />
                                <textarea id="educationInput" type="text" onChange={this.handleValueChange} /><br />
                                <b>Work History</b> <br />
                                <textarea id="workHistoryInput" type="text" onChange={this.handleValueChange} /><br />
                                <b>Language Skills</b> <br />
                                <textarea id="languageinput" type="text" onChange={this.handleValueChange} /><br />
                            </div>
                        </Col>
                        <Col id="servicesCol">
                            <Row id="servicesUpperRow">
                                <Col id="servicesHeaderCol">
                                    <h4>Social media services</h4>
                                    <button id="addServiceBtn" type="button" title="Add a new service" onClick={this.addNewSocialMediaService}><span className="fas fa-plus"></span></button>
                                </Col>
                            </Row>
                            <Row id="servicesLowerRow">
                                <Col>
                                    <div id="socialMediaServices"></div>
                                </Col>
                            </Row>
                        </Col>
                        <div id="dotNav">
                            <button className="dotNavBtn" type="button">
                                <span id="personalDotBtn" className="fas fa-circle" onClick={this.changeBasicCol}></span>
                            </button>
                            <button className="dotNavBtn" type="button">
                                <span id="basicDotBtn" className="far fa-circle" onClick={this.changeBasicCol}></span>
                            </button>
                            <button className="dotNavBtn" type="button">
                                <span id="serviceDotBtn" className="far fa-circle" onClick={this.changeBasicCol}></span>
                            </button>
                        </div>
                    </Row>
                    <Row id="basicInfoLowerRow">
                        <Col className="saveChangesCol">
                            <button id="basicsSaveChangesBtn" className="saveChangesBtn" type="submit"><b>SAVE CHANGES</b></button>
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
            PasswordMatch: true,
            PicNameArray: []
        }
        this.changeAccountCol = this.changeAccountCol.bind(this);
        this.checkPasswordSimilarity = this.checkPasswordSimilarity.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.deleteContainerFromAzure = this.deleteContainerFromAzure.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.Auth = new AuthService();
    }

    changeAccountCol(event) {
        let btnId = event.target.id;

        switch (btnId) {
            case "changePasswordDotBtn":
                document.getElementById("changePasswordCol").style.display = "block";
                document.getElementById("deleteAccountCol").style.display = "none";
                document.getElementById("changePasswordDotBtn").className = "fas fa-circle";
                document.getElementById("deleteAccountDotBtn").className = "far fa-circle";
                break;

            case "deleteAccountDotBtn":
                document.getElementById("changePasswordCol").style.display = "none";
                document.getElementById("deleteAccountCol").style.display = "block";
                document.getElementById("changePasswordDotBtn").className = "far fa-circle";
                document.getElementById("deleteAccountDotBtn").className = "fas fa-circle";
                break;

            default:
                break;
        }
    }

    // Checks the similarity of password and confirmed password
    checkPasswordSimilarity() {
        let small = document.getElementById("passwordChangeMatchWarning");
        if (this.state.NewPassword === this.state.ConfirmedNewPassword) {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: true
            });
        } else if (this.state.ConfirmedNewPassword === "" || this.state.NewPassword === "") {
            small.setAttribute("hidden", "hidden");
            this.setState({
                PasswordMatch: false
            });
        } else {
            small.removeAttribute("hidden");
            this.setState({
                PasswordMatch: false
            });
        }
    }

    // Handles all what is needed to delete an account
    deleteAccount() {
        swal({
            title: "Are you sure?",
            text: "Your account and all the content will be deleted.",
            icon: "warning",
            buttons: {
                cancel: {
                    text: "NO",
                    value: false,
                    visible: true
                },
                confirm: {
                    text: "YES",
                    value: true,
                    visible: true
                }
            },
            dangerMode: true
        })
            .then((willDelete) => {
                if (willDelete) {
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
                            this.deleteContainerFromAzure();
                        })
                        .catch(error => {
                            swal({
                                title: "Error occured!",
                                text: "There was a problem deleting the account!\n\rPlease be contacted to the administrator.",
                                icon: "error",
                                buttons: {
                                    confirm: {
                                        text: "OK",
                                        closeModal: true
                                    }
                                }
                            });
                        })
                } else {
                    // Do nothing
                }
            });
    }

    // Deletes the container and all of the blobs in it
    deleteContainerFromAzure() {
        // Variables for URI
        let userId = this.props.userId;
        let sasToken = this.Auth.getSas();
        let uri = "https://webportfolio.blob.core.windows.net/" + userId + "?restype=container&" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'DELETE',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-12-12"
            }
        }

        // Request
        Axios(settings)
            .then(response => {
                console.log("Delete dir status: " + response.status);
                // Remove all the marks from localStorage
                this.Auth.logout();
                this.Auth.removeEditingMark();
                this.Auth.removeFirstLoginMark();
                this.Auth.removeBasicsSavedMark();
                this.Auth.removeSkillsAddedMark();
                this.Auth.removeContainerCreatedMark();

                swal({
                    title: "Thank you!",
                    text: "Your account and all the content has been deleted.\r\nThank you for using the Web Portfolio.",
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                });
                window.location.reload();
            })
            .catch(err => {
                swal({
                    title: "Error occured!",
                    text: "There was a problem deleting the account!\n\rPlease be contacted to the administrator.",
                    icon: "error",
                    buttons: {
                        confirm: {
                            text: "OK",
                            closeModal: true
                        }
                    }
                });
                console.log("Delete dir error status: " + err.response.status);
            })
    }

    // Form submit for updating a password
    handleSubmit(e) {
        e.preventDefault();
        // Check if the new and confirmed password will match
        if (this.state.PasswordMatch) {
            // Get old password straight from the input, so it will not stored anywhere on a clients memory
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
                    swal({
                        title: "Great!",
                        text: "Your password has updated succesfully!",
                        icon: "success",
                        buttons: {
                            confirm: {
                                text: "OK",
                                closeModal: true
                            }
                        }
                    })
                    .then(() => {
                        window.location.reload();
                    })
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        let small = document.getElementById("incorrectOldPasswordWarning");
                        small.removeAttribute("hidden");
                    } else {
                        swal({
                            title: "Error occured!",
                            text: "There was a problem updating the password!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                            icon: "error",
                            buttons: {
                                confirm: {
                                    text: "OK",
                                    closeModal: true
                                }
                            }
                        });
                    }
                })
        } else {
            swal({
                title: "Oops!",
                text: "The new password and the confirmed password do not match.\r\nPlease type the right passwords and try again.",
                icon: "info",
                buttons: {
                    confirm: {
                        text: "OK",
                        closeModal: true
                    }
                }
            });
        }
    }

    handleValueChange(input) {
        // Depending on input field, the right state will be updated
        let inputId = input.target.id;

        switch (inputId) {
            case "oldPasswordInput":
                let small = document.getElementById("incorrectOldPasswordWarning");
                small.setAttribute("hidden", "hidden");
                break;
            case "newPasswordInput":
                if (input.target.value === "") {
                    this.setState({
                        NewPassword: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        NewPassword: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            case "confirmNewPasswordInput":
                if (input.target.value === "") {
                    this.setState({
                        ConfirmedNewPassword: input.target.value
                    }, this.checkPasswordSimilarity);
                } else {
                    this.setState({
                        ConfirmedNewPassword: md5(input.target.value)
                    }, this.checkPasswordSimilarity);
                }
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <Container id="accountContainer">
                <Row id="accountRow">
                    <Col id="changePasswordCol">
                        <form onSubmit={this.handleSubmit}>
                            <h4>Change password</h4>
                            <input id="oldPasswordInput" type="password" placeholder="Old password" onChange={this.handleValueChange} />
                            <small hidden id="incorrectOldPasswordWarning">The old password is incorrect!</small>
                            <input id="newPasswordInput" type="password" placeholder="New password" onChange={this.handleValueChange} />
                            <input id="confirmNewPasswordInput" type="password" placeholder="Confirm new password" onChange={this.handleValueChange} />
                            <small hidden id="passwordChangeMatchWarning">The paswords doesn't match!</small>
                            <button id="changePasswordBtn" type="submit">CHANGE PASSWORD</button>
                        </form>
                    </Col>
                    <Col id="deleteAccountCol">
                        <h4>Delete an account</h4>
                        <button id="deleteAccountBtn" type="button" onClick={this.deleteAccount}>DELETE</button>
                    </Col>
                    <div id="accountDotNav">
                        <button className="accountDotNavBtn" type="button">
                            <span id="changePasswordDotBtn" className="fas fa-circle" onClick={this.changeAccountCol}></span>
                        </button>
                        <button className="accountDotNavBtn" type="button">
                            <span id="deleteAccountDotBtn" className="far fa-circle" onClick={this.changeAccountCol}></span>
                        </button>
                    </div>
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
            SocialMediaLinks: ""
        };
        this.createContainerToAzureBlobStorage = this.createContainerToAzureBlobStorage.bind(this);
        this.defaultImagesToAzure = this.defaultImagesToAzure.bind(this);
        this.getBasicContent = this.getBasicContent.bind(this);
        this.getContent = this.getContent.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleNavSelect = this.handleNavSelect.bind(this);
        this.defaultImageUrlToDatabase = this.defaultImageUrlToDatabase.bind(this);
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let header = document.getElementById("header");
        header.style.backgroundColor = "transparent";
        // re-position a footer
        let footer = document.getElementById("footer");
        if (!footer.classList.contains("absolute")) {
            footer.className = "absolute";
            footer.style.backgroundColor = "transparent";
        }
        footer.classList.remove("darker");
        /*
            If the first login mark exists, the basic content request is sent and the folder will be created to Azure

            If a user reloads the page during the first login, 
            the folder is already created and thats why only the basic content request will be sent.
        */
        if (this.Auth.getFirstLoginMark() !== null && this.Auth.getContainerCreatedMark() === null) {
            const callbackFunctions = () => {
                this.getBasicContent();
                this.createContainerToAzureBlobStorage();
            };
            this.setState({
                Profile: this.Auth.getProfile()
            }, callbackFunctions);
        } else if (this.Auth.getFirstLoginMark() !== null && this.Auth.getContainerCreatedMark() !== null) {
            this.setState({
                Profile: this.Auth.getProfile()
            }, this.getBasicContent);
        } else {
            this.setState({
                Profile: this.Auth.getProfile()
            }, this.getContent);
        }
    }

    // Create a container to Azure Blob Storage for users images
    createContainerToAzureBlobStorage() {
        // Variables for URI
        let userId = this.state.Profile.nameid;
        let sasToken = this.Auth.getSas();
        let uri = "https://webportfolio.blob.core.windows.net/" + userId + "?restype=container&" + sasToken;

        // Settings for axios requests
        const settings = {
            url: uri,
            method: 'PUT',
            headers: {
                "x-ms-date": "now",
                "x-ms-version": "2019-12-12"
            }
        };

        // Create folder request
        Axios(settings)
            .then(response => {
                console.log("Create folder to Azure: " + response.data);
                this.Auth.setContainerCreatedMark();
                this.defaultImagesToAzure();
                this.defaultImageUrlToDatabase();
            })
            .catch(error => {
                console.log("Create folder to Azure error: " + error.response.data);
            })
    }

    // Sets the default images to a new user
    defaultImagesToAzure() {
        let userId = this.state.Profile.nameid;
        let sasToken = this.Auth.getSas();
        let filenameArray = ["profile.png", "home.png", "iam.png", "ican.png", "questbook.png", "contact.png"];
        // Requests to copy the default images from the "default"-container to the new user's container
        for (let index = 0; index < filenameArray.length; index++) {
            const filename = filenameArray[index];

            let uri = "https://webportfolio.blob.core.windows.net/" + userId + "/" + filename + "?" + sasToken;

            // Settings for axios requests
            const settings = {
                url: uri,
                method: 'PUT',
                headers: {
                    "x-ms-date": "now",
                    "x-ms-version": "2019-12-12",
                    "x-ms-copy-source": "https://webportfolio.blob.core.windows.net/default/" + filename + "?" + sasToken
                }
            };

            Axios(settings)
                .then(response => {
                    console.log("Copy the " + filename + "-image to the container: " + response.data);
                })
                .catch(error => {
                    console.log("Copy the " + filename + "-image to the container error: " + error);
                })
        }
    }

    // Get the basic content for edit forms when user has logged in for the first time
    getBasicContent() {
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

        // Requests
        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);

        // Promises
        Promise.all([contentGet, emailGet])
            .then((responses) => {
                this.setState({
                    Content: responses[0].data[0],
                    Emails: responses[1].data,
                });
            })
            .catch(errors => {
                console.log("Content error: " + errors[0]);
                console.log("Email error: " + errors[1]);
            })
    }

    // Get all the content for edit forms
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

        // Requests
        const contentGet = Axios(contentSettings);
        const emailGet = Axios(emailSettings);
        const skillsGet = Axios(skillsSettings);
        const questbookGet = Axios(questbookSettings);
        const socialMediaGet = Axios(socialMediaSettings);

        // Promises
        Promise.all([contentGet, emailGet, skillsGet, questbookGet, socialMediaGet])
            .then((responses) => {
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

    // Controls which form (info/skills/pictures/account) will be rendered
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
            swal({
                title: "Error occured!",
                text: "There was a problem!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                icon: "error",
                buttons: {
                    confirm: {
                        text: "OK",
                        closeModal: true
                    }
                }
            });
        }
    }

    handleNavSelect(select) {
        let selectValue = select.target.value;
        if (selectValue === "basicInfo") {
            this.setState({
                BasicInfoBool: true,
                SkillsBool: false,
                PicturesBool: false,
                AccountBool: false
            });
        } else if (selectValue === "skills") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: true,
                PicturesBool: false,
                AccountBool: false
            });
        } else if (selectValue === "images") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: false,
                PicturesBool: true,
                AccountBool: false
            });
        } else if (selectValue === "account") {
            this.setState({
                BasicInfoBool: false,
                SkillsBool: false,
                PicturesBool: false,
                AccountBool: true
            });
        } else {
            swal({
                title: "Error occured!",
                text: "There was a problem!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                icon: "error",
                buttons: {
                    confirm: {
                        text: "OK",
                        closeModal: true
                    }
                }
            });
        }
    }

    // Sends the default image URLs to the database
    defaultImageUrlToDatabase() {
        let userId = this.state.Profile.nameid;
        let imageObj = {
            Profile: [{
                TypeID: 1,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/profile.png"
            }],
            Home: [{
                TypeID: 2,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/home.png"
            }],
            Iam: [{
                TypeID: 3,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/iam.png"
            }],
            Ican: [{
                TypeID: 4,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/ican.png"
            }],
            Questbook: [{
                TypeID: 5,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/questbook.png"
            }],
            Contact: [{
                TypeID: 6,
                Url: "https://webportfolio.blob.core.windows.net/" + userId + "/contact.png"
            }]
        };

        // Settings for axios requests
        let settings = {
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
                    console.log("Save default URLs: " + response.data);
                } else {
                    console.log("Save default URLs error: " + response.data);
                }
            })
    }

    render() {
        if (this.Auth.getFirstLoginMark() === null) {
            return (
                <main className="editPortfolio">
                    <Container>
                        <Row id="navRow">
                            <Col id="navCol">
                                <button id="basicInfoNavBtn" onClick={this.handleNavClick}>BASIC INFO</button>
                                <button id="skillsNavBtn" onClick={this.handleNavClick}>SKILLS</button>
                                <h3>Edit portfolio</h3>
                                <button id="picturesNavBtn" onClick={this.handleNavClick}>IMAGES</button>
                                <button id="accountNavBtn" onClick={this.handleNavClick}>ACCOUNT</button>
                            </Col>
                            <Col id="navColMobile">
                                <h3>Edit portfolio</h3>
                                <select id="mobileNavSelect" onChange={this.handleNavSelect}>
                                    <option value="basicInfo">Basic info</option>
                                    <option value="skills">Skills</option>
                                    <option value="images">Images</option>
                                    <option value="account">Account</option>
                                </select>
                            </Col>
                        </Row>
                        <Fragment>
                            {/* InfoEdit */}
                            {this.state.BasicInfoBool && this.state.Content && this.state.Emails && this.state.SocialMediaLinks ?
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
                        <Row id="navRow">
                            <Col id="navCol">
                                <button id="basicInfoNavBtn" onClick={this.handleNavClick}>BASIC INFO</button>
                                <button id="skillsNavBtn" onClick={this.handleNavClick}>SKILLS</button>
                                <h3>Edit portfolio</h3>
                                <button id="picturesNavBtn" onClick={this.handleNavClick}>IMAGES</button>
                                <button id="accountNavBtn" onClick={this.handleNavClick}>ACCOUNT</button>
                            </Col>
                            <Col id="navColMobile">
                                <h3>Edit portfolio</h3>
                                <select id="mobileNavSelect" onChange={this.handleNavSelect}>
                                    <option value="basicInfo">Basic info</option>
                                    <option value="skills">Skills</option>
                                    <option value="images">Images</option>
                                    <option value="account">Account</option>
                                </select>
                            </Col>
                        </Row>
                        <Fragment>
                            {/* InfoEdit */}
                            {this.state.BasicInfoBool && this.state.Content && this.state.Emails ?
                                <InfoEdit
                                    userId={this.state.Profile.nameid}
                                    content={this.state.Content}
                                    emails={this.state.Emails}
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
                            {/* AccountEdit */}
                            {this.state.AccountBool ?
                                <AccountEdit
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