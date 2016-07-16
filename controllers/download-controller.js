/* global page, data, language, toastr, lang */

var downloadController = (function () {

    var pageID = 4;
    var pageTitle = 'Twitch Tools: Download';
    var pageTemplate = '../resources/views/pages/download.html';

    function initPage(container, language) {
        page.title.set(pageTitle);

        page.nav.active(pageID);

        $(container).load(pageTemplate, function () {
            data.stats
                .totalDownloads()
                .then(function (response) {
                    $('#total-downloads').html(response.downloads);
                });

            var uxButtonDownloadVideo = $('#download-video');
            uxButtonDownloadVideo.on('click', function () {
                var urlString = $.trim($('#video-url').val());

                if (urlString.length === 0) {
                    toastr.error(lang.error.url.length[language]);

                    return;
                }

                var urlParts = urlString.split('/');
                var id = urlParts.length > 1
                    ? urlParts[urlParts.length - 2] + urlParts[urlParts.length - 1]
                    : urlString;

                var loadingImage = page.image.createLoadingImage({ src: 'resources/images/loading.png' });

                var content = $('#download-link');
                content.html(loadingImage);

                data.link
                    .get(id)
                    .then(function (response) {
                        data.stats.download(id);

                        var title = $(document.createElement('p'));
                        title.text('Download parts:');

                        var list = page.list.createFromLinks(response, id);

                        content
                            .html(title)
                            .append(list);
                    }, function () {
                        content.empty();

                        toastr.error(lang.error.download[language]);
                    });
            });
        });
    }

    return {
        init: initPage
    };
} ());