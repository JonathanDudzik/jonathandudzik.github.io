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
        this.children = this.children.filter(c => c !== child);
        return child;
    }
    
    update (dt, t) {
        this.children.forEach(child => {
            if (child.update) { // All elements in our game can (optionally) have an update method.
                child.update(dt, t);
            }
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
                }

                if(child.texture) {
                    ctx.drawImage(child.texture.img, 0, 0);
                }


                if(child.chilren) {
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
* classes of leaf nodes (game entities/models)
********************************************************/
class Text {
    constructor(text = "", style = {}) {
        this.pos = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
        // this.update // updates can be set here too
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
const w = 640;
const h = 480;
const renderCanvas = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderCanvas.view);

const scene = new Container();

const texture = new Texture("./media/getting-started-ic-v1.jpg");

const sprite = new Sprite(texture);
sprite.pos.x = w / 2;
sprite.pos.y = h / 2;

scene.add(sprite);
renderCanvas.render(scene); 

const sectionElement = document.querySelector(`button[data-selector='welcome']`);
sectionElement.addEventListener('click', () => {
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