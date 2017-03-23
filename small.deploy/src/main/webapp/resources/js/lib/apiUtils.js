

(function (global, factory) {
    (typeof exports === 'object' && typeof module !== 'undefined') ? (module.exports = factory()) :// check commonjs environment
    (typeof define !== 'undefined' && define.amd) ? define(factory) : (global.apiUtils = factory()); // check amd environment
})(typeof window !== 'undefined' ? window : this, function () {

    var http = axios;
    //var apiHost = jsConfig.apiHost;
    var apiHost="http://localhost:8080";
    var api = {
        _checkArgs: function (args) {
            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            var data = args.length > 1 && args[1] !== undefined ? args[1] : {};
            var config = args.length > 2 && args[2] !== undefined ? args[2] : {};
            //data = $.param($.extend(data, {warehouseId: jsConfig.warehouseId}));
            data = $.param(data);
            config = $.extend(config, {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'}}); // add csrf check
            return {
                data: data,
                config: config
            };
        },
        _rebuildUrl: function (absoluteUrl, data) {
            return data == '' ? absoluteUrl : absoluteUrl += (absoluteUrl.indexOf('?') != -1) ? '&' : '?' + data;
        },
        get: function (url,suffix) {
            var absoluteUrl = apiHost;
            if (undefined == suffix) {
                suffix = ".do";
            }
            if (url.charAt(0) == "/") {
                absoluteUrl+= url + suffix;
            }
            var args = this._checkArgs(arguments);
            absoluteUrl = this._rebuildUrl(absoluteUrl, args.data);
            if(args.config != null) {
                return http.get(absoluteUrl,args.config);
            } else {
                return http.get(absoluteUrl);
            }
        },
        delete: function (url) {
            var absoluteUrl = apiHost + url;
            var args = this._checkArgs(arguments);
            absoluteUrl = this._rebuildUrl(absoluteUrl, args.data);
            if(args.config != null) {
                return http.delete(absoluteUrl,args.config);
            } else {
                return http.delete(absoluteUrl);
            }
        },
        head: function (url) {
            var absoluteUrl = apiHost + url;
            var args = this._checkArgs(arguments);
            absoluteUrl = this._rebuildUrl(absoluteUrl, args.data);
            if(args.config != null) {
                return http.head(absoluteUrl,args.config);
            } else {
                return http.head(absoluteUrl);
            }
        },
        post: function (url,suffix) {
            console.log(undefined);
            var absoluteUrl = apiHost+url;
            console.log(absoluteUrl);
            if (undefined == suffix) {
                suffix = ".do";
            }
            if (url.charAt(0) == "/") {
                absoluteUrl+= url + suffix;
            }
            var args = this._checkArgs(arguments);

            if(args.data) {
                if(args.config) {
                    return http.post(absoluteUrl, args.data, args.config);
                } else  {
                    return http.post(absoluteUrl, args.data);
                }
            } else {
                return http.post(absoluteUrl);
            }
        },
        put: function (url) {
            var absoluteUrl = apiHost + url;
            var args = this._checkArgs(arguments);

            if(args.data) {
                if(args.config) {
                    return http.put(absoluteUrl, args.data, args.config);
                } else  {
                    return http.put(absoluteUrl, args.data);
                }
            } else {
                return http.put(absoluteUrl);
            }
        },
        patch: function (url) {
            var absoluteUrl = apiHost + url;
            var args = this._checkArgs(arguments);

            if(args.data) {
                if(args.config) {
                    return http.patch(absoluteUrl, args.data, args.config);
                } else  {
                    return http.patch(absoluteUrl, args.data);
                }
            } else {
                return http.patch(absoluteUrl);
            }
        },
        jsonp: function (absoluteUrl) {
            var args = this._checkArgs(arguments);
            absoluteUrl = this._rebuildUrl(absoluteUrl, args.data);
            return $.ajax({
                url: absoluteUrl,
                jsonp: 'callback',
                dataType: 'jsonp'
            });
        }
    };
    return api;
});
