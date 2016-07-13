/* global page */

var aboutController = (function () {

    var pageTitle = 'Twitch Tools: About';
    var pageTemplate = '../resources/views/pages/about.html';

    function initPage(container) {
        page.title.set(pageTitle);

        page.nav.active(2);
        
        $(container).load(pageTemplate);
    }

    return {
        init: initPage
    };
}());