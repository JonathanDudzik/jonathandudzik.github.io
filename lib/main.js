"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/***************************************
* Container
**************************************/
var Container = function () {
    function Container() {
        _classCallCheck(this, Container);

        this.pos = { x: 0, y: 0 };
        this.children = [];
    }

    Container.prototype.add = function add(child) {
        this.children.push(child);
        return child;
    };

    Container.prototype.remove = function remove(child) {
        this.children = this.children.filter(function (c) {
            return c == child;
        });
        // return child; // not sure what the purpose of this is...
    };

    Container.prototype.update = function update(dt, t) {
        var _this = this;

        this.children = this.children.filter(function (child) {
            if (child.update) {
                child.update(dt, t, _this); //why "this" as a parameter...
            }
            return child.dead ? false : true;
        });
    };

    return Container;
}();

/********************************************************
* CanvasRenderer.js
********************************************************/


var CanvasRenderer = function () {
    function CanvasRenderer(w, h) {
        _classCallCheck(this, CanvasRenderer);

        var canvas = document.createElement("canvas");
        this.w = canvas.width = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.ctx = canvas.getContext("2d");
    }

    CanvasRenderer.prototype.render = function render(container) {
        var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var ctx = this.ctx;

        function renderRec(container) {
            container.children.forEach(function (child) {
                if (child.visible == false) {
                    return;
                }
                ctx.save();

                if (child.pos) {
                    ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
                }

                if (child.text) {
                    var _child$style = child.style,
                        font = _child$style.font,
                        fill = _child$style.fill,
                        align = _child$style.align;

                    if (font) ctx.font = font;
                    if (fill) ctx.fillStyle = fill;
                    if (align) ctx.textAlign = align;
                    ctx.fillText(child.text, 0, 0);
                } else if (child.texture) {
                    ctx.drawImage(child.texture.img, 0, 0);
                }

                if (child.children) {
                    renderRec(child);
                }
                ctx.restore();
            });
        }
        if (clear) {
            ctx.clearRect(0, 0, this.w, this.h);
        }
        renderRec(container);
    };

    return CanvasRenderer;
}();

/********************************************************
* Sound class
********************************************************/


var Sound = function () {
    function Sound(src) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Sound);

        this.src = src;
        this.options = _extends({ volume: 1 }, options);

        // configure audio element
        var audio = new Audio();
        audio.src = src;

        audio.addEventListener('error', function () {
            throw Error("Error loading audio: " + src);
        }, false);

        audio.addEventListener("ended", function () {
            _this2.playing = false;
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
        key: "volume",
        get: function get() {
            return this.audio.volume;
        },
        set: function set(volume) {
            this.options.volume = this.audio.volume = volume;
        }
    }]);

    return Sound;
}();

/********************************************************
* classes of leaf nodes (game entities/models)
********************************************************/


var Text = function Text() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Text);

    this.pos = { x: 0, y: 0 };
    this.text = text;
    this.style = style;
};

var Texture = function Texture(url) {
    _classCallCheck(this, Texture);

    this.img = new Image();
    this.img.src = url;
};

var Sprite = function Sprite(texture) {
    _classCallCheck(this, Sprite);

    this.texture = texture;
    this.pos = { x: 0, y: 0 };
};

/***************************************
* Set-up code
**************************************/


var w = 960;
var h = 720;
var renderCanvas = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderCanvas.view);
var speed = Math.random() * 150 + 50;
var dt = 0;
var last = 0;

/***************************************
 * Portal Objects
**************************************/
var scene = new Container();

var textures = {
    background1: new Texture("./media/Slide.JPG"),
    background2: new Texture("./media/Slide1.JPG"),
    background3: new Texture("./media/Slide2.JPG"),
    background4: new Texture("./media/Slide3.JPG"),
    background5: new Texture("./media/Slide4.JPG"),
    pointer1: new Texture("./media/pointer1.png")
};

var sounds = {
    sound1: new Sound('./media/test-audio.mp3'),
    sound2: new Sound('./media/test-audio2.mp3')    
};

// images (two ways to add images to scene object)
scene.add(new Sprite(textures.background2));
var pointer1 = new Sprite(textures.pointer1);

/***************************************
* Object updates
**************************************/
pointer1.update = function (dt) {
    // console.log(pointer1.pos.x);
    this.pos.y -= speed * dt;
    if (this.pos.y < -32) {
        this.pos.y = 600;
    }
};

// adding items to scene
scene.add(pointer1);

/***************************************
* Animation loop
**************************************/

function loopy(ms) {
    requestAnimationFrame(loopy);

    var t = ms / 1000;
    dt = t - last;
    last = t;

    scene.update(dt, t);
    renderCanvas.render(scene);
}
requestAnimationFrame(loopy);

/***************************************
* Side-menu selectors
**************************************/
// get all elements as an array that will act as a selector
var selectors = Array.from(document.querySelectorAll('[data-selector]'));

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
}