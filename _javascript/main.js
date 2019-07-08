class Container {
    constructor() {
        this.children = [];
    }
    
    add(child) {
        this.children.push(child);
        return child;
    }
    
    remove(child) {
        this.children = this.children.filter(c => c == child);
        return child;
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


class Renderer {
    constructor(tag) {
    }

    render(container) {
        function renderObject(container) {
            container.children.forEach(child => {
                if(child.visible == false) {
                    return;
                }
                
                if(child.image) {
                    console.log("here is an image file:" + child.image);
                }
                
                if(child.text) {
                    console.log("here is an text file:" + child.text);
                } 
                
                if(child.video) {
                    console.log("here is an video file:" + child.video);
                }

                if(child.audio) {
                    console.log("here is an audio file:" + child.audio);
                }
            })
        }
        renderObject(container);
    }
}

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
class Sound {
    constructor(src, options = {}) {
        this.options = Object.assign({ volume: 1 }, options);
        
        // configure audio element
        const audio = new Audio();
        audio.src = src;
        this.audio = audio;
        
        audio.addEventListener('error', () => {
            throw Error(`Error loading audio: ${src}`);
        }, false);
        
        audio.addEventListener("ended", () => {
            this.playing = false
        }, false);
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

/***************************************
 * Portal Objects
**************************************/
const renderSound = new Renderer();
const sounds = new Container();
const sound1 = new Sound("./media/test-audio.mp3");
sounds.add(sound1);
// console.log(sounds.children)

document.getElementById("button").addEventListener("click", () => {
    renderSound.render(sounds);
});



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

    sounds.sound1.play();
}