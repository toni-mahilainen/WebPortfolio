import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService('https://localhost:5001/');
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/')
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    this.setState({
                        user: profile
                    })
                    this.props.history.replace('/portfolio')
                }
                catch (err) {
                    Auth.logout()
                    this.props.history.replace('/')
                }
            }
        }

        render() {
            return (
                <AuthComponent history={this.props.history} user={this.state.user} />
            )
        }
    }
}