import React, { Component } from 'react';
import './headerLoggedIn.css';
import { Navbar, Button, Nav } from 'react-bootstrap';

class HeaderLoggedIn extends Component {
    render() {
        return (
            <header>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home" className="mr-auto">
                        WebPortfolio
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link href="#home">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#iAm">I Am</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#iCan">I Can</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#questbook">Questbook</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Button variant="outline-info">Edit Portfolio</Button>
                    <span id="or">or</span>
                    <Button variant="outline-info">Log Out</Button>
                </Navbar>
            </header>
        );
    }
}

export default HeaderLoggedIn;