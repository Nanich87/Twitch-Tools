var jsonRequester = (function () {

    function send(method, url, options) {
        options = options || {};

        var headers = options.headers || {};
        var data = options.data || undefined;
        
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                method: method,
                contentType: 'application/json',
                headers: headers,
                data: data,
                dataType: options.dataType,
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        
        return promise;
    }

    function get(url, options) {
        return send('GET', url, options);
    }

    function post(url, options) {
        return send('POST', url, options);
    }

    function put(url, options) {
        options = options || {};

        var data = options.data || undefined;
        
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                method: 'PUT',
                data: data,
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        
        return promise;
    }

    function del(url) {
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                method: 'DELETE',
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        
        return promise;
    }

    return {
        send: send,
        get: get,
        post: post,
        put: put,
        delete: del
    };
}());
