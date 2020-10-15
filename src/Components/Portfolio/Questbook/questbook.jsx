import React, { Component } from 'react';
import './questbook.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';
import swal from 'sweetalert';
import VisibilitySensor from "react-visibility-sensor";
import LoadingCircle from '../../../Images/loading_rotating.png';
import LoadingText from '../../../Images/loading_text.png';

class Questbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Firstname: "",
            Lastname: "",
            Company: "",
            Message: "",
            ShowMessageDetailsModal: false,
            ShowLoadingModal: false,
            NameForModal: "",
            CompanyForModal: "",
            TimestampForModal: "",
            MessageForModal: ""
        }
        this.closeLoadingModal = this.closeLoadingModal.bind(this);
        this.closeMessageDetailsModal = this.closeMessageDetailsModal.bind(this);
        this.convertDate = this.convertDate.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.generateMultilineMessage = this.generateMultilineMessage.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.openLoadingModal = this.openLoadingModal.bind(this);
        this.openMessageDetailsModal = this.openMessageDetailsModal.bind(this);
        this.visibilitySensorOnChange = this.visibilitySensorOnChange.bind(this);
    }

    closeLoadingModal() {
        this.setState({
            ShowLoadingModal: false
        });
    }

    openLoadingModal() {
        this.setState({
            ShowLoadingModal: true
        });
    }

    // Close the modal window for message details (mobile)
    closeMessageDetailsModal() {
        this.setState({
            ShowMessageDetailsModal: false
        });
    }

    // Converts timestamp to different datetime format
    convertDate(date) {
        // Convert datetime to date format
        let datetime = new Date(date + 'Z');
        let formatedDate = datetime.toLocaleDateString('fi-FI', {
            day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
        });
        return formatedDate;
    }

    // Delete message from database
    deleteMessage(e) {
        let buttonId = e.target.id;
        swal({
            title: "Are you sure?",
            text: "The message will be deleted from your guestbook?",
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
                    this.openLoadingModal();
                    // Message ID from the tables hidden column
                    let buttonIdLength = buttonId.length;
                    let number = buttonId.slice(9, buttonIdLength)
                    let messageId = document.getElementById("tdMessageId" + number).textContent;

                    // Settings for request
                    const settings = {
                        url: 'https://webportfolioapi.azurewebsites.net/api/questbook/' + messageId,
                        method: 'DELETE',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        }
                    };

                    // Request
                    Axios(settings)
                        .then((response) => {
                            console.log("Message delete: " + response.data);
                            this.closeLoadingModal();
                            swal({
                                title: "Great!",
                                text: "The message has deleted succesfully!",
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
                            console.log("Message delete error: " + error.data);
                            this.closeLoadingModal();
                            swal({
                                title: "Error occured!",
                                text: "There was a problem deleting the message!\n\rRefresh the page and try again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
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

    // Divide the message to the paragraphs based on how the visitor has wrapped it in the new message textarea
    generateMultilineMessage() {
        let p = document.createElement("p");
        // Splitted for "line feed"
        let descriptionArray = this.state.MessageForModal.split("\n");
        for (let index = 0; index < descriptionArray.length; index++) {
            const element = descriptionArray[index];
            let textNode = document.createTextNode(element);
            let br = document.createElement("br");
            p.appendChild(textNode)
            p.appendChild(br)
        };

        document.getElementById("modalMssageDiv").appendChild(p);
    }

    // Sets the modal window input values to the states
    handleValueChange(e) {
        let input = e.target.id;

        // Depending on input, update the right state
        switch (input) {
            case "questFirstnameInput":
                this.setState({
                    Firstname: e.target.value
                })
                break;

            case "questLastnameInput":
                this.setState({
                    Lastname: e.target.value
                })
                break;

            case "questCompanyInput":
                this.setState({
                    Company: e.target.value
                })
                break;

            case "questMessageTextarea":
                this.setState({
                    Message: e.target.value
                })
                break;

            default:
                break;
        }
    }

    // Open the modal window for message details (mobile)
    openMessageDetailsModal(name, company, timestamp, message) {
        this.setState({
            NameForModal: name,
            CompanyForModal: company,
            TimestampForModal: timestamp,
            MessageForModal: message,
            ShowMessageDetailsModal: true
        }, this.generateMultilineMessage);
    }

    visibilitySensorOnChange(isVisible) {
        let a = document.getElementById("navLinkQuestbook");
        isVisible ? a.classList.add("active") : a.classList.remove("active");
    }

    render() {
        let background = {
            backgroundImage: "url(" + this.props.questbookPicUrl + ")"
        };

        // Headers for table
        // showDetailsBtnTh and showDetailsBtnTd are for the small devices
        let thead = <tr>
            <th hidden></th>
            <th>Visitor's name</th>
            <th id="companyTh">Visitor's company</th>
            <th id="datetimeTh">Date/Time</th>
            <th id="messageTh">Message</th>
            <th id="showDetailsBtnTh">Details</th>
            <th id="deleteBtnTh">Delete</th>
        </tr>;

        // Body for table
        let tbody = [];
        if (this.props.messages.length > 0) {
            for (let index = 0; index < this.props.messages.length; index++) {
                const element = this.props.messages[index];
                // Generate ID for the "message ID"-td and the "delete"-button with running number
                let tdId = "tdMessageId" + index;
                let buttonId = "removeBtn" + index;
                let name = element.firstname + " " + element.lastname;
                let company = element.company;
                let timestamp = this.convertDate(element.visitationTimestamp);
                let message = element.message;
                tbody.push(
                    <tr key={element.messageId}>
                        <td id={tdId} hidden>{element.messageId}</td>
                        <td>{name}</td>
                        <td className="companyTd">{company}</td>
                        <td className="datetimeTd">{timestamp}</td>
                        <td className="messageTd">{message}</td>
                        <td className="showDetailsBtnTd">
                            <button className="removeBtn">
                                <span id={buttonId} className="fas fa-eye" onClick={() => { this.openMessageDetailsModal(name, company, timestamp, message) }}></span>
                            </button>
                        </td>
                        <td className="deleteBtnTd">
                            <button className="removeBtn">
                                <span id={buttonId} className="fas fa-trash-alt" onClick={this.deleteMessage}></span>
                            </button>
                        </td>
                    </tr>
                );
            }
        }

        return (
            <VisibilitySensor onChange={this.visibilitySensorOnChange} partialVisibility offset={{ top: 350, bottom: 350 }}>
                <section id="questbook" className="questbook" style={background}>
                    <Container>
                        <Row>
                            <Col id="questbookCol">
                                <table id="messageTbl">
                                    <thead>{thead}</thead>
                                    <tbody id="messageTblScrollableTbody" title="Scroll down to see all the messages">{tbody}</tbody>
                                </table>
                            </Col>
                        </Row>
                    </Container>

                    {/* Modal window for message details */}
                    <Modal id="messageDetailsModal" show={this.state.ShowMessageDetailsModal} onHide={this.closeMessageDetailsModal} centered>
                        <div id="messageDetailsModalWrapper">
                            <button id="upperCloseMessageDetailsModalBtn" type="button">
                                <span className="fas fa-times-circle" onClick={this.closeMessageDetailsModal}></span>
                            </button>
                            <Modal.Header>
                                <Modal.Title>
                                    <div id="modalVisitorNameDiv">
                                        {this.state.NameForModal}
                                    </div>
                                </Modal.Title>
                            </Modal.Header>
                            <form>
                                <Modal.Body>
                                    <div id="modalCompanyDiv">
                                        <h4>Visitor's company</h4>
                                        <p>{this.state.CompanyForModal}</p>
                                    </div>
                                </Modal.Body>
                                <Modal.Body>
                                    <div id="modalTimestampDiv">
                                        <h4>Date/Time</h4>
                                        <p>{this.state.TimestampForModal}</p>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div id="modalMssageDiv">
                                        <h4>Message</h4>
                                    </div>
                                </Modal.Footer>
                            </form>
                            <button id="lowerCloseMessageDetailsModalBtn" type="button">
                                <span className="fas fa-times-circle" onClick={this.closeMessageDetailsModal}></span>
                            </button>
                        </div>
                    </Modal>

                    {/* Modal window for loading sign */}
                    <Modal id="loadingModal" show={this.state.ShowLoadingModal} onHide={this.closeLoadingModal}>
                        <Modal.Body>
                            <img id="loadingCircleImg" src={LoadingCircle} alt="" />
                            <img src={LoadingText} alt="" />
                        </Modal.Body>
                    </Modal>
                </section>
            </VisibilitySensor>
        );
    }
}

export default Questbook;