define(['wbase', 'underscore'], function(W, _) {
	var imgprocessor = function(options) {
		var image = new Image();
		image.onload = function() {
			W.doCallback(options, 'success');
		};
		image.onerror = function() {
			W.doCallback(options, 'error');
		};
		image.src = options.url;
	}

	var audioProcessor = function(options) {
		var audio = new Audio();

		audio.onloadstart = function() {
			if (this.networkState === 3) {
				W.doCallback(options, 'error');
			}
		};

		audio.onerror = function() {
			W.doCallback(options, 'error');
		};
		audio.onstalled = function() {
			W.doCallback(options, 'error');
		};

		//需手动调用audio.load()
		audio.oncanplaythrough = function() {
			console.log('oncanplaythrough ' + this.duration);
			W.doCallback(options, 'success');
		};


		_.extend(audio, {
			preload: 'auto',
			src: options.url,
			'ke-src': options.url
		});

		audio.load();
	}

	var ResLoader = W.WObject.extend({
		initialize: function(options) {
			var opts = options;
			opts || (opts = {});
			opts = _.defaults(opts, {
				baseUrl: './',
				resources: [],
				maxprocess: -1,
				processor: {
					'image': imgprocessor,
					'audio': audioProcessor
				},
			});
			this.defoptions = opts;
			this.status = -1;
			this.total = opts.resources.length || 0;
			this.curIndex = 0;
			this.inprocess = 0;

		},
		start: function(options) {
			console.log('loader start');
			var opts = _.defaults(options, this.defoptions);
			this.options = opts;

			this.status = 0;
			this.curIndex = 0;
			this.inprocess = 0;
			this.res = true;
			this.total = opts.resources.length || 0;

			W.doCallback(this.options, 'onStart');

			if (this.total == 0) {
				W.doCallback(this.options, 'onComplete', {
					result: true,
				});
				return;
			}
			this._doprocess();
		},
		_doprocess: function() {
			var _this = this;

			if (this.curIndex >= this.total) {
				return;
			}
			if (this.inprocess >= this.maxprocess)
				return;
			var res = this.options.resources[this.curIndex];
			var url;
			var type = 'image';
			if (_.isObject(res)) {
				url = res.url;
				type = res.type;
			} else {
				url = res;
			}
			this.status = 1;
			if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
				// url = r;
			} else {
				url = _this.options.baseUrl + url;
			}
			if (!_.has(this.options.processor, type)) {
				return;
			}
			var processor = this.options.processor[type];

			var docomplete = function(rescomp) {
				_this.inprocess--;
				W.doCallback(_this.options, 'onProgress', rescomp);
				_this._doprocess();
				if (_this.curIndex < this.total)
					return;
				if (_this.inprocess > 0)
					return;
				W.doCallback(_this.options, 'onComplete', _this.res);
			};
			var index = this.curIndex;
			processor({
				url: url,
				success: function() {
					docomplete({
						url: url,
						type: type,
						index: index,
						total: _this.total,
						cur: index + 1,
						result: true,
					});
				},
				error: function() {
					this.res = false;
					docomplete({
						url: url,
						type: type,
						index: index,
						cur: index + 1,
						total: _this.total,
						result: false,
					});
				},
			});
			this.inprocess++;
			this.curIndex++;
		},
	});
	return ResLoader;
});