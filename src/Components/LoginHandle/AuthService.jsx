import decode from 'jwt-decode';

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
            this.setToken(res) // Setting the token in localStorage
            return Promise.resolve(res);
        }).catch(err => {
            console.log("Auth.login: " + err.data);
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
        // localStorage.removeItem('authCheck');
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
        // Retrieves the editing mark from localStorage
        return localStorage.getItem('editing');
    }

    removeEditingMark() {
        // Clear editing from localStorage
        localStorage.removeItem('editing');
    }

    setEditingMark() {
        // Sets a mark for editing to localStorage
        localStorage.setItem('editing', "true");
    }

    getFirstLoginMark() {
        // Retrieves the first login mark from localStorage
        return localStorage.getItem('first_login');
    }

    removeFirstLoginMark() {
        // Clear first login mark from localStorage
        localStorage.removeItem('first_login');
    }

    setFirstLoginMark() {
        // Sets a mark for first login to localStorage
        localStorage.setItem('first_login', "true");
    }

    getBasicsSavedMark() {
        // Retrieves the basics saved mark from localStorage
        return localStorage.getItem('basics_saved');
    }

    removeBasicsSavedMark() {
        // Clear first basics saved from localStorage
        localStorage.removeItem('basics_saved');
    }

    setBasicsSavedMark() {
        // Sets a mark for basics saved to localStorage
        localStorage.setItem('basics_saved', "true");
    }

    getSkillsAddedMark() {
        // Retrieves the basics saved mark from localStorage
        return localStorage.getItem('skills_saved');
    }

    removeSkillsAddedMark() {
        // Clear first basics saved from localStorage
        localStorage.removeItem('skills_saved');
    }

    setSkillsAddedMark() {
        // Sets a mark for basics saved to localStorage
        localStorage.setItem('skills_saved', "true");
    }

    getImagesAddedMark() {
        // Retrieves the basics saved mark from localStorage
        return localStorage.getItem('images_saved');
    }

    removeImagesAddedMark() {
        // Clear first basics saved from localStorage
        localStorage.removeItem('images_saved');
    }

    setImagesAddedMark() {
        // Sets a mark for basics saved to localStorage
        localStorage.setItem('images_saved', "true");
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