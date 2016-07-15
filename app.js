/* global multiTwitchController, videoController, authController, contactController, aboutController, downloadController, channelController, homeController, authService, page */

(function () {
    var container = '#content';
    var language = 'en';
    var isAuthenticated = authService.isLoggedIn();

    page.auth.setUserDetails(authService.getLoggedInUser());
    page.auth.setAuthTabDetails({title: isAuthenticated ? 'Logout' : 'Login', href: isAuthenticated ? '#/logout' : '#/login'});

    var app = Sammy(container, function () {
        this.get('#/', function () {
            this.redirect('#/home');
        });

        this.get('#/home', function () {
            homeController.init(container, language);
        });

        this.get('#/download', function () {
            downloadController.init(container, language);
        });

        this.get('#/download/:name', function (name) {
            channelController.init(name, container, language);
        });

        this.get('#/live/:channel', function (channel) {
            videoController.live(channel);
        });

        this.get('#/play/:video', function (video) {
            videoController.play(video, language);
        });

        this.get('#/login', function (content) {
            if (authService.isLoggedIn()) {
                this.redirect('#/home');
            } else {
                authController.init(content);
            }
        });

        this.get('#/logout', function () {
            authController.logout(language);
            
            page.auth.setUserDetails(authService.getLoggedInUser());
            page.auth.setAuthTabDetails({title: 'Login', href: '#/login'});

            this.redirect('#/home');
        });

        this.get('#/login/:token', function (token) {
            authController.auth(token, language);

            this.redirect('#/home');
        });

        this.get('#/about', function () {
            aboutController.init(container);
        });

        this.get('#/contact', function () {
            contactController.init(container);
        });

        this.get('#/multitwitch', function () {
            multiTwitchController.init(container, language, null);
        });

        this.get(/\#\/multitwitch\/(.*)/, function (channels) {
            multiTwitchController.init(container, language, channels);
        });

        this.notFound = function () {
            homeController.init(container, language);
        };
    });

    $(function () {
        app.run('#/');
    });
}());