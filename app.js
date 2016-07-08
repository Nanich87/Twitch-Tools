/* global controller */

(function () {
    var container = '#content';
    controller.init(container);

    var app = Sammy(container, function () {
        this.get('#/', function () {
            this.redirect('#/home');
        });

        this.get('#/home', function () {
            controller.home();
        });

        this.get('#/download', function () {
            controller.download();
        });

        this.get('#/download/:name', function (name) {
            controller.profile(name);
        });

        this.get('#/live/:channel', function (channel) {
            controller.live(channel);
        });

        this.get('#/play/:video', function (video) {
            controller.play(video);
        });

        this.get('#/login', function () {
            controller.login();
        });
        
        this.get('#/login/:token', function (token) {
            controller.auth(token);
            this.redirect('#/home');
        });

        this.get('#/about', function () {
            controller.about();
        });

        this.get('#/contact', function () {
            controller.contact();
        });
        
        this.get('#/multitwitch', function () {
            controller.multitwitch(null);
        });
        
        this.get(/\#\/multitwitch\/(.*)/, function (channels) {
            controller.multitwitch(channels);
        });

        this.notFound = function () {
            controller.home();
        };
    });

    $(function () {
        app.run('#/');
    });
}());