import React, { Component, Fragment } from 'react';
import './frontpage.css';
import Main from '../Main/main';
import HeaderLoggedOut from '../Header/HeaderLoggedOut/headerLoggedOut';
import Footer from '../Footer/footer';
// import AuthService from '../LoginHandle/AuthService';
// const Auth = new AuthService();

class Frontpage extends Component {
    render() {
        return (
            <Fragment>
                <HeaderLoggedOut />
                <Main />
                <Footer />
            </Fragment>
        )

        // // If logged in, portfolio is rendered
        // if (Auth.loggedIn()) {
        //     return (
        //         <Portfolio />
        //     );
        // } else {
        //     return (
        //         <Fragment>
        //             <HeaderLoggedOut />
        //             <Main />
        //             <Footer />
        //         </Fragment>
        //     );
        // }
    }
}

export default Frontpage;