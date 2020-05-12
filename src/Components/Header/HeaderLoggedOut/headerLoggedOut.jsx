import React, { Component } from 'react';
import './headerLoggedOut.css';
import { Navbar, Button, Modal } from 'react-bootstrap';

class HeaderLoggedOut extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    render() {
        return (
            <header>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home" className="mr-auto">
                        WebPortfolio
                    </Navbar.Brand>
                    <Button variant="outline-info" onClick={this.open}>Sign In</Button>
                    {/* 
                    <span id="or">or</span>
                    <Button variant="outline-info">Sign Up</Button>
                    */}
                </Navbar>

                <Modal show={this.state.showModal} onHide={this.close} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Text in a modal</h4>
                        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

                        <h4>Popover in a modal</h4>


                        <hr />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </header>
        );
    }
}

export default HeaderLoggedOut;