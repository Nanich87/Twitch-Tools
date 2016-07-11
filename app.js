/* global pageController, multiTwitchController */

(function () {
    var container = '#content';
    var language = 'en';
    
    pageController.init(container);

    var app = Sammy(container, function () {
        this.get('#/', function () {
            this.redirect('#/home');
        });

        this.get('#/home', function () {
            pageController.home();
        });

        this.get('#/download', function () {
            pageController.download();
        });

        this.get('#/download/:name', function (name) {
            pageController.profile(name);
        });

        this.get('#/live/:channel', function (channel) {
            pageController.live(channel);
        });

        this.get('#/play/:video', function (video) {
            pageController.play(video);
        });

        this.get('#/login', function () {
            pageController.login();
        });

        this.get('#/login/:token', function (token) {
            pageController.auth(token);
            this.redirect('#/home');
        });

        this.get('#/about', function () {
            pageController.about();
        });

        this.get('#/contact', function () {
            pageController.contact();
        });

        this.get('#/multitwitch', function () {
            multiTwitchController.init(container, language, null);
        });

        this.get(/\#\/multitwitch\/(.*)/, function (channels) {
            multiTwitchController.init(container, language, channels);
        });

        this.notFound = function () {
            pageController.home();
        };
    });

    $(function () {
        app.run('#/');
    });
}());