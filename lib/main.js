"use strict";

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
            return c !== child;
        });
        return child;
    };

    Container.prototype.update = function update(dt, t) {
        this.children.forEach(function (child) {
            if (child.update) {
                // All elements in our game can (optionally) have an update method.
                child.update(dt, t);
            }
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
                }

                if (child.texture) {
                    ctx.drawImage(child.texture.img, 0, 0);
                }

                if (child.chilren) {
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
* classes of leaf nodes (game entities/models)
********************************************************/


var Text = function Text() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Text);

    this.pos = { x: 0, y: 0 };
    this.text = text;
    this.style = style;
    // this.update // updates can be set here too
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


var w = 640;
var h = 480;
var renderCanvas = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderCanvas.view);

var scene = new Container();

var texture = new Texture("./media/getting-started-ic-v1.jpg");

var sprite = new Sprite(texture);
sprite.pos.x = w / 2;
sprite.pos.y = h / 2;

scene.add(sprite);
renderCanvas.render(scene);

var sectionElement = document.querySelector("button[data-selector='welcome']");
sectionElement.addEventListener('click', function () {
    scene.update();
    renderCanvas.render(scene);
});

// Render the main container
// let dt = 0;
// let last = 0;

// function loop (ms) {
//     requestAnimationFrame(loop);

//     const t = ms / 1000;
//     dt = t  - last;
//     last = t;

//     scene.update();
//     renderCanvas.render(scene);

// }
// requestAnimationFrame(loop);

// /***************************************
// * Side-menu hiding/unhiding sections
// **************************************/
// // get all elements as an array that will act as a selector
// const selectors = Array.from(document.querySelectorAll('[data-selector]'));

// // get all elements that are sections
// const sections = Array.from(document.querySelectorAll('[data-section]'));

// // give each selector an event listener, remove active class
// selectors.forEach(function(selector) {
//     selector.addEventListener('click', toggleSections);
// });

// function toggleSections(e) {

//     // selected section
//     const sectionElement = document.querySelector(`section[data-section="${e.target.dataset.selector}"]`);
//     // const sectionAudioSrc = document.querySelector(`[data-section="${e.target.dataset.selector}"]`);

//     // hide all sections
//     sections.forEach(function(sectionElement) {
//         sectionElement.classList.add('is-display-none');
//     });

//     // unhide selected section
//     sectionElement.classList.remove('is-display-none');

//     // remove active class from all selectors
//     selectors.forEach(function(selector) {
//         selector.classList.remove('is-active');
//     });

//     // make current selector active class
//     e.target.classList.add('is-active');
// }