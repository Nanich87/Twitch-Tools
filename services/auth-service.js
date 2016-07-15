var authService = (function () {
    
    function isLoggedIn() {
        if (localStorage.getItem('access_token') === null || localStorage.getItem('username') === null) {
            return false;
        }

        return true;
    }

    function getLoggedInUser() {
        return isLoggedIn() ? localStorage.getItem('username') : 'Guest';
    }

    function loginUser(username, accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('username', username);
    }
    
    function logoutUser(){
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
    }

    return {
        isLoggedIn: isLoggedIn,
        loginUser: loginUser,
        getLoggedInUser: getLoggedInUser,
        logoutUser: logoutUser
    };
}());