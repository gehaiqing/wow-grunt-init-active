require.config({
	baseUrl: './',
	urlArgs: "v=20160204",
	//	urlArgs: "bust=" +  (new Date()).getTime(),
	paths: {
		jquery: 'theme/common/lib/jquery.min',
		zepto: 'theme/common/lib/zepto4jquery',
		URI: 'theme/common/wlib/w_url',
		backbone: 'theme/common/lib/backbone',
		state_machine: 'theme/common/lib/state-machine',
		jweixin: 'theme/common/lib/jweixin-1.0.0',
		wxbridge: 'theme/common/wxbridge_0/wxbridge_0',
		text: 'theme/common/lib/require-text',
		css: 'theme/common/lib/require-css',
		'require-css-builder': 'theme/common/lib/require-css-builder',
		'require-normalize': 'theme/common/lib/require-normalize',
		underscore: 'theme/common/lib/underscore-1.8.3.min',
		wbase: 'theme/common/wlib2/w_base',
		wjqueryext: 'theme/common/wlib2/w_jqueryext',
		wresloader: 'theme/common/wlib2/w_resloader',
		wuserbridge: 'theme/common/wlib2/w_userbridge',
		qrcode: 'theme/common/lib/jquery.qrcode.min'
	},
	shim: {
		'jquery': {
			exports: '$'
		},
		'zepto': {
			deps: ['jquery'],
			exports: '$'
		},

		'wbase': {
			deps: ['underscore'],
			exports: 'W',
		},
		'wjqueryext': {
			deps: ['wbase'],
			exports: 'W',
		},
		'wscratch': {
			deps: ['jquery'],
		},
		'state_machine': {
			exports: 'StateMachine',
		},
		'qrcode': {
			deps: ['jquery'],
		}
	}
});

require(['jquery', 'theme/js/index'], function($, Index) {
	$(window).ready(function() {
		new Index().run();
	});
});