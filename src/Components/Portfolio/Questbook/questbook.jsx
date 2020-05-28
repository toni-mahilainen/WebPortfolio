import React, { Component } from 'react';
import './questbook.css';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Axios from 'axios';

class Questbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Firstname: "",
            Lastname: "",
            Company: "",
            Message: "",
            ShowModal: false
        }
        this.closeNewMessageModal = this.closeNewMessageModal.bind(this);
        this.contentToDatabase = this.contentToDatabase.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.openNewMessageModal = this.openNewMessageModal.bind(this);
    }

    // Close modal window  for adding a new message
    closeNewMessageModal() {
        this.setState({
            ShowModal: false
        });
    }

    handleValueChange(e) {
        let input = e.target.id;

        switch (input) {
            case "firstnameInput":
                this.setState({
                    Firstname: e.target.value
                })
                break;

            case "lastnameInput":
                this.setState({
                    Lastname: e.target.value
                })
                break;

            case "companyInput":
                this.setState({
                    Company: e.target.value
                })
                break;

            case "messageInput":
                this.setState({
                    Message: e.target.value
                })
                break;

            default:
                break;
        }
    }

    handleSubmit(e) {
        this.contentToDatabase();
    }

    contentToDatabase() {
        // Timestamp to message
        let now = Date.now();
        let timestamp = new Date(now);

        const messageObj = {
            VisitorFirstname: this.state.Firstname,
            VisitorLastname: this.state.Lastname,
            VisitorCompany: this.state.Company,
            Message: this.state.Message,
            VisitationTimestamp: timestamp.toISOString()
        }

        const settings = {
            url: 'https://localhost:5001/api/questbook/' + this.props.userId,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: messageObj
        };

        Axios(settings)
            .then((response) => {
                console.log("Message: " + response.status);
                alert("Message has sent succesfully to portfolio!");
            })
            .catch(error => {
                console.log("Message error: " + error.data);
                alert("Problems!!")
            })
    }

    // Open modal window for adding a new message
    openNewMessageModal() {
        this.setState({
            ShowModal: true
        });
    }

    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.questbookPicUrl + ")",
            // background: this.props.questbookPicUrl,
            backgroundSize: "100 % 100 %"
        }

        // Headers for table
        let thead = <tr>
            <th>Visitor name</th>
            <th>Visitor company</th>
            <th>Date/Time</th>
            <th>Message</th>
            <th>Delete message</th>
        </tr>;

        // Body for table
        let tbody = [];
        if (this.props.messages.length > 0) {
            for (let index = 0; index < this.props.messages.length; index++) {
                const element = this.props.messages[index];

                tbody.push(
                    <tr key={element.messageId}>
                        <td>{element.firstname + " " + element.lastname}</td>
                        <td>{element.company}</td>
                        <td>{element.visitationTimestamp}</td>
                        <td>{element.message}</td>
                        <td>
                            <Button id="removeBtn">
                                <span className="fas fa-trash-alt"></span>
                            </Button>
                        </td>
                    </tr>
                );
            }
        }

        return (
            <section className="questbook" style={background}>
                <Container>
                    <Row>
                        <Col>
                            <Button onClick={this.openNewMessageModal}>New message</Button>
                            <table id="messageTbl">
                                <thead>{thead}</thead>
                                <tbody>{tbody}</tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>

                {/* Modal window for adding a new skill */}
                <Modal show={this.state.ShowModal} onHide={this.closeNewMessageModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New message</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            Firstname<br />
                            <input type="text" id="firstnameInput" className="questbookMessageInput" onChange={this.handleValueChange}></input><br />
                            Lastname<br />
                            <input type="text" id="lastnameInput" className="questbookMessageInput" onChange={this.handleValueChange}></input><br />
                            Company<br />
                            <input type="text" id="companyInput" className="questbookMessageInput" onChange={this.handleValueChange}></input><br />
                            Message<br />
                            <textarea type="text" id="messageInput" className="questbookMessageInput" onChange={this.handleValueChange}></textarea><br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit">Send</Button>
                            <Button type="button" onClick={this.closeNewMessageModal}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </section>
        );
    }
}

export default Questbook;