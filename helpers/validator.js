var validator = (function () {

    function validateChannelName(name) {
        var lowerCaseName = name.toLowerCase();
        if (lowerCaseName.length < 4 || lowerCaseName.length > 25) {
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