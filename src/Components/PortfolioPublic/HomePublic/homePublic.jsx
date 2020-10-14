import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VisibilitySensor from "react-visibility-sensor";

class Home extends Component {
    constructor() {
        super();
        this.generateMultilinePunchline = this.generateMultilinePunchline.bind(this);
        this.visibilitySensorOnChange = this.visibilitySensorOnChange.bind(this);
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

    visibilitySensorOnChange(isVisible) {
        let a = document.getElementById("navLinkHome");
        isVisible ? a.classList.add("active") : a.classList.remove("active");
    }

    render() {
        let background = {
            backgroundImage: "url(" + this.props.homePicUrl + ")"
        };

        return (
            <VisibilitySensor onChange={this.visibilitySensorOnChange} partialVisibility offset={{ top: 350, bottom: 350 }}>
                <section id="home" className="home" style={background} >
                    <Container>
                        <Row>
                            <Col>
                                <div id="punchlineDiv"></div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </VisibilitySensor>
        );
    }
}

export default Home;