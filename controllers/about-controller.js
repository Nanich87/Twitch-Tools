/* global page */

var aboutController = (function () {

    var pageID = 2;
    var pageTitle = 'Twitch Tools: About';
    var pageTemplate = '../resources/views/pages/about.html';

    function initPage(container) {
        page.title.set(pageTitle);

        page.nav.active(pageID);

        $(container).load(pageTemplate);
    }

    return {
        init: initPage
    };
} ());