/* global page */

var contactController = (function () {

    var pageTitle = 'Twitch Tools: Contact Us';
    var pageTemplate = '../resources/views/pages/contact.handlebars';

    function initPage(container) {
        page.title.set(pageTitle);

        page.nav.active(3);
        
        $(container).load(pageTemplate);
    }

    return {
        init: initPage
    };
}());