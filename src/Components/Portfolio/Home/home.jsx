import React, { Component } from 'react';
import './home.css';
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {
    constructor() {
        super();
        this.generateMultilinePunchline = this.generateMultilinePunchline.bind(this);
    }

    componentDidMount() {
        this.generateMultilinePunchline();
    }

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
        // Background styling object
        const background = {
            background: "url(" + this.props.homePicUrl + ")",
            backgroundSize: "100% 100%"
        }

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