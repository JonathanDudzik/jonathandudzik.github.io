/***************************************
* Container
**************************************/
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

/********************************************************
* CanvasRenderer.js
********************************************************/
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

/********************************************************
* Sound class
********************************************************/
class Sound {
    constructor(src, options = {}) {
        this.src = src;
        this.options = Object.assign({ volume: 1 }, options);

        // configure audio element
        const audio = new Audio();
        audio.src = src;

        audio.addEventListener('error', () => {
            throw Error(`Error loading audio: ${src}`);
        }, false);

        audio.addEventListener("ended", () => {
            this.playing = false
        }, false);
            
        this.audio = audio;
    }

    play(overrides) {
        const { audio, options } = this;
        const opts = Object.assign({ time: 0 }, options, overrides);
        audio.volume = opts.volume;
        audio.currentTime = opts.time;
        audio.play();
        this.playing = true;
    }
    
    stop() {
        this.audio.pause();
        this.playing = false;
    }

    get volume() {
        return this.audio.volume;
    }

    set volume(volume) {
        this.options.volume = this.audio.volume = volume;
    }
}

/********************************************************
* classes of leaf nodes (game entities/models)
********************************************************/
class Text {
    constructor(text = "", style = {}) {
        this.pos = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
    }
}

class Texture {
    constructor (url) {
        this.img = new Image();
        this.img.src = url; 
    }
}

class Sprite {
    constructor(texture) {
        this.texture = texture;
        this.pos = { x: 0, y: 0 };
    }
}

/***************************************
* Set-up code
**************************************/
const w = 960;
const h = 720;
const renderCanvas = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderCanvas.view);
const speed = Math.random() * 150 + 50;
let dt = 0;
let last = 0;

/***************************************
 * Portal Objects
**************************************/
const scene = new Container();

const textures = {
    background1: new Texture("./media/Slide.JPG"),
    background2: new Texture("./media/Slide1.JPG"),
    background3: new Texture("./media/Slide2.JPG"),
    background4: new Texture("./media/Slide3.JPG"),
    background5: new Texture("./media/Slide4.JPG"),
    pointer1: new Texture("./media/pointer1.png")
}

const sounds = {
    sound1: new Sound('./media/test-audio.mp3'),
    sound2: new Sound('./media/test-audio2.mp3'),
}

// images (two ways to add images to scene object)
scene.add(new Sprite(textures.background2));

const pointer1 = new Sprite(textures.pointer1);
scene.add(pointer1);

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

/***************************************
* Animation loop
**************************************/

function loopy(ms) {
    requestAnimationFrame(loopy);

    const t = ms / 1000;
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
const selectors = Array.from(document.querySelectorAll('[data-selector]'));

// give each selector an event listener
selectors.forEach(function(selector) {
    selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {
    // remove active class from all selectors
    selectors.forEach(function(selector) {
        selector.classList.remove('is-active');
    });
    
    // make current selector active class
    e.target.classList.add('is-active');
}