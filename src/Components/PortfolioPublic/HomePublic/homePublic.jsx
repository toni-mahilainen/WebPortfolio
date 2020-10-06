import React, { Component } from 'react';
import './homePublic.css';
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {
    constructor() {
        super();
        this.generateMultilinePunchline = this.generateMultilinePunchline.bind(this);
    }

    componentDidMount() {
        this.generateMultilinePunchline();
    }

    // Divide the ppunchline to the seperate lines based on how the user has wrapped it in the Edit Portfolio
    generateMultilinePunchline() {
        let h1 = document.createElement("h1");
        // Splitted for "line feed"
        let punchlineArray = this.props.punchline.split("\n");
        for (let index = 0; index < punchlineArray.length; index++) {
            const element = punchlineArray[index];
            let textNode = document.createTextNode(element);
            let br = document.createElement("br");
            h1.appendChild(textNode)
            h1.appendChild(br)
        };
        document.getElementById("punchlineDiv").appendChild(h1);
    }

    render() {
        let background = {
            backgroundImage: "url(" + this.props.homePicUrl + ")"
        };
        
        return (
            <section id="home" className="home" style={background} >
                <Container>
                    <Row>
                        <Col>
                            <div id="punchlineDiv"></div>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Home;