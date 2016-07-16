/* global page, templates, data, lang, swfobject */

var videoController = (function () {

    var pageID = 1;
    var streamViewersTimer;

    function playVideo(context, language) {
        page.nav.active(pageID);

        templates
            .get('play')
            .then(function (template) {
                data.video
                    .get(context.params.video)
                    .then(function (response) {
                        context.$element().html(template(response));

                        if (response.hasOwnProperty('error') && response.hasOwnProperty('message')) {
                            page.title.set(lang.video.notFound[language]);
                        } else {
                            var pageTitle = response.channel.display_name + ': ' + response.title;

                            page.title.set(pageTitle);

                            swfobject.embedSWF(
                                "//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
                                "twitch-player",
                                "640",
                                "400",
                                "11",
                                null,
                                {
                                    eventsCallback: data.channel.play,
                                    videoId: context.params.video,
                                    embed: 1,
                                    auto_play: "true"
                                },
                                {
                                    allowScriptAccess: "always",
                                    allowFullScreen: "true"
                                });
                        }
                    });
            });
    }

    function playStream(context) {
        clearTimeout(streamViewersTimer);

        page.nav.active(pageID);

        templates
            .get('live')
            .then(function (template) {
                data.channel
                    .get(context.params.channel)
                    .then(function (response) {
                        var stream = {
                            data: response,
                            channel: context.params.channel
                        };

                        context.$element().html(template(stream));

                        var pageTitle = '';

                        if (response.stream === null) {
                            pageTitle = 'Channel ' + context.params.channel + ' is offline!';

                            page.title.set(pageTitle);
                        } else {
                            data.stats.live(response.stream.channel.name);

                            pageTitle = response.stream.channel.display_name + ': ' + response.stream.game;

                            page.title.set(pageTitle);

                            swfobject.embedSWF(
                                "//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
                                "twitch-player",
                                "640",
                                "400",
                                "11",
                                null,
                                {
                                    eventsCallback: data.channel.live,
                                    channel: context.params.channel,
                                    embed: 1,
                                    auto_play: "true"
                                },
                                {
                                    allowScriptAccess: "always",
                                    allowFullScreen: "true"
                                });

                            streamViewersTimer = setInterval(function () {
                                data.channel.get(response.stream.channel.name)
                                    .then(function (response) {
                                        $('#viewers').html(response.stream.viewers);
                                    });
                            }, 10000);
                        }
                    });
            });
    }

    return {
        play: playVideo,
        live: playStream
    };
} ());