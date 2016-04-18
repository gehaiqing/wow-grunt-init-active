define(['wbase', 'theme/common/wlib2/w_base_director',
    './scene_first', './scene_main', './scene_share', './scene_loading', './scene_award',
    './scene_pc'
], function(W, WBaseDirector, SceneFirst, SceneMain, SceneShare, SceneLoading, SceneAward,
    ScenePC) {
    var Director = WBaseDirector.extend({
        initialize: function(options) {
            var _this = this;
            this.dao = options.dao;

            this.sceneFirst = new SceneFirst({
                el: '#container',
                director: this,
            });

            this.sceneMain = new SceneMain({
                el: '#container',
                director: this,
            });
            this.sceneShare = new SceneShare({
                el: '#container',
                director: this,
            });
            this.sceneLoading = new SceneLoading({
                el: '#container',
                director: this,
            });
            this.sceneAward = new SceneAward({
                el: '#container',
                director: this,
            });
            this.scenePC = new ScenePC({
                el: '#container',
                director: this,
            });

            _.extend(options, {
                scenes: {
                    // 'award':{
                    //     frag: '',
                    //     scene: this.sceneAward,
                    //     to: [],
                    // },
                    'loading': {
                        frag: '',
                        scene: this.sceneLoading,
                        to: ['first','pc'],
                    },
                    'first': {
                        frag: '',
                        scene: this.sceneFirst,
                        to: ['main', 'award'],
                    },
                    'main': {
                        frag: '',
                        scene: this.sceneMain,
                        to: ['share', 'award'],
                    },
                    'share': {
                        frag: 'share',
                        scene: this.sceneShare,
                        to: ['award','first'],
                    },
                    'award': {
                        frag: '',
                        scene: this.sceneAward,
                        to: [],
                    },
                    'pc': {
                        frag: '',
                        scene: this.scenePC,
                        to: [],
                    },
                    'default': {
                        frag: '',
                        scene: this.sceneLoading,
                        to: ['first'],
                    },
                },
            });


            this.configAudio();
            this._super(options);
        },
        start: function() {
            this._super();
        },
        configAudio: function() {
            this.audio = new Audio();
            var src = 'theme/music/bg.mp3';
            this.audio.src = src;
            this.audio['ke-src'] = src;
            this.audio.preload = 'auto';

        }
    });


    return Director;
});