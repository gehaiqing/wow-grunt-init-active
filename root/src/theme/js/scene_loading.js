define(['backbone', 'underscore', 'text!../tpl/loading.tpl.html', './dao', './const', 'qrcode'],
    function(
        Backbone, _, tpl, DAO, Const) {

        var SceneLoading = Backbone.View.extend({
            initialize: function(options) {
                this.director = options.director;
                this.dao = options.director.dao;
            },
            template: _.template(tpl),
            events: {

            },
            enterScene: function(event, from, to) {
                var self = this;
                // if(!this.dao.isMobile){
                //     this.director.go2scene('pc');
                //     return;
                // }
                this.$el.html(this.template({}));
                this.initData();
            },
            leaveScene: function(event, from, to) {

            },
            initData: function() {
                var self = this;
                this.dao.initLoadResource().then(function(){
                    console.log('load finish');
                    $('.wasai_loading').addClass('out');
                    setTimeout(function(){
                        self.director.go2scene('first');
                        $('.top_hongbao').show();
                    },600);
                    
                }).progress(function(res, max){
                    // console.log(res + ' ' + max);
                    $('.wasai_text').width(200*res/max);
                    $('.man').css('left',(159+200*res/max));
                });
            }

        });
        return SceneLoading;
    });
