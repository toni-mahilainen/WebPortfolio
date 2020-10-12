import decode from 'jwt-decode';
import swal from 'sweetalert';

export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'https://localhost:5001' // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(username, password) {
        // Get a token from api server using the fetch api
        return this.fetch(`https://localhost:5001/api/user/check`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            this.setToken(res.split("|")[0]) // Setting the JWT token in localStorage
            this.setSas(res.split("|")[1].replace("?","")) // Setting the SAS token in localStorage
            return Promise.resolve(res);
        }).catch(err => {
            console.log("Auth.login: " + err);
            swal({
                title: "Error occured!",
                text: "There was a problem trying to sign in!\n\rRefresh the page and try to sign in again.\n\rIf the problem does not dissappear please be contacted to the administrator.",
                icon: "error",
                buttons: {
                    confirm: {
                        text: "OK",
                        closeModal: true
                    }
                }
            })
            .then(() => {
                window.location.reload();
            })
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // Getting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (Date.now() / 1000 > decoded.exp) { // Checking if token is expired.
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    setSas(sas) {
        // Saves user token to localStorage
        localStorage.setItem('azure_sas', sas)
    }

    getSas() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('azure_sas');
    }

    removeSas() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('azure_sas');
    }

    setJustWatchingMark(username, userId) {
        // Saves the "just watching" -mark and user ID to localStorage
        localStorage.setItem('just_watching', username)
        localStorage.setItem('user_id', userId)
    }

    getJustWatchingMark() {
        // Retrieves the "just watching" -mark from localStorage
        return localStorage.getItem('just_watching');
    }

    removeJustWatchingMark() {
        // Clear the "just watching" -mark from localStorage
        localStorage.removeItem('just_watching');
    }

    getUserId() {
        // Retrieves the user ID from localStorage
        return localStorage.getItem('user_id');
    }

    removeUserId() {
        // Retrieves the user ID from localStorage
        localStorage.removeItem('user_id');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        if (this.getToken() !== null) {
            let decoded = decode(this.getToken());
            return decoded
        } else {
            return null;
        }
    }

    getEditingMark() {
        // Retrieves the editing mark from sessionStorage
        return sessionStorage.getItem('editing');
    }

    removeEditingMark() {
        // Clear the editing mark from sessionStorage
        sessionStorage.removeItem('editing');
    }

    setEditingMark() {
        // Sets a mark for editing to sessionStorage
        sessionStorage.setItem('editing', "true");
    }

    getFirstLoginMark() {
        // Retrieves the first login mark from sessionStorage
        return sessionStorage.getItem('first_login');
    }

    removeFirstLoginMark() {
        // Clear the first login mark from sessionStorage
        sessionStorage.removeItem('first_login');
    }

    setFirstLoginMark() {
        // Sets a mark for first login to sessionStorage
        sessionStorage.setItem('first_login', "true");
    }

    getBasicsSavedMark() {
        // Retrieves the basics saved mark from sessionStorage
        return sessionStorage.getItem('basics_saved');
    }

    removeBasicsSavedMark() {
        // Clear the basics saved mark from sessionStorage
        sessionStorage.removeItem('basics_saved');
    }

    setBasicsSavedMark() {
        // Sets a mark for basics saved to sessionStorage
        sessionStorage.setItem('basics_saved', "true");
    }

    getSkillsAddedMark() {
        // Retrieves the skills added mark from sessionStorage
        return sessionStorage.getItem('skills_saved');
    }

    removeSkillsAddedMark() {
        // Clear the skills added mark from sessionStorage
        sessionStorage.removeItem('skills_saved');
    }

    setSkillsAddedMark() {
        // Sets a mark for skills added to sessionStorage
        sessionStorage.setItem('skills_saved', "true");
    }

    getContainerCreatedMark() {
        // Retrieves the folder created mark from localStorage
        return localStorage.getItem('container_created');
    }

    removeContainerCreatedMark() {
        // Clear the folder created mark from localStorage
        localStorage.removeItem('container_created');
    }

    setContainerCreatedMark() {
        // Sets a mark for folder created to localStorage
        localStorage.setItem('container_created', "true");
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }
        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}