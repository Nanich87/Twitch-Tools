/* global multiTwitchController, videoController, loginController, contactController, aboutController, downloadController, channelController, homeController */

(function () {
    var container = '#content';
    var language = 'en';

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

        this.get('#/login', function () {
            loginController.init(container);
        });

        this.get('#/login/:token', function (token) {
            loginController.auth(token);

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