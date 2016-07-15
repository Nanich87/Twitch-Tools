/* global page, data, templates, authService, toastr, lang */

var authController = (function () {

    var pageContent;

    function initPage(context) {
        if (authService.isLoggedIn()) {
            pageContent = {
                pageTitle: 'Twitch Tools: Logout',
                sectionTitle: 'Twitch Logout',
                buttonUrl: '#/logout',
                buttonText: 'Logout'
            };
        } else {
            pageContent = {
                pageTitle: 'Twitch Tools: Login',
                sectionTitle: 'Twitch Login',
                buttonUrl: 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&amp;client_id=3wuf1bklpm8iwtm926sccpp53m8m1nr&amp;redirect_uri=http://twitchtools.sixeightone.eu/login.php&amp;scope=user_follows_edit',
                buttonText: 'Twitch Connect'
            };
        }

        page.title.set(pageContent.pageTitle);
        page.nav.active(5);

        templates.get('auth')
                .then(function (template) {
                    context.$element().html(template(pageContent));
                });
    }

    function auth(context, language) {
        var access_token = context.params.token || null;

        if (access_token !== null) {
            data.user.auth(access_token)
                    .then(function (response) {
                        authService.loginUser(response.token.user_name, access_token);
                
                        page.auth.setUserDetails(response.token.user_name);
                        page.auth.setAuthTabDetails({title: 'Logout', href: '#/logout'});
                        
                        toastr.success(lang.auth.login.success[language]);
                    });
        }
    }

    function logout(language) {
        authService.logoutUser();
        
        toastr.success(lang.auth.logout.success[language]);
    }

    return {
        init: initPage,
        auth: auth,
        logout: logout
    };
}());