var validator = (function () {

    function validateChannelName(name) {
        if (name.length < 4 || name.length > 25) {
            return false;
        }

        var channelNamePattern = new RegExp("/^[a-zA-Z0-9_]{4,25}$/u");
        if (channelNamePattern.test(name) === false) {
            return false;
        }

        return true;
    }

    return {
        validate: {
            channel: validateChannelName
        }
    };
}());