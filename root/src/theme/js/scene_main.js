define(['backbone', 'underscore', 'text!../tpl/main.tpl.html', './dao', './const',
        'wxbridge', 'wuserbridge', 'qrcode'
    ],
    function(
        Backbone, _, tpl, DAO, Const, wxbridge, UserBridge) {

        var SceneMain = Backbone.View.extend({
            initialize: function(options) {
                this.director = options.director;
                this.dao = options.director.dao;
            },
            template: _.template(tpl),
            events: {
                // 'touchstart .start_btn': 'removeFloat',
                'touchstart .start_btn': 'removeFloat',
                'touchstart .btn_dg': 'doShowSelectText',
                'touchstart .btn_dg': 'doShowSelectText',
                'touchstart .text': 'doSelectText',
                'touchstart .btn_dg_finish': 'doFinish',
                'touchstart .btn_dg_again': 'doRestartDG',
            },
            musics: ['潇洒走一回', '海阔天空', '大海', '爱', '对你爱不完', '水手'],
            textId: 1,
            enterScene: function(event, from, to) {
                var self = this;
                this.$el.html(this.template({
                    user: this.dao.user
                }));
                this.initData();
            },
            leaveScene: function(event, from, to) {

            },
            initData: function() {
                this.video = document.getElementById('video');
                this.configChange();
                this._src = 1;
            },
            removeFloat: function() {
                var self = this;
                self.video.play();
                $('.video').show();
                this.director.audio.pause();
                $('.paper_p, .start_btn_p').addClass('out');
                $('.playing').show();
                $('.paper_p').one('webkitAnimationEnd', function() {
                    $('.float').hide();

                });
            },
            doShowSelectText: function() {
                console.log('doSelectText');
                this.director.audio.play();
                this.video.pause();
                $('.video').hide();
                $('.float_dg').show();
                $('.btn_dg').addClass('hide');
                $('#musicname').html('《' + this.musics[this._src - 1] + '》');
                $('.text').parent().addClass('text_in').one('webkitAnimationEnd', function() {
                    $(this).removeClass('text_in');
                });
            },
            doSelectText: function(event) {
                $('.text').removeClass('selected');
                $('.top').removeClass('top');
                $(event.target).parent().addClass('top');
                $(event.target).addClass('selected');
                $('.svg_div').removeClass('selected');
                $(event.target).find('.svg_div').addClass('selected');
                if ($(event.target).hasClass('text_1')) {
                    this.textId = 1;
                } else if ($(event.target).hasClass('text_2')) {
                    this.textId = 2;
                } else if ($(event.target).hasClass('text_3')) {
                    this.textId = 3;
                }
            },
            doFinish: function() {
                var self = this;
                self.hideTips();
                $('.btn_dg_finish_p,.btn_dg_again_p,.paper,.playing,.main').addClass('out');
                setTimeout(function() {
                    self.dao.user.thirdName = $('#nameInput').val();
                    if (UserBridge.getClient() == 'weixin') {
                        self.director.go2scene('share');
                    } else {
                        var url = window.location.href;
                        if (url.indexOf('#') >= 0) {
                            url = url.split('#')[0];
                        }
                        if(url.indexOf('?')>=0){
                            url = url.split('?')[0];
                        }
                        url += '?' + self.dao.NAME_PARAM + '=' + encodeURIComponent(self.dao.user.thirdName);
                        url += '&' + self.dao.MUSIC_PARAM + '=' + self._src;
                        url += '&' + self.dao.TEXT_PARAM + '=' + self.textId;
                        url += '&' + self.dao.LOGO_PARAM + '=' + encodeURIComponent(self.dao.user.thirdLogo);
                        url += '&comefrom=mobile';
                        url += '#share';

                        console.log(url);

                        window.location.replace(url);
                    }

                }, 2000);

                this.configWX();
            },
            configChange: function() {
                var startY = 0;
                var self = this;
                var timeOut = null;
                var playingTime = null;
                $('.finger_bg').off('touchstart').on('touchstart', function(evt) {
                    startY = evt.originalEvent.changedTouches[0].clientY;
                    self.hideTips();
                });
                $('.finger_bg').off('touchmove').on('touchmove', function(evt) {
                    evt.preventDefault();
                });
                $('.finger_bg').off('touchend').on('touchend', function(evt) {
                    var endy = evt.originalEvent.changedTouches[0].clientY;
                    var DIS = 10;
                    if (Math.abs(endy - startY) < 10)
                        return;

                    if (endy - startY > DIS) {
                        if (self._src < 6) {
                            self._src++;
                        } else if (self._src === 6) {
                            self._src = 1;
                        }
                    } else if (startY - endy > DIS) {
                        if (self._src > 1) {
                            self._src--;
                        } else if (self._src === 1) {
                            self._src = 6;
                        }
                    }
                    $('.tv_noise').show();
                    $('.m_title').removeClass('ani').hide();
                    clearTimeout(playingTime);
                    self.video.src = 'theme/video/' + self._src + '.mp4';
                    clearTimeout(timeOut);
                    timeOut = setTimeout(function() {
                        self.video.play();
                    }, 1000);

                    $('.main .tv_btn').css('transform', 'rotate(' + self._src * 50 + 'deg)');
                    $('.main .tv_btn').css('webkitTransform', 'rotate(' + self._src * 50 + 'deg)');

                });

                $('.m_title').on('webkitAnimationEnd', function() {
                    $(this).hide();
                })


                $('video').on('playing', function() {
                    console.log('video canplay');

                    $('.tv_noise').hide();
                    playingTime = setTimeout(function() {
                        $('.m_title').css('backgroundImage', 'url(theme/images/m_title_' + self._src + '.png)').addClass('ani').show();
                    }, 1500);

                });
                $('video').on('ended', function() {
                    if (self._src < 6) {
                        self._src++;
                    } else if (self._src === 6) {
                        self._src = 1;
                    }
                    self.video.src = 'theme/video/' + self._src + '.mp4';
                    self.video.play();
                    console.log('video canplay');
                    $('.tv_noise').show();
                    // $('.m_title').css('backgroundImage', 'url(theme/images/m_title_' + self._src + '.png)').addClass('ani').show();
                });

            },
            hideTips: function() {
                if (!this._tipHide)
                    this._tipHide = true;
                else
                    return;
                $('.change_hint,.dg_hint').hide();
            },
            doRestartDG: function() {
                // this.video.src = 'theme/video/1.mp4';
                this.video.play();
                $('.video').show();
                this.director.audio.pause();
                $('.float_dg').hide();
                $('.btn_dg').removeClass('hide');
                $('.svg_div,.text').removeClass('selected');
                this.textId = 1;
                this.hideTips();
            },
            configWX: function() {
                console.log('configWX');
                var url = window.location.href.split("?")[0];
                url += '?' + this.dao.USER_PARAM + '=' + this.dao.user.unionid;
                url += '&' + this.dao.MUSIC_PARAM + '=' + this._src;
                url += '&' + this.dao.TEXT_PARAM + '=' + this.textId;
                url += '&' + this.dao.NAME_PARAM + '=' + encodeURIComponent(this.dao.user.thirdName);
                url += '&comefrom=mobile';
                console.log(url);
                wxbridge.onShareObject.link = url;
                wxbridge.onShareObject4TimeLine.link = url;
                wxbridge.onShareObject.imgUrl = this.dao.user.thirdLogo;
                wxbridge.onShareObject4TimeLine.imgUrl = this.dao.user.thirdLogo;
            },
            closeHongbao: function() {
                $('.hongbao').hide();
            }


        });
        return SceneMain;
    });