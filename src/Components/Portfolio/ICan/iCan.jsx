import React, { Component } from 'react';
import './iCan.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Axios from 'axios';

class ICan extends Component {
    constructor(props) {
        super(props);
        this.generateProjetsTableHead = this.generateProjetsTableHead.bind(this);
        this.generateProjetsTableBody = this.generateProjetsTableBody.bind(this);
        this.generateSkillLevelTable = this.generateSkillLevelTable.bind(this);
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

    getProjects(skillId, skillLevel) {
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
                let projectsTbl = document.getElementById("projectsTbl");
                let skillLevelTbl = document.getElementById("skillLevelTbl");
                console.log("Projects data: " + response.data);
                this.generateSkillLevelTable(skillLevelTbl, skillLevel)
                this.generateProjetsTableHead(projectsTbl);
                this.generateProjetsTableBody(projectsTbl, response.data)
            })
            .catch(error => {
                console.log("Projects error: " + error.data);
            })
    }

    render() {
        // Background styling object
        const background = {
            background: "url(" + this.props.icanPicUrl + ")",
            backgroundSize: "100 % 100 %"
        }

        // Body for table
        let tbody = [];
        if (this.props.skills.length > 0) {
            for (let index = 0; index < this.props.skills.length; index++) {
                const element = this.props.skills[index];
                tbody.push(
                    <tr key={element.skillId}>
                        <td>
                            <Button id="skillBtn" onClick={this.getProjects.bind(this, element.skillId, element.skillLevel)}>
                                {element.skill}
                            </Button>
                        </td>
                    </tr>
                );
            }
        }
        return (
            <section className="iCan" style={background}>
                <Container>
                    <Row>
                        <Col>
                            <h4>Skills</h4>
                            <table>
                                <tbody>
                                    {tbody}
                                </tbody>
                            </table>
                        </Col>
                        <Col>
                            <table id="skillLevelTbl"></table>
                            <table id="projectsTbl"></table>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default ICan;