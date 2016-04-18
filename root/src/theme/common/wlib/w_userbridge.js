define(['underscore', 'jquery', 'URI'],
	function(_, $, URI) {
		var _UserBridge = {
			LOCAL_NAME: 'WOW_USER_INFO',
			URL_PARAM_NAME: 'uniqueKey',
			API_URL: 'http://api.iwasai.com',
			callbackUrl: window.location.href,
			gotoWeixinUrl: function() {
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx75b4cd808d4527ee&redirect_uri=' +
					encodeURIComponent('http://api.iwasai.com/third/weixin/getUniqueKey?url=' +
						this.callbackUrl) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
			},
			gotoWeiboUrl: function() {
				window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=4059665933&redirect_uri=http://api.iwasai.com/third/weibo/getUniqueKey?url=' +
					encodeURIComponent(this.callbackUrl) + '&response_type=code';
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
				var defer = $.Deferred();

				var self = this;
				var url = this.API_URL;
				if (this.isWeibo())
					url += '/third/weibo/getUserByUiniqueKey?uniqueKey=' + uniqueKey;
				else if (this.isWeixin())
					url += '/third/weixin/getUserByUiniqueKey?uniqueKey=' + uniqueKey;
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

					if (!_.isUndefined(localStorage))
						localStorage.setItem(self.LOCAL_NAME, JSON.stringify(json));
					defer.resolve(json);
				}).fail(function(json) {
					defer.reject(RES_GetUserByUiniqueKey);
				});
				return defer.promise();
			},
		};
		var UserBridge = {
			RES_REDIRECT: 'res_redirect',
			RES_UNKNOWN_AGENT: 'res_unknown_agent',
			getUserInfo: function() {
				var defer = $.Deferred();

				for (;;) {
					if (!_.isUndefined(localStorage) && localStorage.getItem(this.LOCAL_NAME) != null) {
						var lsUser = JSON.parse(localStorage.getItem(this.LOCAL_NAME));
						defer.resolve(lsUser);
						break;
					}
					var uri = new URI();
					if (uri.hasQuery(_UserBridge.URL_PARAM_NAME)) {
						var params = uri.search(_UserBridge.URL_PARAM_NAME);
						_UserBridge.getUserByUniqueKey(params[this.URL_PARAM_NAME]).then(function(user) {
							defer.resolve(user);
						}, function() {
							defer.reject(RES_OTHERS);
						});
						break;
					}
					if (_UserBridge.isWeixin()) {
						_UserBridge.gotoWeixinUrl();
						defer.reject(RES_REDIRECT);
						break;
					}
					if (_UserBridge.isWeibo()) {
						_UserBridge.gotoWeiboUrl();
						defer.reject(RES_REDIRECT);
						break;
					}
					if (_UserBridge.isAppClient()) {
						defer.reject();
						break;
					}
					defer.reject(this.RES_UNKNOWN_AGENT);
					break;
				}
				return defer.promise();
			}
		};
		return UserBridge;
	});