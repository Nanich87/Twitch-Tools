/* global page, templates, data, lang, swfobject */

var videoController = (function () {
    var streamViewersTimer;

    function playVideo(context, language) {
        page.nav.active(1);

        templates.get('play')
                .then(function (template) {
                    data.video.get(context.params.video)
                            .then(function (result) {
                                context.$element().html(template(result));

                                if (result.hasOwnProperty('error') && result.hasOwnProperty('message')) {
                                    page.title.set(lang.video.notFound[language]);
                                } else {
                                    var pageTitle = result.channel.display_name + ': ' + result.title;

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

        page.nav.active(1);

        templates.get('live')
                .then(function (template) {
                    data.channel.get(context.params.channel)
                            .then(function (result) {
                                var stream = {
                                    data: result,
                                    channel: context.params.channel
                                };

                                context.$element().html(template(stream));

                                var pageTitle = '';

                                if (result.stream === null) {
                                    pageTitle = 'Channel ' + context.params.channel + ' is offline!';

                                    page.title.set(pageTitle);
                                } else {
                                    data.stats.live(result.stream.channel.name);

                                    pageTitle = result.stream.channel.display_name + ': ' + result.stream.game;

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
                                        data.channel.get(result.stream.channel.name)
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
}());