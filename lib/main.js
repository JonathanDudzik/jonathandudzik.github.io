"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Renderer = function () {
    function Renderer(w, h) {
        _classCallCheck(this, Renderer);

        var canvas = document.createElement("canvas");
        this.w = canvas.width = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.context = canvas.getContext("2d");
        this.context = canvas.textBaseline = "top";
    }

    Renderer.prototype.render = function render(container) {
        var _this2 = this;

        var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        container.children.forEach(function (child) {
            if (child.visible == false) {
                return;
            }

            var context = _this2.context;

            // Handle transforms

            if (child.pos) {
                ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
            }

            // Draw the leaf nodes
            if (child.text) {
                console.log("here is an text file:" + child.text);
            }

            if (clear) {
                context.clearRect(0, 0, _this2.w, _this2.h);
            }
        });
    };

    return Renderer;
}();

var Text = function Text() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Text);

    this.pos = { x: 0, y: 0 };
    this.text = text;
    this.style = style;
};

/***************************************
 * Setup interface layout
**************************************/


var renderer = new Renderer(640, 380);
document.getElementById("board").appendChild(renderer.view);

var scene = new Container();
var lineOne = new Text("For we have thought", {
    font: "40pt Times New Roman",
    fill: "blue",
    align: "center"
});
lineOne.pos.x = 2;
lineOne.pos.y = 2;

scene.add(lineOne);

var dt = 0;
var last = 0;

function loopy(ms) {
    requestAnimationFrame(loopy);

    var t = ms / 1000; // Let's work in seconds
    dt = t - last;
    last = t;
}
requestAnimationFrame(loopy);

// For we have thought 
// the longer thoughts
// And gone the shorter way.
// And we have danced to devils’ tunes,
// Shivering home to pray;
// To serve one master in the night,
// Another in the day.