/* global page, data, language, toastr, lang, validator, pagination */

var channelController = (function () {

    var pageTemplate = '../resources/views/pages/profile.html';
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
    var videoCollection = {
        broadcasts: [],
        highlights: []
    };

    function initPage(context, container, language) {
        var channelName = context.params.name || null;

        page.title.set(channelName.toUpperCase());

        page.nav.active(4);

        $(container).load(pageTemplate, function () {
            if (!validator.validate.channel(channelName)) {
                toastr.error(lang.error.channel.name[language]);

                window.location.href = '#/home';
            }

            var loadingImage = page.image.createLoadingImage({src: 'resources/images/loading.png'});

            var content = $('#section-download').find('div.section-content');
            content.html(loadingImage);

            data.channel.broadcasts(channelName)
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
                                videoCollection['highlights'] = page.items.createFromVideos(broadcastsResponse[0].videos);

                                var listSize = config.videos.highlights.pagination.pageSize;
                                var visibleHighlightsList = videoCollection.highlights.slice(0, listSize);

                                highlightsList.append(visibleHighlightsList);
                            }

                            var highlightsCount = videoCollection['highlights'].length;
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
                                videoCollection['broadcasts'] = page.items.createFromVideos(broadcastsResponse[1].videos);

                                var listSize = config.videos.broadcasts.pagination.pageSize;
                                var visibleBroadcastsList = videoCollection.broadcasts.slice(0, listSize);

                                broadcastsList.append(visibleBroadcastsList);
                            }

                            var broadcastsCount = videoCollection['broadcasts'].length;
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

            $(document).on('click', '#follow-channel', function () {
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

            $(document).on('click', '#unfollow-channel', function () {
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

            $(document).on('click', 'img.video-preview', function () {
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

                            toastr.error(lang.error.download[language]);
                        });
            });

            $(document).on('click', 'ul.pagination > li', function () {
                var currentPageNumber = $(this).attr('data-page-number');
                var listName = $(this).parent().attr('data-list-name');

                var previousPageSelector = $('ul[data-list-name="' + listName + '"]');
                previousPageSelector.find('li[data-page-number="' + config.videos[listName].pagination.activePage + '"]')
                        .removeClass('active');

                config.videos[listName].pagination.activePage = currentPageNumber;

                var pageSize = config.videos[listName].pagination.pageSize;
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
}());