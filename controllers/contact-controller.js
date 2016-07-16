/* global page */

var contactController = (function () {

    var pageID = 3;
    var pageTitle = 'Twitch Tools: Contact Us';
    var pageTemplate = '../resources/views/pages/contact.handlebars';

    function initPage(container) {
        page.title.set(pageTitle);

        page.nav.active(pageID);

        $(container).load(pageTemplate);
    }

    return {
        init: initPage
    };
} ());