/* global data, lang, moment, pagination, toastr, page, validator, swfobject, Twitch, templates, authService */

var homeController = (function () {

    var pageID = 1;
    var pageTitle = 'Twitch Tools: Home';
    var pageTemplate = '../resources/views/pages/home.html';

    function initPage(container, language) {
        page.title.set(pageTitle);

        page.nav.active(pageID);

        var loadingImage = page.image.createLoadingImage({ src: 'resources/images/loading.png' });

        $(container).load(pageTemplate, function () {
            var featuredStreamsContainer = $('.featured');
            featuredStreamsContainer.html(loadingImage);

            templates
                .get('featured-streams')
                .then(function (template) {
                    data.stream
                        .featured(6)
                        .then(function (streams) {
                            var data = {
                                featured: streams.featured
                            };

                            featuredStreamsContainer.html(template(data));
                        }, function () {
                            featuredStreamsContainer.empty();

                            toastr.error('Cannot get featured streams!');
                        });
                });

            var channel = $('#channel-name');
            channel.autocomplete({ source: data.channel.list() });

            var uxButtonStream = $('#stream');
            var uxButtonPreview = $('#preview');
            var uxButtonDownload = $('#download');

            uxButtonStream.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[language]);

                    return;
                }

                var sectionSelector = '#section-stream';
                page.section.setActive(sectionSelector);

                var content = $(sectionSelector).find('div.section-content');
                content.html(loadingImage);

                data.channel
                    .stream(channelName)
                    .then(function (response) {
                        data.channel.save(channelName);

                        channel.autocomplete(
                            {
                                source: data.channel.list()
                            });

                        if (response.hasOwnProperty('url') && response.hasOwnProperty('file')) {
                            var list = $(document.createElement('ul'));
                            list.addClass('list');

                            var twitchPlayerItem = $(document.createElement('li'));
                            twitchPlayerItem.addClass('item');

                            var twitchPlayerLink = $(document.createElement('a'));
                            twitchPlayerLink
                                .addClass('btn')
                                .addClass('btn-square')
                                .attr('href', '#/live/' + channelName)
                                .text('Twitch Player');

                            twitchPlayerItem.append(twitchPlayerLink);

                            var externalPlayerItem = $(document.createElement('li'));
                            externalPlayerItem.addClass('item');

                            var externalPlayerLink = $(document.createElement('a'));
                            externalPlayerLink
                                .addClass('btn')
                                .addClass('btn-square')
                                .attr('href', response.url)
                                .text('External Player');

                            externalPlayerItem.append(externalPlayerLink);

                            list.append(twitchPlayerItem)
                                .append(externalPlayerItem);

                            content.html(list);
                        } else {
                            toastr.error(lang.error.channel.name[language]);
                        }
                    });
            });

            uxButtonPreview.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[language]);

                    return;
                }

                data.channel.preview(channelName)
                    .then(function (data) {
                        if (data.hasOwnProperty('stream') && data.stream !== null) {
                            var sectionSelector = '#section-preview';
                            page.section.setActive(sectionSelector);

                            var content = $(sectionSelector).find('div.section-content');
                            content
                                .html('<img class="stream-preview" src="' + data.stream.preview.medium + '" width="320px" height="180px" />')
                                .append('<h3>' + data.stream.channel.display_name + ' is playing ' + data.stream.game + '</h3>')
                                .append('<div>' + data.stream.channel.status + '</div>')
                                .append('<div>Viewers: ' + data.stream.viewers + ' | Followers: ' + data.stream.channel.followers + '</div>');
                        } else {
                            toastr.error(lang.error.channel.offline[language]);
                        }
                    });
            });

            uxButtonDownload.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[language]);

                    return;
                }

                window.location.href = '#/download/' + channelName;
            });

            $(document).on('click', 'li.menu-item > a', function () {
                $('.menu-item a').removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    return {
        init: initPage
    };
} ());