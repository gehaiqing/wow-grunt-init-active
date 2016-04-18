define(['underscore', 'jquery', './const', 'wbase', 'wresloader', 'wxbridge', 'wuserbridge', 'URI'],
    function(_, $, Const, W, ResLoader, WXBridge, UserBridge, URI) {


        var DAO = W.WObject.extend({
            API_URL: 'http://portal.iwasai.com',
            BUY_LINK:'http://www.gewara.com/movie/285023640',
            GAME_ID: 12,
            PAGE_NUM: 10,
            member: {
                hasMore: true,
                curPage: 0
            },
            tieba: {
                hasMore: true,
                curPage: 0
            },
            fromUser: null,
            TEXT_PARAM: 'wgreet',
            USER_PARAM: 'wufrom',
            MUSIC_PARAM: 'wmusic',
            NAME_PARAM: 'wfromnick',
            LOGO_PARAM: 'wfromlogo',
            getUrlParam: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            },
            ajax: function(conf) {
                if (!!this.paramDebug) {
                    conf.data.debug = 1314;
                }
                $.ajax({
                    type: "get",
                    url: conf.url,
                    data: conf.data,
                    timeout: 15000,
                    dataType: 'jsonp',
                    jsonp: 'jsonpcallback'
                }).done(function(data) {
                    // console.log('success: ' + JSON.stringify(data));
                    if (!!this.paramDebug) {
                        alert('success: ' + JSON.stringify(data));
                    }
                    if (_.isFunction(conf.done))
                        conf.done(data);

                }).fail(function(data) {
                    // console.log('error: ' + JSON.stringify(data));
                    if (!!this.paramDebug) {
                        alert('error: ' + JSON.stringify(data));
                    }
                    if (_.isFunction(conf.fail))
                        conf.fail(data);
                }).always(function() {

                });
            },
            initialize: function(opts) {
                this.resLoader = new ResLoader();
                _.extend(this, opts);
            },
            initData: function() {
                // this.initPlatform();

                if (true) {
                    return $.when().then(_.bind(this.initParseParams, this))
                        .then(_.bind(this.initCheckUser, this))
                        .then(_.bind(this.initLoadData, this));
                } else {
                    return $.when();
                }

            },
            initLoadResource: function() {
                var defer = $.Deferred();
                this.resLoader.start({
                    resources: this.resources,
                    onProgress: function(opt) {
                        defer.notify(opt.cur, opt.total);
                    },
                    onComplete: function() {
                        defer.resolve();
                    }
                });
                console.log('initLoadResource');
                return defer.promise();
            },
            initParseParams: function() {
                var defer = $.Deferred();

                var URIsource = new URI();
                var params = URIsource.search(true); //使用这个解析出来的参数有问题。比如参数中有+
                this.paramDebug = this.getUrlParam('debug');
                this.fromUserKey = this.getUrlParam(this.USER_PARAM);
                this.textId = this.getUrlParam(this.TEXT_PARAM);
                this.musicId = this.getUrlParam(this.MUSIC_PARAM);

                console.log(window.location.hash);
                //其他客户端分享到微信时
                if (window.location.hash.indexOf('#share') >= 0 && this.getUrlParam(this.LOGO_PARAM) != null &&
                    UserBridge.getClient() == 'weixin') {
                    this.shouldRedirectToFirst = true;
                }
                defer.resolve();
                return defer.promise();
            },
            initCheckUser: function() {
                var defer = $.Deferred();
                if (!_.isUndefined(this.paramDebug) && this.paramDebug != null) {
                    this.user = {
                        unionid: "oMsa_jsDW-wCgRyBSddXbdu9woCo",
                        //unionid : "oMsa_jjPLohuPRQ0iVlJD1KEu3tM",
                        headimgurl: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLDhzTqDGEmtDt2ib7relBGUHBX5Wf6rhYPWghtKRGu9L8E33ANkBr8qKLY0atsEwvBTq4U7GkywtyA/0",
                    };
                    this.paramTB = 'f4Bni1z2r+3rZ37tg9OatczoOp8rmXIQI5Wv4qKqgfk=';
                    defer.resolve(this.user);
                } else {
                    var self = this;
                    UserBridge.getUserInfo().then(function(user) {
                        self.user = user;
                        console.log(user);
                        // defer.resolve();
                    }).fail(function() {
                        self.user = {
                            unionid: null,
                            userId: null,
                            thirdLogo: 'theme/images/default_userlogo.jpg',
                            thirdName: '',
                        }
                        defer.resolve();
                    }).always(function() {
                        if (self.fromUserKey != null) {
                            UserBridge.getFromUserByUniqueKey(self.fromUserKey).then(function(user) {
                                self.fromUser = user;
                                console.log('from ' + JSON.stringify(user));
                                defer.resolve();
                            });
                        } else {
                            if (self.getUrlParam(self.LOGO_PARAM) == null) {
                                self.fromUser = null;
                            } else {
                                self.fromUser = {
                                    thirdLogo: self.getUrlParam(self.LOGO_PARAM),
                                    thirdName: self.getUrlParam(self.NAME_PARAM),
                                }
                                if(self.fromUser.thirdName == '')
                                    self.fromUser.thirdName = '你的朋友';

                            }

                            defer.resolve();
                        }
                    });
                    // defer.resolve(this.user);
                }
                return defer.promise();
            },
            initLoadData: function() {
                var defer = $.Deferred();
                defer.resolve();

                return defer.promise();
            },
            initPlatform: function() {
                var browser = {
                    versions: function() {
                        var u = navigator.userAgent,
                            app = navigator.appVersion;
                        return { //移动终端浏览器版本信息   
                            trident: u.indexOf('Trident') > -1, //IE内核  
                            presto: u.indexOf('Presto') > -1, //opera内核  
                            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
                            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
                            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
                            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
                            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
                            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
                            iPad: u.indexOf('iPad') > -1, //是否iPad    
                            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部  
                        };
                    }(),
                    language: (navigator.browserLanguage || navigator.language).toLowerCase()
                }

                if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
                    browser.versions.iPhone || browser.versions.iPad) {
                    this.isMobile = true;
                } else {
                    this.isMobile = false;
                }
            },
            getAward: function() {
                var defer = $.Deferred();
                var url = this.API_URL + '/common/getAward';
                var para = {
                    gameId: this.GAME_ID,
                    userId: this.user.userId
                };
                var conf = {
                    url: url,
                    data: para,
                    done: function(data) {
                        defer.resolve(data);
                    },
                    fail: function(data) {
                        defer.reject();
                    }
                };
                if (this.user.userId == null) {
                    defer.reject();
                } else {
                    this.ajax(conf);
                }

                return defer.promise();
            },

        });
        return DAO;
    });