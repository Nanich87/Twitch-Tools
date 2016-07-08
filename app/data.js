/* global jsonRequester, Promise */

var data = (function () {

    function getChannelStream(channel) {
        var options = {
            dataType: 'json'
        };
        var url = 'stream.php?channel=' + channel.toLowerCase();

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getChannelPreview(channel) {
        var options = {
            dataType: 'jsonp'
        };
        var url = 'https://api.twitch.tv/kraken/streams/' + channel.toLowerCase();

        return jsonRequester.get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getChannelBroadcasts(channel) {
        var options = {
            dataType: 'jsonp'
        };
        var broadcastsUrl = 'https://api.twitch.tv/kraken/channels/' + channel.toLowerCase() + '/videos?limit=100&broadcasts=false';
        var highlightsUrl = 'https://api.twitch.tv/kraken/channels/' + channel.toLowerCase() + '/videos?limit=100&broadcasts=true';

        var broadcasts = jsonRequester.get(broadcastsUrl, options);
        var highlights = jsonRequester.get(highlightsUrl, options);

        return Promise.all([broadcasts, highlights]);
    }

    function playStream(data) {
        data.forEach(function (event) {
            if (event.event === "playerInit") {
                var player = $('#twitch-player');
                player.loadStream();
            }
        });
    }

    function followChannel(username, accessToken, channelName) {
        var url = 'https://api.twitch.tv/kraken/users/'
                + username
                + '/follows/channels/'
                + channelName;

        var options = {
            data: 'oauth_token=' + accessToken
        };

        return jsonRequester
                .put(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function unfollowChannel(username, accessToken, channelName) {
        var url = 'https://api.twitch.tv/kraken/users/'
                + username
                + '/follows/channels/'
                + channelName
                + '?oauth_token='
                + accessToken;

        return jsonRequester
                .delete(url)
                .then(function (response) {
                    return response;
                });
    }

    function playVideo(data) {
        data.forEach(function (event) {
            if (event.event === "playerInit") {
                var player = $('#twitch-player');
                player.loadVideo();
            }
        });
    }

    function getDownloadLink(videoId) {
        var videoPrefix = videoId.substring(0, 1);
        var url = videoPrefix === 'v'
                ? 'https://api.twitch.tv/api/vods/' + videoId.substring(1) + '/access_token?as3=t&oauth_token=' + localStorage.getItem('access_token')
                : 'https://api.twitch.tv/api/videos/' + videoId + '&oauth_token=' + localStorage.getItem('access_token');
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function auth(token) {
        var url = 'https://api.twitch.tv/kraken?oauth_token=' + token;
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getVideoInformation(id) {
        var url = 'https://api.twitch.tv/kraken/videos/' + id;
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getUserChannelFollowRelationship(user, channel, accessToken) {
        var url = 'https://api.twitch.tv/kraken/users/' + user + '/follows/channels/' + channel;
        var options = {
            dataType: 'jsonp',
            data: 'oauth_token=' + accessToken
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getStreamInformation(channel) {
        var url = 'https://api.twitch.tv/kraken/streams/' + channel;
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function getChannels() {
        var channels = localStorage.getItem('channels') || '';
        var list = channels.split(';');

        return list;
    }

    function addChannel(channel) {
        var channels = localStorage.getItem('channels') || '';

        if (channels.indexOf(channel) !== -1) {
            return;
        }

        if (channels === null || channels.length === 0) {
            channels = channel;
        } else {
            channels += ';' + channel;
        }

        localStorage.setItem('channels', channels);
    }

    function getFeaturedStreams(limit) {
        var url = 'https://api.twitch.tv/kraken/streams/featured?limit=' + limit;
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function updateLive(channel) {
        var url = 'stats.php?live=' + channel.toLowerCase();
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function updateDownload(video) {
        var url = 'stats.php?video=' + video.toLowerCase();
        var options = {
            dataType: 'jsonp'
        };

        return jsonRequester
                .get(url, options)
                .then(function (response) {
                    return response;
                });
    }

    function updateMultiTwitch(video) {

    }

    function getDownloadsCount() {
        var url = 'stats.php?total-downloads=1';
        var options = {
            dataType: 'json'
        };

        return jsonRequester
                .get(url, options);
    }

    return {
        channel: {
            stream: getChannelStream,
            preview: getChannelPreview,
            broadcasts: getChannelBroadcasts,
            live: playStream,
            play: playVideo,
            follow: followChannel,
            unfollow: unfollowChannel,
            get: getStreamInformation,
            list: getChannels,
            save: addChannel
        },
        link: {
            get: getDownloadLink
        },
        user: {
            auth: auth,
            getUserChannelFollowRelationship: getUserChannelFollowRelationship
        },
        video: {
            get: getVideoInformation
        },
        stream: {
            featured: getFeaturedStreams
        },
        stats: {
            live: updateLive,
            download: updateDownload,
            multitwitch: updateMultiTwitch,
            totalDownloads: getDownloadsCount
        }
    };
}());
