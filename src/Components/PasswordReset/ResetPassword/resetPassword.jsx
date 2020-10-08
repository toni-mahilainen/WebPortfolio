import React, { Component } from 'react';
import './resetPassword.css';

class ResetPassword extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        console.log("ResetPassword");
        console.log(this.props.location.pathname.split("/resetpassword/")[1]);
    }

    render() {
        return (
            <main className="forgotPassword">
                <h1>Testi</h1>
            </main>
        )
    }
}

export default ResetPassword;