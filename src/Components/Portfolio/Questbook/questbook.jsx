import React, { Component } from 'react';
import './questbook.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

class Questbook extends Component {
    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.questbookPicUrl + ")",
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
                            <Button>New message</Button>
                            <table id="messageTbl">
                                <thead>{thead}</thead>
                                <tbody>{tbody}</tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Questbook;