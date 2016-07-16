/* global moment, authService */

var page = (function () {

    function setPageTitle(title) {
        document.title = title;
    }

    function trimText(text, length) {
        if (text === null) {
            return 'No Game';
        }

        var output = text.length > length ? text.substr(0, 15) + '...' : text;

        return output;
    }

    function createLoadingImage(options) {
        var src = options.src;
        var width = options.width || '48px';
        var height = options.height || '48px';

        var loadingImage = $(document.createElement('img'));
        loadingImage
            .attr('src', src)
            .css({ 'width': width, 'height': height });

        return loadingImage;
    }

    function setActiveItem(id) {
        $('.nav-item > a').removeClass('active');
        $('.nav-item > a[data-item-id="' + id + '"]').addClass('active');
    }

    function setActiveSection(activeSection) {
        $('section[data-type="section"]').addClass('hidden');
        $(activeSection).removeClass('hidden');
    }

    function setVisibility(selector, isVisible) {
        var selectedItem = $(selector);

        if (isVisible === 'true') {
            selectedItem
                .removeClass('hidden')
                .addClass('visible');
        } else {
            selectedItem
                .removeClass('visible')
                .addClass('hidden');
        }
    }

    function parseChunks(data) {
        var items = [];
        var partNumber = 1;

        $.each(data, function (index) {
            var part = $(document.createElement('a'));
            part.addClass('circle')
                .attr('href', data[index].url)
                .text(partNumber);

            var item = $(document.createElement('li'));
            item.addClass('item')
                .addClass('subentry')
                .html(part);

            items.push(item);

            partNumber++;
        });

        return items;
    }

    function parseVideos(data) {
        var items = [];

        $.each(data, function (index) {
            var videoTitle = $(document.createElement('h4'));
            videoTitle.addClass('entry-title')
                .html(data[index].title);

            var previewImage = $(document.createElement('img'));
            previewImage.attr('src', data[index].preview)
                .attr('alt', data[index].title)
                .attr('data-id', data[index]._id)
                .addClass('video-preview');

            var previewContainer = $(document.createElement('div'));
            previewContainer.addClass('container')
                .html(previewImage);

            var linkContainer = $(document.createElement('div'));
            linkContainer.attr('data-id', data[index]._id)
                .addClass('container')
                .append('<p class="box1">Recorded at: ' + moment(data[index].recorded_at).format("DD MMM YYYY") + ' | <a class="link" href="#/play/' + data[index]._id + '">Play</a></p>')
                .append($(document.createElement('p')).addClass('box2'));

            var item = $(document.createElement('li'));
            item.addClass('item')
                .addClass('entry')
                .append(videoTitle)
                .append(previewContainer)
                .append(linkContainer);

            items.push(item);
        });

        return items;
    }

    function parseFeaturedStreams(streams) {
        var items = [];

        $.each(streams, function (streamIndex) {
            var title = trimText(streams[streamIndex].title, 15);

            var streamTitle = $(document.createElement('div'));
            streamTitle.addClass('featured-stream-title');
            streamTitle.html(title);

            var streamImage = $(document.createElement('img'));
            streamImage.attr('src', streams[streamIndex].image)
                .attr('alt', streams[streamIndex].title)
                .attr('width', '140px')
                .attr('height', '78px')
                .addClass('video-preview');

            var url = '#/live/' + streams[streamIndex].stream.channel.name;

            var streamUrl = $(document.createElement('a'));
            streamUrl.attr('href', url)
                .attr('title', streams[streamIndex].title)
                .append(streamImage);

            var gameTitle = $(document.createElement('h4'));
            gameTitle.addClass('medium-text').html(trimText(streams[streamIndex].stream.game, 15));

            var gameTitleContainer = $(document.createElement('div'));
            gameTitleContainer.addClass('left-align')
                .append(gameTitle);

            var streamViewers = $(document.createElement('div'));
            streamViewers.addClass('left-align')
                .append('Viewers: ' + streams[streamIndex].stream.viewers);

            var streamContent = $(document.createElement('div'));
            streamContent.append(gameTitleContainer)
                .append(streamViewers);

            var item = $(document.createElement('li'));
            item.addClass('item')
                .addClass('subentry')
                .append(streamTitle)
                .append(streamUrl)
                .append(streamContent);

            items.push(item);
        });

        return items;
    }

    function parseLinks(data, vod) {
        var list = $(document.createElement('ul'));
        list.addClass('list')
            .addClass('list-subentries');

        if (data.hasOwnProperty('chunks') && data.chunks.hasOwnProperty('live')) {
            var chunks = page.items.createFromChunks(data.chunks.live);

            list.append(chunks);
        } else {
            var url = 'http://usher.justin.tv/vod/' + vod.substring(1) + '?nauthsig=' + data.sig + '&nauth=' + encodeURIComponent(data.token);
            var item = $(document.createElement('li'));
            item.append('<a class="circle" href="' + url + '">Playlist (M3U8)</a>');

            list.append(item);
        }

        return list;
    }

    function createEmptyList(name) {
        var list = $(document.createElement('ul'));
        list.attr('data-video-list', name)
            .addClass('list')
            .addClass('list-entries');

        return list;
    }

    function createButton(id, dataId, text) {
        var button = $(document.createElement('button'));
        button.addClass('btn')
            .addClass('btn-default')
            .attr('data-id', dataId)
            .attr('id', id)
            .text(text);

        return button;
    }

    function setUserDetails(username) {
        var userContainer = $('.header-user-container');
        userContainer.empty()
            .append('Welcome, ' + username);
    }

    function setAuthTabDetails(data) {
        var authTab = $('#auth-tab');
        authTab.attr('href', data.href)
            .html(data.title);
    }

    return {
        title: {
            set: setPageTitle
        },
        auth: {
            setUserDetails: setUserDetails,
            setAuthTabDetails: setAuthTabDetails
        },
        section: {
            setActive: setActiveSection,
            visible: setVisibility,
            featured: parseFeaturedStreams
        },
        nav: {
            active: setActiveItem
        },
        image: {
            createLoadingImage: createLoadingImage
        },
        list: {
            createFromLinks: parseLinks,
            createEmpty: createEmptyList
        },
        items: {
            createFromChunks: parseChunks,
            createFromVideos: parseVideos
        },
        button: {
            create: createButton
        }
    };
} ());