var validator = (function () {

    function validateChannelName(name) {
        if (name.length < 4 || name.length > 25) {
            return false;
        }

        var channelNamePattern = new RegExp("/^[a-z0-9_]{4,25}$/ui");
        if (channelNamePattern.test(name)) {
            return false;
        }

        return true;
    }

    return {
        validate: {
            channel: validateChannelName
        }
    };
} ());