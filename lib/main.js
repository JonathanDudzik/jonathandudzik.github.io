'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/***************************************
* Container
class Container {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.children = [];
    }
    
    add(child) {
        this.children.push(child);
        return child;
    }
    
    remove(child) {
        this.children = this.children.filter(c => c == child);
        // return child; // not sure what the purpose of this is...
    }
    
    update (dt, t) {
        this.children = this.children.filter(child => {
            if (child.update) {
                child.update(dt, t, this); //why "this" as a parameter...
            }
            return child.dead ? false : true;
        });
    }
}
**************************************/

/********************************************************
* CanvasRenderer.js
class CanvasRenderer {
    constructor(w, h) {
        const canvas = document.createElement("canvas");
        this.w = canvas.width  = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.ctx = canvas.getContext("2d");
    }

    render(container, clear = true) {
        const { ctx } = this;
        function renderRec(container) {
            container.children.forEach(child => {
                if(child.visible == false) {
                    return;
                }
                ctx.save();
                
                if(child.pos) {
                    ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
                }
                
                if(child.text) {
                    const { font, fill, align } = child.style;
                    if(font) ctx.font = font
                    if(fill) ctx.fillStyle = fill;
                    if(align) ctx.textAlign = align;
                    ctx.fillText(child.text, 0, 0);
                } else if(child.texture) {
                    ctx.drawImage(child.texture.img, 0, 0);
                }
                
                if(child.children) {
                    renderRec(child);
                }
                ctx.restore();
            })
        }
        if(clear) {
            ctx.clearRect(0, 0, this.w, this.h);
        }
        renderRec(container);
    }
}
********************************************************/

/********************************************************
 * Sound class
 ********************************************************/
var Sound = function () {
    function Sound(src) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Sound);

        this.src = src;
        this.options = _extends({ volume: 1 }, options);

        // configure audio element
        var audio = new Audio();
        audio.src = src;

        audio.addEventListener('error', function () {
            throw Error('Error loading audio: ' + src);
        }, false);

        audio.addEventListener("ended", function () {
            _this.playing = false;
        }, false);

        this.audio = audio;
    }

    Sound.prototype.play = function play(overrides) {
        var audio = this.audio,
            options = this.options;

        var opts = _extends({ time: 0 }, options, overrides);
        audio.volume = opts.volume;
        audio.currentTime = opts.time;
        audio.play();
        this.playing = true;
    };

    Sound.prototype.stop = function stop() {
        this.audio.pause();
        this.playing = false;
    };

    _createClass(Sound, [{
        key: 'volume',
        get: function get() {
            return this.audio.volume;
        },
        set: function set(volume) {
            this.options.volume = this.audio.volume = volume;
        }
    }]);

    return Sound;
}();

/***************************************
 * Portal Objects
**************************************/


var sounds = {
    sound1: new Sound('./media/test-audio.mp3'),
    sound2: new Sound('./media/test-audio2.mp3')

    /***************************************
    * Side-menu selectors
    **************************************/
    // get all elements as an array that will act as a selector
};var selectors = Array.from(document.querySelectorAll('[data-selector]'));

// give each selector an event listener
selectors.forEach(function (selector) {
    selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {
    // remove active class from all selectors
    selectors.forEach(function (selector) {
        selector.classList.remove('is-active');
    });

    // make current selector active class
    e.target.classList.add('is-active');

    sounds.sound1.play();
}