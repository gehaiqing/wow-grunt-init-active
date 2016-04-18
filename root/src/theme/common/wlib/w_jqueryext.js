;
(function(global) {
	var delayon = function() {
		var $el = arguments[0];
		var timeout = arguments[1];
		var event = arguments[2];
		var fn;
		var i=2;
		if (typeof arguments[3] == 'function') {
			fn = arguments[3];
			i=3;
		}
		i++;
		
		var args=new Array();
		var j=0;
		for(;i<arguments.length;i++){
			args[j]=arguments[i];
			j++;
		}
		
		var delegatefn = function() {
			if (!(timeouthandler === void 0)) {
				clearTimeout(timeouthandler)
			}
			if (!(fn === void 0))
				fn.call(global, args);
		}
		var timeouthandler = setTimeout(delegatefn, timeout);
		$el.on(event, delegatefn);
	};

	window.W || (window.W = {});
	W.delayon = delayon;

	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = W;
	} else if (typeof define === 'function' && (define.amd || define.cmd)) {
		define(function() {
			return W;
		});
	} else {
		this.W = W;
	}
}).call(function() {
	return this || (typeof window !== 'undefined' ? window : global);
});