define(['underscore', 'jquery', 'text!./loading_2.tpl.html',
	'css!./loading.min.css', 'wbase', 'wjqueryext'
], function(_, $, deftpl, W, W) {
	console.log(W);
	var options = {
		tpl: deftpl,
		container: '#container',
		el_loading_percent: '.loading_precent',
		interval: 100,
		max: 100,
	};
	var $container;

	var handlerTimer = -1;
	var $el_loading_percent;
	var per = -1;
	var looppoints = 1;
	var _anim_end = false;
	var _2finish = false;
	var deferStart;
	var deferFinish;
	var ANI_TIME = 4000;
	var startTime = -1;

	var update_percent = function() {
		var s = '正在加载';
		var timePer = ((new Date().getTime()) - startTime) / ANI_TIME;
		if (per == -2) {
			s += '100%';
		} else if (options.max == 0) {
			s += '0%';
		} else {
			if (per >= 0) {
				var count = parseInt(timePer * 100 * per / options.max);
				if (count > 100)
					count = 100;
				s += count + '%';
			}

		}

		// for (var i = 0; i < looppoints; i++) {
		// 	s += '.';
		// }
		$el_loading_percent.text(s);
	};
	var looper = function() {
		if (looppoints > 3)
			looppoints = 0;
		looppoints++;
		update_percent();

		if (_anim_end && _2finish) {
			$el.remove();
			return;
		}
		handlerTimer = setTimeout(looper, options.interval);
	};
	var start = function(opt) {
		var defer = $.Deferred();

		_.extend(options, opt);
		$container = $(options.container);
		$container.empty();
		$el = $(options.tpl).appendTo($container);
		$el_loading_percent = $(options.el_loading_percent);
		W.delayon($el.find(".loading_text"), ANI_TIME, "webkitAnimationEnd", function() {
			_anim_end = true;
			_finish();
		}, false);
		per = 0;
		looper();
		defer.resolve();
		startTime = new Date().getTime();
		return defer.promise();
	};

	var update = function(curper, max) {
		if (per != -2) {
			per = curper;
		}
		options.max = max;
		update_percent();
	};

	var finish = function() {
		deferFinish = $.Deferred();
		_2finish = true;
		_finish();
		return deferFinish.promise();
	};

	var _finish = function() {
		if (_2finish && _anim_end) {
			update(-2, options.max);
			$el.remove();
			deferFinish.resolve();
		}
	};
	return {
		options: options,
		start: start,
		update: update,
		finish: finish,
	}
});