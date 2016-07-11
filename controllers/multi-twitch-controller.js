/* global page, validator, selectedLanguage, toastr, lang */

var multiTwitchController = (function () {
    var pageTitle = 'MultiTwitch';
    var pageId = 2;
    var pageTemplate = '../resources/views/pages/multitwitch.handlebars';

    function setPageTitle(title) {
        document.title = title;
    }

    function initPage(container, language, context) {
        setPageTitle(pageTitle);

        page.nav.active(pageId);

        var channelNamesCollection = [];

        $(container).load(pageTemplate, function () {
            var windowHeight = $(window).height();
            var parentTopPostion = $(container).parent().position().top;

            var playersContainer = $('#players-container');
            playersContainer.height(windowHeight - parentTopPostion);

            var channelsList = $('#channels-list');

            var uxButtonAddPlayer = $('#add-player');

            var uxBoxMiltiTwitchUrl = $('#url');

            if (context !== null && context.params.splat !== null) {
                var channelNames = context.params.splat[0].split('/');

                $.each(channelNames, function (channelIndex, channelName) {
                    if (validator.validate.channel(channelName)) {
                        addChannel(channelName);
                    }
                });
            }

            uxButtonAddPlayer.on('click', function () {
                var channelName = $('#channel-name').val().toLowerCase();

                if (validator.validate.channel(channelName) === false) {
                    toastr.error(lang.error.channel.name[language]);

                    return;
                }

                if (channelNamesCollection.indexOf(channelName) !== -1) {
                    toastr.error(lang.error.channel.duplicate[language]);

                    return;
                }

                addChannel(channelName);

                updateMultiStreamUrl(channelNamesCollection);
            });

            $(document).on("click", "button.remove-channel", function () {
                var channelName = $(this).attr('data-id');

                removeChannel(channelName);

                updateMultiStreamUrl(channelNamesCollection);
            });

            function updateMultiStreamUrl(channelCollection) {
                var baseUrl = window.location.origin + '/#/multitwitch';

                $.each(channelCollection, function (channelIndex, channelName) {
                    baseUrl += ('/' + channelName);
                });

                uxBoxMiltiTwitchUrl.html(baseUrl);
            }

            function resizePlayers(playersContainer) {
                var playersCount = playersContainer.children().length;

                var playersContainerWidth = playersContainer.width();
                var playersContainerHeight = playersContainer.height();

                var bestHeight = 0;
                var bestWidth = 0;

                for (var perRow = 1; perRow <= playersCount; perRow++) {
                    var rowsCount = Math.ceil(playersCount / perRow);
                    var maxWidth = Math.floor(playersContainerWidth / perRow) - 4;
                    var maxHeight = Math.floor(playersContainerHeight / rowsCount) - 4;

                    if (maxWidth * 9 / 16 + 30 < maxHeight) {
                        maxHeight = maxWidth * 9 / 16 + 30;
                    } else {
                        maxWidth = (maxHeight - 30) * 16 / 9;
                    }

                    if (maxWidth > bestWidth) {
                        bestWidth = maxWidth;
                        bestHeight = maxHeight;
                    }
                }

                playersContainer.children().height(Math.floor(bestHeight));
                playersContainer.children().width(Math.floor(bestWidth));
            }

            function addChannel(channelName) {
                channelNamesCollection.push(channelName);

                var player = $(document.createElement('object'));
                player.attr('data', 'http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + channelName);
                player.attr('data-id', channelName);
                player.addClass('stream');

                playersContainer.append(player);

                var channelItem = $(document.createElement('li'));
                channelItem.attr('data-id', channelName);

                var channelItemName = $(document.createElement('span'));
                channelItemName.addClass('stream-text');
                channelItemName.text(channelName);

                channelItem.append(channelItemName);

                var uxButtonRemovePlayer = $(document.createElement('button'));
                uxButtonRemovePlayer.addClass('remove-channel btn btn-warning');
                uxButtonRemovePlayer.attr('data-id', channelName);
                uxButtonRemovePlayer.text('Remove');

                channelItem.append(uxButtonRemovePlayer);

                channelsList.append(channelItem);

                resizePlayers(playersContainer);
            }

            function removeChannel(channelName) {
                var nameIndex = channelNamesCollection.indexOf(channelName);

                if (nameIndex > -1) {
                    channelNamesCollection.splice(nameIndex, 1);
                }

                channelsList.find('li[data-id="' + channelName + '"]').remove();

                playersContainer.find('object[data-id="' + channelName + '"]').remove();

                resizePlayers(playersContainer);
            }
        });
    }

    return {
        init: initPage
    };
}());