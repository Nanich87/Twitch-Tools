/* global page, data */

var loginController = (function () {

    var pageTitle = 'Twitch Tools: Login';
    var pageTemplate = '../resources/views/pages/login.html';

    function initPage(container) {
        page.title.set(pageTitle);

        page.nav.active(5);

        $(container).load(pageTemplate, function () {

        });
    }

    function auth(contex) {
        var access_token = contex.params.token || null;
        
        if (access_token !== null) {
            data.user.auth(access_token)
                    .then(function (response) {
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('username', response.token.user_name);
                    });
        }
    }

    return {
        init: initPage,
        auth: auth
    };
}());