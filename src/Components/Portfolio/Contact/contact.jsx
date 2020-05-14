import React, { Component } from 'react';
import './contact.css';
import { Container, Row, Col } from 'react-bootstrap';

class Contact extends Component {
    render() {
        return (
            <section className="contact">
                <Container>
                    <Row>
                        <Col>
                            <h2>Contact me with email...</h2>
                            <form onSubmit={this.handleSubmit}>
                                Name<br />
                                <input type="text" className="contactInput" id="contactNameInput" onChange={this.handleChangeInput}></input><br />
                                Email<br />
                                <input type="text" className="contactInput" id="contactEmailInput" onChange={this.handleChangeInput}></input><br />
                                Subject<br />
                                <input type="text" className="contactInput" id="contactSubjectInput" onChange={this.handleChangeInput}></input><br />
                                Message<br />
                                <textarea type="text" className="contactInput" id="contactMessageInput" onChange={this.handleChangeInput}></textarea><br />
                                <button type="submit">Submit</button>
                            </form>
                        </Col>
                        <Col>
                            <h2>...or in social media</h2>
                            <ul>
                                <li>{this.props.links}</li>
                                {/* Linkit some palveluihin rakennetaan js:llä */}
                                <li><a href="https://www.linkedin.com/in/toni-mahilainen-a56b1b157/" target="_blank" rel="noopener noreferrer"><span className="fab fa-linkedin"></span></a></li>
                                <li><a href="https://github.com/point-toni-mahilainen" target="_blank" rel="noopener noreferrer"><span className="fab fa-github"></span></a></li>
                                <li><a href="https://www.facebook.com/toni.mahilainen" target="_blank" rel="noopener noreferrer"><span className="fab fa-facebook"></span></a></li>
                                <li><a href="https://www.instagram.com/toni_mahilainen/" target="_blank" rel="noopener noreferrer"><span className="fab fa-instagram"></span></a></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}

export default Contact;