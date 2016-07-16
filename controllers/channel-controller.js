/* global page, data, language, toastr, lang, validator, pagination */

var channelController = (function () {

    var pageID = 4;
    var pageTemplate = '../resources/views/pages/profile.html';
    var pageConfig = {
        pagination: {
            highlights: {
                activePage: 1,
                pageSize: 9
            },
            broadcasts: {
                activePage: 1,
                pageSize: 9
            }
        }
    };
    var videoCollection = {
        broadcasts: [],
        highlights: []
    };

    function initPage(context, container, language) {
        var channelName = context.params.name || null;

        page.title.set(channelName.toUpperCase());

        page.nav.active(pageID);

        $(container).load(pageTemplate, function () {
            if (!validator.validate.channel(channelName)) {
                toastr.error(lang.error.channel.name[language]);

                window.location.href = '#/home';
            }

            var loadingImage = page.image.createLoadingImage({ src: 'resources/images/loading.png' });

            var content = $('#section-download').find('div.section-content');
            content.html(loadingImage);

            data.channel
                .broadcasts(channelName)
                .then(function (broadcastsResponse) {
                    content.empty();

                    var titleContainer = $(document.createElement('h3'));
                    titleContainer.text('Channel: ' + channelName);

                    content.append(titleContainer);

                    var username = localStorage.getItem('username');
                    var accessToken = localStorage.getItem('access_token');

                    data.user
                        .getUserChannelFollowRelationship(username, channelName, accessToken)
                        .then(function (response) {
                            var channelButtonsContainer = $(document.createElement('div'));
                            channelButtonsContainer.attr('id', 'channel-actions');

                            if (response.hasOwnProperty('error')) {
                                var followButton = page.button.create('follow-channel', channelName, 'Follow');
                                channelButtonsContainer.append(followButton);
                            } else {
                                var unfollowButton = page.button.create('unfollow-channel', channelName, 'Unfollow');
                                channelButtonsContainer.append(unfollowButton);
                            }

                            content.append(channelButtonsContainer);
                        }).then(function () {
                            var highlightsList = page.list.createEmpty('highlights');
                            if (broadcastsResponse[0].hasOwnProperty('videos')) {
                                videoCollection['highlights'] = page.items.createFromVideos(broadcastsResponse[0].videos);

                                var listSize = pageConfig.pagination.highlights.pageSize;
                                var visibleHighlightsList = videoCollection.highlights.slice(0, listSize);

                                highlightsList.append(visibleHighlightsList);
                            }

                            var highlightsCount = videoCollection['highlights'].length;
                            if (highlightsCount > 0) {
                                var listSize = highlightsCount / pageConfig.pagination.highlights.pageSize;
                                var listName = 'highlights';

                                var highlightsPagination = pagination.create(listSize, listName);
                                var highlightsTitle = $(document.createElement('h3'));
                                highlightsTitle
                                    .addClass('entries-title')
                                    .text('Highlights (' + highlightsCount + ')');

                                content
                                    .append(highlightsTitle)
                                    .append(highlightsList)
                                    .append(highlightsPagination);
                            }

                            var broadcastsList = page.list.createEmpty('broadcasts');
                            if (broadcastsResponse[1].hasOwnProperty('videos')) {
                                videoCollection['broadcasts'] = page.items.createFromVideos(broadcastsResponse[1].videos);

                                var listSize = pageConfig.pagination.broadcasts.pageSize;
                                var visibleBroadcastsList = videoCollection.broadcasts.slice(0, listSize);

                                broadcastsList.append(visibleBroadcastsList);
                            }

                            var broadcastsCount = videoCollection['broadcasts'].length;
                            if (broadcastsCount > 0) {
                                var listSize = broadcastsCount / pageConfig.pagination.broadcasts.pageSize
                                var listName = 'broadcasts';

                                var broadcastsPagination = pagination.create(listSize, listName);
                                var broadcastsTitle = $(document.createElement('h3'));
                                broadcastsTitle
                                    .addClass('entries-title')
                                    .text('Past Broadcasts (' + broadcastsCount + ')');

                                content
                                    .append(broadcastsTitle)
                                    .append(broadcastsList)
                                    .append(broadcastsPagination);
                            }
                        });
                });

            $(document).on('click', '#follow-channel', function () {
                var channelName = $(this).attr('data-id');
                var username = localStorage.getItem('username');
                var accessToken = localStorage.getItem('access_token');

                if (username === null || accessToken === null) {
                    toastr.error(lang.auth.notAuthorized[language]);

                    return;
                }

                data.channel
                    .follow(username, accessToken, channelName)
                    .then(function (data) {
                        toastr.success(lang.channel.follow.success[language]);

                        var unfollowButton = page.button.create('unfollow-chanel', channelName, 'Unfollow');

                        $('#channel-actions').html(unfollowButton);
                    }, function (err) {
                        toastr.error(err.statusText);
                    });
            });

            $(document).on('click', '#unfollow-channel', function () {
                var channelName = $(this).attr('data-id');
                var username = localStorage.getItem('username');
                var accessToken = localStorage.getItem('access_token');

                if (username === null || accessToken === null) {
                    toastr.error(lang.auth.notAuthorized[language]);

                    return;
                }

                data.channel
                    .unfollow(username, accessToken, channelName)
                    .then(function () {
                        toastr.success(lang.channel.unfollow.success[language]);

                        var followButton = page.button.create('follow-chanel', channelName, 'Follow');

                        $('#channel-actions').html(followButton);
                    }, function (err) {
                        toastr.error(err.statusText);
                    });
            });

            $(document).on('click', 'img.video-preview', function () {
                var id = $(this).attr('data-id');
                var containerSelector = 'div[data-id="' + id + '"]';

                var content = $(containerSelector).find('p.box2');
                content.html(loadingImage);

                data.link
                    .get(id)
                    .then(function (data) {
                        var list = page.list.createFromLinks(data, id);

                        content
                            .html('<p>Download:</p>')
                            .append(list);
                    }, function () {
                        content.empty();

                        toastr.error(lang.error.download[language]);
                    });
            });

            $(document).on('click', 'ul.pagination > li', function () {
                var currentPageNumber = $(this).attr('data-page-number');
                var listName = $(this).parent().attr('data-list-name');

                var previousPageSelector = $('ul[data-list-name="' + listName + '"]');
                previousPageSelector
                    .find('li[data-page-number="' + pageConfig.pagination[listName].activePage + '"]')
                    .removeClass('active');

                pageConfig.pagination[listName].activePage = currentPageNumber;

                var pageSize = pageConfig.pagination[listName].pageSize;
                var startElement = (currentPageNumber - 1) * pageSize;
                var selectedItems = videoCollection[listName].slice(startElement, startElement + pageSize);

                var selectedList = $('ul[data-video-list="' + listName + '"]');
                selectedList.html(selectedItems);

                $(this).addClass('active');
            });
        });
    }

    return {
        init: initPage
    };
} ());