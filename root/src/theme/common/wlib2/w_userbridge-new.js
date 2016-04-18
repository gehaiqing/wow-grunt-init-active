define(['underscore', 'jquery', 'URI'],
    function(_, $, URI) {
        var setCookie = function(c_name, value, expiredays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ';path=/' + ';domain=.iwasai.com;')
        };
        // localStorage.clear();

        var _UserBridge = {
            LOCAL_NAME: 'WOW_USER_INFO_V1',
            URL_PARAM_NAME: 'uniqueKey',
            API_URL: 'http://api.iwasai.com',
            VERSION: 100,
            callbackUrl: window.location.href,
            /**
             * 初始化浏览器UA信息
             * @return {[type]} [description]
             */
            init: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    this.client = 'weixin';
                } else if (ua.match(/baidu/i) == 'baidu' || ua.match(/tieba/i) == 'tieba') {
                    this.client = 'baidu';
                } else if (ua.match(/WeiBo/i) == 'weibo') {
                    this.client = 'weibo';
                } else {
                    this.client = 'unknown';
                }

            },
            gotoWeixinUrl: function() {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx75b4cd808d4527ee&redirect_uri=' +
                    encodeURIComponent('http://api.iwasai.com/third/weixin/getUniqueKey?url=' +
                        this.callbackUrl) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
            },
            gotoWeiboUrl: function() {
                window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=4059665933&redirect_uri=http://api.iwasai.com/third/weibo/getUniqueKey?url=' +
                    encodeURIComponent(this.callbackUrl) + '&response_type=code';
            },
            gotoBaiduUrl: function() {
                window.location.href = 'https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=Uzq2fGGULU63Erar2uk0Dy7B&redirect_uri=' +
                    encodeURIComponent('http://api.iwasai.com/third/baidu/getUnionid?url=' + this.callbackUrl) +
                    '&state=123baidu&display=mobile';
            },
            isWeixin: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            },
            isWeibo: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/WeiBo/i) == 'weibo') {
                    return true;
                } else {
                    return false;
                }
            },
            isBaidu: function() {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/baidu/i) == 'baidu' || ua.match(/tieba/i) == 'tieba') {
                    return true;
                } else {
                    return false;
                }
            },
            isAppClient: function() {

            },
            getUrlParam: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            getLocalUserInfo: function() {
                if (!_.isUndefined(localStorage) && localStorage.getItem(this.LOCAL_NAME) != null) {
                    var lsUser = JSON.parse(localStorage.getItem(this.LOCAL_NAME));
                    return lsUser;
                }
                return null;
            },
            getUserByUniqueKey: function(uniqueKey) {
                // alert('getUserByUniqueKey ' + uniqueKey);
                var defer = $.Deferred();
                console.log(uniqueKey);
                var self = this;
                var url = this.API_URL;
                // if (this.isWeibo())
                //     url += '/third/weibo/getUserByUiniqueKey?uniqueKey=' + uniqueKey;
                // else if (this.isWeixin() || this.isBaidu())
                url += '/third/getUserByUniqueKey?uniqueKey=' + uniqueKey;
                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    async: false,
                    dataType: 'jsonp',
                    jsonp: 'jsonpcallback',
                }).done(function(json) {
                    // alert(JSON.stringify(json));
                    if (json.code == 100001 || json.code == 100002) {
                        alert('网页异常！ ');
                        window.location.href = window.location.href.split("?")[0];
                        return;
                    }

                    setCookie('userId', json.oriUserId, 30);
                    setCookie('unionid', json.unionid, 30);
                    setCookie('lId', json.lId, 30);

                    json.expire = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //7天过期时间
                    json.version = self.VERSION;

                    if (!_.isUndefined(localStorage))
                        localStorage.setItem(self.LOCAL_NAME, JSON.stringify(json));
                    defer.resolve(json);
                }).fail(function(json) {
                    defer.reject(RES_GetUserByUiniqueKey);
                });
                return defer.promise();
            },
            getFromUserByUniqueKey: function(uniqueKey) {
                var defer = $.Deferred();
                console.log(uniqueKey);
                var self = this;
                var url = this.API_URL;
                // if (this.isWeibo())
                //     url += '/third/weibo/getUserByUiniqueKey?uniqueKey=' + uniqueKey;
                // else if (this.isWeixin() || this.isBaidu())
                url += '/third/getUserByUniqueKey?uniqueKey=' + uniqueKey;
                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    async: false,
                    dataType: 'jsonp',
                    jsonp: 'jsonpcallback',
                }).done(function(json) {
                    // alert(JSON.stringify(json));
                    if (json.code == 100001 || json.code == 100002) {
                        alert('网页异常！ ');
                        window.location.href = window.location.href.split("?")[0];
                        return;
                    }
                    defer.resolve(json);
                }).fail(function(json) {
                    defer.reject(RES_GetUserByUiniqueKey);
                });
                return defer.promise();
            }
        };

        _UserBridge.init();

        var UserBridge = {
            RES_REDIRECT: 'res_redirect',
            RES_UNKNOWN_AGENT: 'res_unknown_agent',
            getUserInfo: function() {
                var defer = $.Deferred();

                // for (;;) {
                if (!_.isUndefined(localStorage) && localStorage.getItem(_UserBridge.LOCAL_NAME) != null) {
                    var lsUser = JSON.parse(localStorage.getItem(_UserBridge.LOCAL_NAME));
                    if (!_.isUndefined(lsUser.version) && !_.isUndefined(lsUser.expire)) {

                        var cur = new Date().getTime();
                        if (lsUser.expire > cur && lsUser.version >= _UserBridge.VERSION) {
                            defer.resolve(lsUser);
                            return defer.promise();
                        }

                    }
                }
                var uri = new URI();
                if (uri.hasQuery(_UserBridge.URL_PARAM_NAME)) {
                    var param = _UserBridge.getUrlParam(_UserBridge.URL_PARAM_NAME);
                    _UserBridge.getUserByUniqueKey(param).then(function(user) {
                        defer.resolve(user);
                    }, function() {
                        defer.reject(this.RES_OTHERS);
                    });
                    return defer.promise();
                }
                switch (_UserBridge.client) {
                    case 'weixin':
                        _UserBridge.gotoWeixinUrl();
                        defer.reject(this.RES_REDIRECT);
                        break;
                    case 'weibo':
                        _UserBridge.gotoWeiboUrl();
                        defer.reject(this.RES_REDIRECT);
                        break;
                    case 'baidu':
                        // _UserBridge.gotoBaiduUrl();
                        defer.reject(this.RES_UNKNOWN_AGENT);
                        break;
                    case 'unknown':
                        // _UserBridge.gotoBaiduUrl();
                        defer.reject(this.RES_UNKNOWN_AGENT);
                        break;
                };
                // if (_UserBridge.isWeixin()) {
                //     _UserBridge.gotoWeixinUrl();
                //     defer.reject(this.RES_REDIRECT);
                //     break;
                // }
                // if (_UserBridge.isWeibo()) {
                //     _UserBridge.gotoWeiboUrl();
                //     defer.reject(this.RES_REDIRECT);
                //     break;
                // }
                // if (_UserBridge.isBaidu()) {
                //     _UserBridge.gotoBaiduUrl();
                //     defer.reject(this.RES_REDIRECT);
                //     break;
                // }
                // if (_UserBridge.isAppClient()) {
                //     defer.reject();
                //     break;
                // }
                // defer.reject(this.RES_UNKNOWN_AGENT);
                // break;
                // }
                return defer.promise();
            },
            getClient: function() {
                return _UserBridge.client;
            },
            getFromUserByUniqueKey: function(key) {
                var defer = $.Deferred();
                _UserBridge.getFromUserByUniqueKey(key).then(function(data) {
                    defer.resolve(data);
                });
                return defer.promise();
            },
        };
        return UserBridge;
    });