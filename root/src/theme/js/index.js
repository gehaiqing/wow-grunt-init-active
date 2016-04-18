define(['wbase', './dao', './director', 'wxbridge'],
    function(W, DAO, Director, wxbridge) {
        var App = W.WObject.extend({
            initialize: function() {
                this.dao = new DAO({
                    resources: [{
                        "url": "theme/images/90.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/arrow.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_fail_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_fail_text.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_fail_title.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_suc_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_suc_title.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_title.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_rule.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_rule_bg.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/bird.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/bird1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/bird2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/btn_bg.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/btn_light.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/close.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/dg_1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/dg_again.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/dg_finish.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/finger.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/first_text2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/first_to_text.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/float_paper.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/float_start_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/fly_page.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao3.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao4.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao5.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/hongbao_close.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/link_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_hand.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_light.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_man.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_noise.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_text.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_tv.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/loading_weiqi.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_text_1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_text_2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_text_3.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_3.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_4.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_5.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/m_title_6.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/main_btn_dg.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/main_change_hint.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/main_dg_hint.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/paper.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/pin.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/play_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/radio.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/recorder.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/share_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/share_text.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/share_tip.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/text_1.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/text_2.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/text_3.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/top_hongbao.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/top_hongbao_small.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/tv.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/tv_bg.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/tv_btn.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/tv_noise.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/user_logo.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/user_logo_border.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/zhufu.png",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_bg.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_get_suc_logo.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/award_logo.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/default_userlogo.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/first_bg.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/main_bg.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/newyork_pc_bg.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/share_bg.jpg",
                        "type": "image"
                    }, {
                        "url": "theme/images/tv_noise.gif",
                        "type": "image"
                    }],
                });
            },
            run: function() {
                var _this = this;
                _.bind(this.dao.initData, this.dao)().then(function() {
                    console.log('success');
                    _.bind(_this._run, _this)();
                    // Loader.finish();
                    // _this._run();
                }).fail(function(reason) {
                    console.log(reason);
                    console.log('fail');
                    _.bind(_this._run, _this)();
                }).progress(function(res, max) {
                    // console.log(res);
                    // Loader.update(res, max);
                });
                //this._checkUser();
            },
            _run: function() {
                this.director = new Director({
                    dao: this.dao
                });
                this.director.start();
                this.initWX();
                this.initHongbao();
                return;
            },
            getArgWithOutUniqueKey: function(str) {
                var ret = '';
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var paramName = strs[i].split("=")[0];
                    var paramValue = strs[i].split("=")[1];
                    if (paramName != 'uniqueKey') {
                        ret += paramName + "=" + paramValue + "&";
                    }

                }
                if (ret.substring(ret.length - 1) == '&') {
                    ret = ret.substring(0, ret.length - 1);
                }
                return ret;
            },
            initWX: function() {
                wxbridge.init();
                var self = this;
                var share_suc = function() {
                    wow_img_pv('a=transmit');
                    // alert('shared');
                    console.log('wx shared');
                    self.director.go2scene('award');
                };
                var url = window.location.href.split("?")[0];
                var search = location.search;
                if (search[0] === '?') {
                    search = search.substr(1);
                    url += '?' + this.getArgWithOutUniqueKey(search);
                }



                console.log(url);
                wxbridge.onShareObject.link = url;
                wxbridge.onShareObject4TimeLine.link = url;
                wxbridge.onShareObject.success = share_suc;
                wxbridge.onShareObject4TimeLine.success = share_suc;
                var logo;
                console.log(this.dao.fromUser);
                if (this.dao.fromUser == null) {
                    logo = this.dao.user.thirdLogo;
                } else {
                    logo = this.dao.fromUser.thirdLogo;
                }
                wxbridge.onShareObject.imgUrl = logo;
                wxbridge.onShareObject4TimeLine.imgUrl = logo;
            },
            initHongbao: function() {
                var self = this;
                console.log('initHongbao');
                $('.hongbao_close').on('touchstart', function(evt) {
                    evt.stopPropagation();
                    $('.hongbao').hide();
                })
                $('.hongbao').on('touchstart', function() {
                    window.location.href = self.dao.BUY_LINK;
                })


                $('.top_hongbao .get_hongbao').on('touchstart', function(evt) {
                    wow_img_pv('a=click&slot=newyork_goupiao');
                    setTimeout(function() {
                        location.href = self.dao.BUY_LINK;
                    }, 500);
                });

                $('.top_hongbao .push').on('touchstart', function(evt) {

                    $('.top_hongbao_big').removeClass('ani_show').addClass('ani_hide').on('webkitAnimationEnd', function() {
                        $('.top_hongbao_small').show();
                        $('.top_hongbao_big').off('webkitAnimationEnd');
                        $('.top_hongbao').height(0);
                    });
                });

                $('.top_hongbao_small').on('touchstart', function(evt) {
                    $(this).hide();
                    $('.top_hongbao_big').show();
                    $('.top_hongbao_big').addClass('ani_show').removeClass('ani_hide');
                    $('.top_hongbao').height('100%');
                });
            },
        });
        return App;
    });