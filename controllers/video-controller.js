/* global page, validator, selectedLanguage, toastr, lang, templates, data, swfobject */

var videoController = (function () {
    var streamViewersTimer;

    function setPageTitle(title) {
        document.title = title;
    }

    function playVideo(context) {
        page.nav.active(1);

        templates.get('play')
                .then(function (template) {
                    data.video.get(context.params.video)
                            .then(function (result) {
                                context.$element().html(template(result));

                                if (result.hasOwnProperty('error') && result.hasOwnProperty('message')) {
                                    setPageTitle(result.error + ': ' + result.message);
                                } else {
                                    setPageTitle(result.channel.display_name + ': ' + result.title);
                                    
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

                                if (result.stream === null) {
                                    setPageTitle('Channel ' + context.params.channel + ' is offline!');
                                } else {
                                    data.stats.live(result.stream.channel.name);
                                    
                                    setPageTitle(result.stream.channel.display_name + ': ' + result.stream.game);
                                    
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