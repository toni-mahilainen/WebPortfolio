import React, { Component } from 'react';
import './headerLoggedOut.css';
import { Navbar, Button } from 'react-bootstrap';

class HeaderLoggedOut extends Component {
    render() {
        return (
            <header>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home" className="mr-auto">
                        WebPortfolio
                    </Navbar.Brand>
                    <Button variant="outline-info">Sign In</Button>
                    {/* 
                    <span id="or">or</span>
                    <Button variant="outline-info">Sign Up</Button>
                    */}
                </Navbar>
            </header>
        );
    }
}

export default HeaderLoggedOut;