import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService('https://localhost:5001/');
    return class AuthWrapped extends Component {
        _isMounted = false;

        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentDidMount() {
            this._isMounted = true;
            if (!Auth.loggedIn()) {
                this.props.history.replace('/')
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    if (this._isMounted) {
                        this.setState({
                            user: profile
                        });
                      }
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