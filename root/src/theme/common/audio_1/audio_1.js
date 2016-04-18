define(['underscore', 'zepto'],
	function(_, $) {
		var WAudioCoffee = {
			init: function($el) {
				if (_.isUndefined($el)) {
					$el = $('#mainaudio');
				}
				this.audioNode = $el;
				$('body')
					.on('wfn_start_run', _.bind(this.onStartRun, this));
				if(!this._audio)
					this._audio = new Audio();
				this._isplaying = false;
				this._handflip = true;
				this._pausebyclick = false;
				this.timer_txt = null;
				this._customAudioPlaying = false;
				this._customAudioPlayed = false;
				this._pageIndex = -1;
				this._customAudioPageIndex = -1;
				this._hasCustomAudio = false;
				this.txt_controller = this.audioNode
					.find('#txt_controller');

				$(this._audio).on('play', _.bind(this.onAudioPlay, this));
				$(this._audio).on('pause', _.bind(this.onAudioPause, this));
				this.audioNode.on('click', _.bind(this.onBtnFlipClicked,
					this));
				$(this._audio).on('ended', _.bind(this.loopKeeper, this));

				// media资源的加载
				var src = this.audioNode.attr('data-ws_src');
				this.configAudio(src);


				this.initCustomAudio();
				this.initPageChangeProcess();
			},
			loopKeeper: function() {
				this._audio.currentTime = 0;
				this._audio.play();
			},
			run: function() {
				if (this._audio) {
					this.audioNode.removeClass('wb_hidden');
					this.audioPlayerKeeperRunned = false;
					this.play();
				}
			},
			onStartRun: function() {
				this.run();
			},
			onBtnFlipClicked: function() {
				this._handflip = true;
				this.flip();
			},
			onAudioPlay: function() {
				//alert(' audio start');
				if (this._handflip) {
					this.audio_txt(this.txt_controller, true,
						this.timer_txt);

					$('#btn_audio2').removeClass('audio_stop');
					$('#btn_audio2').addClass('audio_play');
					this._handflip = false;
					this._pausebyclick = false;
				}
				this.audioPlayerKeeperRunned = true;
			},
			onAudioPause: function() {
				if (this._handflip) {
					this.audio_txt(this.txt_controller, false,
						this.timer_txt);

					$('#btn_audio2').removeClass('audio_play');
					$('#btn_audio2').addClass('audio_stop');
					this._handflip = false;
					this._pausebyclick = true;
				}
			},

			audio_txt: function(txt, val, time_txt) {
				if (val) {
					txt.text('打开');
				} else {
					txt.text('关闭');
				}

				if (time_txt) {
					clearTimeout(time_txt);
				}

				txt.removeClass('z-move z-hide');
				time_txt = setTimeout(function() {
					txt.addClass('z-move').addClass('z-hide');
				}, 1000)
			},
			flip: function() {
				if (this._isplaying) {
					this.stop();
				} else {
					this.play()
				}

			},
			play: function() {
				if (this._audio) {
					this._audio.play();
					this._isplaying = true;
				} else {
					this._isplaying = false;
				}
			},
			stop: function() {
				if (this._audio) {
					this._audio.pause();
					this._isplaying = false;
				} else {

				}
			},
			playerKeeper: function() {
				if (this.audioPlayerKeeperRunned) {
					return;
				}
				if (!this._isplaying) {
					return;
				}
				if (this._audio == null) {
					return;
				}
				this._handflip = true;
				this.play();
				// this.audioPlayerKeeperRunned = true;
			},
			initCustomAudio: function() {
				var self = this;
				var customAudioNode = $('#w_customaudio_0');
				if (customAudioNode.length == 0)
					return;
				this._hasCustomAudio = true;
				var conf = JSON.parse(customAudioNode.attr('data-wb_set_custom_audio'));
				if (_.isUndefined(conf))
					return;

				if (_.isUndefined(conf.pageIndex))
					this._customAudioPageIndex = -1;
				else
					this._customAudioPageIndex = conf.pageIndex;

				var src = customAudioNode.attr('data-ws_src');
				var options_audio = {
					loop: false,
					preload: "auto",
					src: src,
					"ke-src": src
				};
				this._customAudioSrc = src;
				return;

				this._customAudio = new Audio();
				_.extend(this._customAudio, options_audio);
				$(this._customAudio).attr('data-src', src);
				$(this._customAudio).attr('data-ke-src', src);

				$(this._customAudio).on('canplay', _.bind(function() {


				}, this));

				//play和durationchange先后顺序不一样；
				var hasSetTimeout = false;
				var customAudioDuration = 0;
				$(this._customAudio).on('play', _.bind(function() {
					//alert('_customAudio on play');
					this._customAudioPlaying = true;
					this._customAudioPlayed = false;
					if (customAudioDuration > 0 && !hasSetTimeout) {
						setTimeout(function() {
							if (self._customAudioPlaying) {
								self._customAudio.pause();
								self.play();
								self._customAudioPlayed = true;
								self._customAudioPlaying = false;
							}
						}, customAudioDuration * 1000 + 1000);
					}

				}, this));
				$(this._customAudio).on('durationchange', _.bind(function() {
					if (self._customAudio.duration > 0) {
						customAudioDuration = self._customAudio.duration;
						if (this._customAudioPlaying && !hasSetTimeout) {
							//三星 Android5.0上传后不触发END事件
							//alert(self._customAudio.duration);
							hasSetTimeout = true;
							setTimeout(function() {
								if (self._customAudioPlaying) {
									//alert('replay by timeout');
									self._customAudio.pause();
									self.play();
									self._customAudioPlayed = true;
									self._customAudioPlaying = false;
								}
							}, customAudioDuration * 1000 + 1000);
						}
					}

				}, this));

				$(this._customAudio).on('ended', _.bind(function() {
					setTimeout(function() {
						//alert('replay by ended');
						self.play();
						self._customAudioPlayed = true;
						self._customAudioPlaying = false;
					}, 100)

				}, this));



			},
			configAudio: function(src) {
				var options_audio = {
					// autoplay : true,
					loop: false,
					preload: "auto",
					src: src,
					"ke-src": src
				};
				_.extend(this._audio, options_audio);

				$(this._audio).attr('data-src', src);
				$(this._audio).attr('data-ke-src', src);
			},
			setPageIndex: function(pageIndex) {
				//alert(pageIndex);
				this._pageIndex = pageIndex;
				var self = this;
				if (this._customAudioPageIndex != pageIndex)
					return;
				if (this._customAudioPlaying)
					return;
				if (this._customAudioPlayed)
					return;
				if (this._isplaying) {
					this._audio.pause();
					this.curBGAudioTime = this._audio.currentTime;
					setTimeout(function() {
						var preSrc = self._audio.currentSrc;

						self.configAudio(self._customAudioSrc);
						self._customAudioPlaying = true;
						$(self._audio).on('ended', function() {
							self._customAudioPlayed = true;
							self._customAudioPlaying = false;
							self.configAudio(preSrc);
							$(self._audio).off('ended'); //2015.10.22	录音播放完成后循环问题；
							$(self._audio).on('ended', _.bind(self.loopKeeper, self));
							//在时间获取到到设置才有效；
							$(self._audio).on('durationchange', function() {
								if (self._audio.duration > 0) {
									self._audio.currentTime = self.curBGAudioTime;
									self._audio.muted = false;
									$(self._audio).off('durationchange'); //2015.10.22	录音播放完成后循环问题；
								}
							});
							self._audio.play();
							self._audio.muted = true;

						});
						self._audio.play();
						//alert('  play _customAudio');
					}, 100);

				}

			},
			processCustomAudio: function($el) {
				var self = this;
				if ($el.find('.custom_audio').length > 0) {
					var $node;
					$node = $($el.find('.custom_audio')[0]);
					var conf = JSON.parse($node.attr('data-wb_set_custom_audio'));
					if (_.isUndefined(conf))
						return;

					var src = $node.attr('data-ws_src');

					if (this._customAudioPlaying)
						return;
					if (this._customAudioPlayed)
						return;

					if (this._isplaying) {
						this._audio.pause();
						this.curBGAudioTime = this._audio.currentTime;
						setTimeout(function() {
							var preSrc = self._audio.currentSrc;

							self.configAudio(src);

							self._customAudioPlaying = true;
							$(self._audio).on('ended', function() {

								self._customAudioPlayed = true;
								self._customAudioPlaying = false;
								self.configAudio(preSrc);
								$(self._audio).off('ended'); //2015.10.22	录音播放完成后循环问题；
								$(self._audio).on('ended', _.bind(self.loopKeeper, self));
								//在时间获取到到设置才有效；
								$(self._audio).on('durationchange', function() {
									if (self._audio.duration > 0) {
										self._audio.currentTime = self.curBGAudioTime;
										self._audio.muted = false;
										$(self._audio).off('durationchange'); //2015.10.22	录音播放完成后循环问题；
									}
								});
								self._audio.play();
								self._audio.muted = true;

							});

							self._audio.play();
							//alert('  play _customAudio');
						}, 100);

					}
				}
			},
			/**
			 * 翻页事件中处理录音;
			 * 2015.11.09
			 */
			initPageChangeProcess: function() {
				var self = this;
				$(window).on('on_wow_pageChanged', function(event, value) {
					if (!_.isUndefined(value)) {
						self.processCustomAudio($(value));
					}
				});
			},
		};
		return WAudioCoffee;
	});