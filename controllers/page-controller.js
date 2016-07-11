/* global data, lang, moment, pagination, toastr, page, validator, swfobject, Twitch, templates */

var pageController = (function () {
    var container = null;
    var selectedLanguage = 'en';
    var config = {
        videos: {
            broadcasts: {
                pagination: {
                    activePage: 1,
                    pageSize: 9
                }
            },
            highlights: {
                pagination: {
                    activePage: 1,
                    pageSize: 9
                }
            }
        }
    };
    var videos = {
        broadcasts: [],
        highlights: []
    };

    var loadingImage = page.image.createLoadingImage({src: 'resources/images/loading.png'});

    function init(selector) {
        container = selector;
    }

    function home() {
        document.title = "Twitch Tools: Home";

        page.nav.active(1);

        $(container).load('../resources/views/pages/home.html', function () {
            var user = $('.header-user-container');

            var featuredStreamsContainer = $('.featured');
            featuredStreamsContainer.html(loadingImage);

            templates.get('featured-streams')
                    .then(function (template) {
                        data.stream.featured(6).then(function (streams) {
                            console.log(streams.featured);
//                            var featuredStreams = page.section.featured(streams.featured);
//                            featuredStreamsContainer.html(featuredStreams);
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
            channel.autocomplete({source: data.channel.list()});

            var uxButtonStream = $('#stream');
            var uxButtonPreview = $('#preview');
            var uxButtonDownload = $('#download');

            if (localStorage.getItem('username') !== null) {
                user.empty().append('Welcome, ' + localStorage.getItem('username'));
            }

            uxButtonStream.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[selectedLanguage]);
                    return;
                }

                var sectionSelector = '#section-stream';
                page.section.setActive(sectionSelector);

                var content = $(sectionSelector).find('div.section-content');
                content.html(loadingImage);

                data.channel
                        .stream(channelName)
                        .then(function (response) {
                            console.log(response);
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
                                toastr.error(lang.error.channel.name[selectedLanguage]);
                            }
                        });
            });

            uxButtonPreview.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[selectedLanguage]);
                    return;
                }

                data.channel
                        .preview(channelName)
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
                                toastr.error(lang.error.channel.offline[selectedLanguage]);
                            }
                        });
            });

            uxButtonDownload.on('click', function () {
                var channelName = channel.val().trim();
                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[selectedLanguage]);
                    return;
                }

                window.location.href = '#/download/' + channelName;
            });

            $(document).on("click", "li.menu-item > a", function () {
                $('.menu-item a').removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    function about() {
        document.title = "Twitch Tools: About";

        page.nav.active(2);
        $(container).load('../resources/views/pages/about.html');
    }

    function contact() {
        document.title = "Twitch Tools: Contact Us";

        page.nav.active(3);
        $(container).load('../resources/views/pages/contact.handlebars');
    }

    function download() {
        document.title = "Twitch Tools: Download";

        page.nav.active(4);
        $(container).load('../resources/views/pages/download.html', function () {
            var uxButtonDownloadVideo = $('#download-video');

            data.stats.totalDownloads().then(function (response) {
                $('#total-downloads').html(response.downloads);
            });

            uxButtonDownloadVideo.on("click", function () {
                var urlString = $.trim($('#video-url').val());
                if (urlString.length === 0) {
                    toastr.error(lang.error.url.length[selectedLanguage]);
                    return;
                }

                var urlParts = urlString.split('/');
                var id = urlParts.length > 1
                        ? urlParts[urlParts.length - 2] + urlParts[urlParts.length - 1]
                        : urlString;

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
                            toastr.error(lang.error.download[selectedLanguage]);
                        });
            });
        });
    }

    function profile(contex) {
        var channelName = contex.params.name || null;

        document.title = channelName.toUpperCase();

        $(container).load('../resources/views/pages/profile.html', function () {
            if (!validator.validate.channel(channelName)) {
                toastr.error(lang.error.channel.name[selectedLanguage]);
                window.location.href = '#/home';
            }

            var content = $('#section-download').find('div.section-content');
            content.html(loadingImage);

            data.channel
                    .broadcasts(channelName)
                    .then(function (broadcastsResponse) {
                        content.empty();

                        var name = $(document.createElement('h3'));
                        name.text('Channel: ' + channelName);

                        content.append(name);

                        var username = localStorage.getItem('username');
                        var accessToken = localStorage.getItem('access_token');

                        data.user.getUserChannelFollowRelationship(username, channelName, accessToken)
                                .then(function (response) {
                                    var channelActions = $(document.createElement('div'));
                                    channelActions.attr('id', 'channel-actions');

                                    if (response.hasOwnProperty('error')) {
                                        var followButton = page.button.create('follow-channel', channelName, 'Follow');
                                        channelActions.append(followButton);
                                    } else {
                                        var unfollowButton = page.button.create('unfollow-channel', channelName, 'Unfollow');
                                        channelActions.append(unfollowButton);
                                    }

                                    content.append(channelActions);
                                }).then(function () {
                            var highlightsList = page.list.createEmpty('highlights');
                            if (broadcastsResponse[0].hasOwnProperty('videos')) {
                                videos['highlights'] = page.items.createFromVideos(broadcastsResponse[0].videos);

                                var listSize = config.videos.highlights.pagination.pageSize;
                                var visibleHighlightsList = videos.highlights.slice(0, listSize);

                                highlightsList.append(visibleHighlightsList);
                            }

                            var highlightsCount = videos['highlights'].length;
                            if (highlightsCount > 0) {
                                var listSize = highlightsCount / config.videos.highlights.pagination.pageSize;
                                var listName = 'highlights';

                                var highlightsPagination = pagination.create(listSize, listName);
                                var highlightsTitle = $(document.createElement('h3'));
                                highlightsTitle.addClass('entries-title')
                                        .text('Highlights (' + highlightsCount + ')');

                                content.append(highlightsTitle);
                                content.append(highlightsList);
                                content.append(highlightsPagination);
                            }

                            var broadcastsList = page.list.createEmpty('broadcasts');
                            if (broadcastsResponse[1].hasOwnProperty('videos')) {
                                videos['broadcasts'] = page.items.createFromVideos(broadcastsResponse[1].videos);

                                var listSize = config.videos.broadcasts.pagination.pageSize;
                                var visibleBroadcastsList = videos.broadcasts.slice(0, listSize);

                                broadcastsList.append(visibleBroadcastsList);
                            }

                            var broadcastsCount = videos['broadcasts'].length;
                            if (broadcastsCount > 0) {
                                var listSize = broadcastsCount / config.videos.broadcasts.pagination.pageSize;
                                var listName = 'broadcasts';

                                var broadcastsPagination = pagination.create(listSize, listName);
                                var broadcastsTitle = $(document.createElement('h3'));
                                broadcastsTitle.addClass('entries-title')
                                        .text('Past Broadcasts (' + broadcastsCount + ')');

                                content.append(broadcastsTitle);
                                content.append(broadcastsList);
                                content.append(broadcastsPagination);
                            }
                        });
                    });

            $(document).on("click", "#follow-channel", function () {
                var channelName = $(this).attr('data-id');
                var username = localStorage.getItem('username');
                var accessToken = localStorage.getItem('access_token');

                if (username === null || accessToken === null) {
                    toastr.error('You are not logged in!');
                    return;
                }

                data.channel.follow(username, accessToken, channelName)
                        .then(function (data) {
                            toastr.success('You are now following ' + data.channel.display_name);

                            var unfollowButton = page.button.create('unfollow-chanel', channelName, 'Unfollow');
                            $('#channel-actions').html(unfollowButton);
                        }, function (err) {
                            toastr.error(err.statusText);
                        });
            });

            $(document).on("click", "#unfollow-channel", function () {
                var channelName = $(this).attr('data-id');
                var username = localStorage.getItem('username');
                var accessToken = localStorage.getItem('access_token');

                if (username === null || accessToken === null) {
                    toastr.error('You are not logged in!');
                    return;
                }

                data.channel.unfollow(username, accessToken, channelName)
                        .then(function () {
                            toastr.success('You have successfully unfollowed a channel!');

                            var followButton = page.button.create('follow-chanel', channelName, 'Follow');
                            $('#channel-actions').html(followButton);
                        }, function (err) {
                            toastr.error(err.statusText);
                        });
            });

            $(document).on("click", "img.video-preview", function () {
                var id = $(this).attr('data-id');
                var containerSelector = 'div[data-id="' + id + '"]';

                var content = $(containerSelector).find('p.box2');
                content.html(loadingImage);

                data.link.get(id)
                        .then(function (data) {
                            var list = page.list.createFromLinks(data, id);
                            content.html('<p>Download:</p>')
                                    .append(list);
                        }, function () {
                            content.empty();
                            toastr.error(lang.error.download[selectedLanguage]);
                        });
            });

            $(document).on("click", "ul.pagination > li", function () {
                var currentPageNumber = $(this).attr('data-page-number');
                var listName = $(this).parent().attr('data-list-name');

                var previousPageSelector = $('ul[data-list-name="' + listName + '"]');
                previousPageSelector.find('li[data-page-number="' + config.videos[listName].pagination.activePage + '"]')
                        .removeClass('active');

                config.videos[listName].pagination.activePage = currentPageNumber;

                var pageSize = config.videos[listName].pagination.pageSize;
                var startElement = (currentPageNumber - 1) * pageSize;
                var selectedItems = videos[listName].slice(startElement, startElement + pageSize);

                var selectedList = $('ul[data-video-list="' + listName + '"]');
                selectedList.html(selectedItems);

                $(this).addClass('active');
            });
        });
    }

    function login() {
        document.title = 'Twitch Tools: Login';

        page.nav.active(5);

        $(container).load('../resources/views/pages/login.html', function () {

        });
    }

    function auth(contex) {
        var access_token = contex.params.token || null;
        if (access_token !== null) {
            data.user.auth(access_token)
                    .then(function (response) {
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('username', response.token.user_name);
                    });
        }
    }

    return {
        init: init,
        home: home,
        download: download,
        about: about,
        contact: contact,
        profile: profile,
        login: login,
        auth: auth
    };
}());